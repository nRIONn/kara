import { test, expect } from "@playwright/test";
import { SongData } from "../App";
const fs = require("fs");

test("generate song names from manekineko ranking", async ({ page }) => {
  await page.goto("https://www.karaokemanekineko.jp/content/ranking/");

  const rows = page.locator(".table table tbody tr");
  await rows.nth(0).waitFor();

  const names = await rows.locator("td:nth-child(2)").allInnerTexts();

  const songNameData: SongData[] = names.map((name, i) => ({
    age: 2026,
    name,
    rank: i + 1,
  }));

  await expect(songNameData.length).toBe(300);

  const jsonStr = JSON.stringify(songNameData);
  fs.writeFileSync("public/song_data/ranking.json", jsonStr);
  console.log("取得曲数:", songNameData.length);
});
