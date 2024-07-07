import { test, expect, Page } from "@playwright/test";
import { SongData } from "../App";
const fs = require("fs");
// StartIndexは0~450
const startIndexList = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];
// 1985~2005
const ages = [
  1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997,
  1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005,
];
for (const age of ages) {
  // 年代ごとに並列に実行
  test(`generate song names age of ${age}`, async ({ page }) => {
    await testFunction(page, age);
  });
}

const testFunction = async (page: Page, age: Number) => {
  function writeFile(path: string, data: SongData[]) {
    const jsonStr = JSON.stringify(data);
    fs.writeFile(path, jsonStr, (err: Error) => {
      if (!err) {
        console.log(age + ":" + data.length);
      }
    });
  }

  const songNameData: SongData[] = [];
  for (const startIndex of startIndexList) {
    const url = `https://www.joysound.com/web/karaoke/ranking/age/ranking?age=${age}&startIndex=${startIndex}`;
    await page.goto(url);
    // これで0番目が生成されるまでauto-waitされる
    await page
      .locator(".jp-cmp-table-column-pt-001 .jp-cmp-ranking-title")
      .nth(0)
      .innerText();
    // 逆にAll系はauto-waitされないらしい
    const elements = await page
      .locator(".jp-cmp-table-column-pt-001 .jp-cmp-ranking-title")
      .allInnerTexts();
    for (const el of elements) {
      const idx = elements.findIndex((e) => el === e);
      songNameData.push({ age, name: el, rank: idx + startIndex + 1 });
    }
  }
  // 497までしかなかったりするから451↑で判定
  await expect(songNameData.length).toBeGreaterThan(451);
  // ファイルは年代ごとに保存する
  await writeFile(`public/song_data/${age}.json`, songNameData);
};
