import { ListItem, Typography } from "@mui/material";

/**
 * 曲名を履歴で使う機能
 * ・Jsonファイルから曲名一覧を取得しておく
 * 履歴で保存するときに、Numberとageから曲名をとって履歴に入れておく
 * 表示は重複した時だけ表示すればいい？
 */

// 履歴系の処理が長くなってきたので分割
export type History = {
  list: HistoryListItem[];
};

export type HistoryListItem = {
  number?: number;
  title: string;
  time: number;
  age: number;
};

// ミリ秒
const day = 86400000;

export const generateHistoryElements = (history: History) => {
  if (history.list.length < 2) return [];

  // 一次配列
  const tempArray: HistoryListItem[] = [];
  // 二次元配列
  const converetHistoryList: HistoryListItem[][] = [];
  history.list.forEach((a) => {
    if (tempArray.length && a.age !== tempArray[0].age) {
      // 年が変わってる
      // tempArrayを二次元配列の一部にする
      converetHistoryList.push([...tempArray]);
      // tempArrayの初期化
      tempArray.splice(0);
    }
    tempArray.push(a);
  });

  converetHistoryList.push(tempArray);
  converetHistoryList[0].pop();

  return converetHistoryList.reverse().map((historys) => (
    <ListItem key={historys[0].time} sx={{ display: "block" }}>
      <Typography
        component="span"
        sx={{ m: "0.5rem", display: "block", fontWeight: "bold" }}
      >
        {historys[0].age}年
      </Typography>
      {historys.reverse().map((his) => (
        <Typography
          component="span"
          sx={{ m: "0.5rem", display: "block" }}
          key={his.time}
        >
          {his.number}-{his.title}
        </Typography>
      ))}
    </ListItem>
  ));
};

export const getSongName = async (
  rank: number,
  age: number,
): Promise<string> => {
  // Jsonを開く song_data/{data.age}.json
  const res = await fetch(`${process.env.PUBLIC_URL}/song_data/${age}.json`);
  // const res = await fetch(`song_data/${data.age}.json`)
  type SongData = { age: string; name: string; rank: number };
  // ex) [{ "age": 1988, "name": "晩餐歌/tuki.", "rank": 2 }]
  const songDataList: SongData[] = await res.json();
  const song = songDataList.find((s) => s.rank === rank);

  if (!song) {
    console.error("song is not found.");
    throw new Error();
  }
  return song?.name;
};

export const storeHistory = (history: History) => {
  if (history.list.length) {
    localStorage.setItem("karaHistory", JSON.stringify(history));
  }
};

export const intializeHistory = () => {
  const historyJson = localStorage.getItem("karaHistory");
  try {
    if (historyJson) {
      // 24時間経過してるやつを捨てる
      const history = {
        list: (JSON.parse(historyJson) as History).list.filter(
          (his) => new Date().getTime() - his.time < day,
        ),
      };
      return history;
    }
    return { list: [] };
  } catch {
    console.error("json parse error");
    throw new Error("json parse error");
  }
};
