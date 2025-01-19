import { List, ListItem, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

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

export const HistoryList = (props: {
  history: History;
  isRemove: boolean;
  setHistory: (history: History) => void;
}) => {
  const { history, isRemove, setHistory } = props;
  const [songName, setSongName] = useState("");

  if (history.list.length < 1)
    return <List sx={{ display: "flex", flexWrap: "wrap" }}></List>;

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

  // 選択されたタイトルを消す
  const deleteHistory = (title: string) => {
    setHistory({ list: history.list.filter((his) => his.title !== title) });
    setSongName("");
  };
  converetHistoryList.push(tempArray);

  const historyListElement = converetHistoryList.reverse().map((historys) => (
    <ListItem key={historys[0].time} sx={{ display: "block", p: 0 }}>
      <Typography
        component="span"
        sx={{ mb: 1, display: "block", fontWeight: "bold" }}
      >
        {historys[0].age}年
      </Typography>
      {historys.reverse().map((his) => (
        <Stack
          direction={"row"}
          style={{ alignItems: "center", justifyContent: "space-between" }}
          key={his.title}
        >
          <Typography
            component="span"
            sx={{ mb: 1, display: "block" }}
            key={his.time}
          >
            {his.number}-{his.title}
          </Typography>
          {isRemove && (
            <button
              style={{ background: "none", border: "none" }}
              onClick={() => setSongName(his.title)}
            >
              <TrashSVG />
            </button>
          )}
        </Stack>
      ))}
    </ListItem>
  ));

  return (
    <List sx={{ display: "flex", flexWrap: "wrap" }}>
      {historyListElement}
      <ConfirmDialog
        key={"dialog"}
        open={songName !== ""}
        title={songName}
        handleClick={() => deleteHistory(songName)}
        handleCancel={() => setSongName("")}
      />
    </List>
  );
};

export const getSongName = async (
  rank: number,
  age: number,
): Promise<string> => {
  // Jsonを開く song_data/{data.age}.json
  const res = await fetch(`${process.env.PUBLIC_URL}/song_data/${age}.json`);
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

const TrashSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="#5d5d5d"
    className="bi bi-trash"
    viewBox="0 0 16 16"
  >
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
  </svg>
);
