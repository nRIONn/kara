import {
  Button,
  Card,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type FirstTakeSong = {
  id: string;
  title: string;
  artist: string;
  url: string;
  publishedAt: string | null;
};

type FirstTakeHistoryItem = FirstTakeSong & {
  time: number;
};

const historyKey = "firstTakeHistory";
const day = 86400000;

function FirstTake() {
  const [songs, setSongs] = useState<FirstTakeSong[]>([]);
  const [selectedSong, setSelectedSong] = useState<FirstTakeSong | null>(null);
  const [history, setHistory] = useState<FirstTakeHistoryItem[]>([]);
  const [duplicate, setDuplicate] = useState(false);
  const [remove, setRemove] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/song_data/first_take.json`,
        );
        if (!response.ok) {
          throw new Error(`Failed to load songs (${response.status})`);
        }
        const data = (await response.json()) as FirstTakeSong[];
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No FirstTake songs are available.");
        }
        setSongs(data);
      } catch (e) {
        console.error(e);
        setError("FirstTakeの曲データを読み込めませんでした。");
      } finally {
        setLoading(false);
      }
    };

    loadSongs();

    try {
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        const parsed = JSON.parse(saved) as FirstTakeHistoryItem[];
        setHistory(
          parsed.filter((item) => Date.now() - item.time < day),
        );
      }
    } catch (e) {
      console.error(e);
      setError("履歴を読み込めませんでした。");
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(historyKey, JSON.stringify(history));
    } else {
      localStorage.removeItem(historyKey);
    }
  }, [history]);

  const createRandom = () => {
    if (songs.length === 0) return;

    const song = songs[Math.floor(Math.random() * songs.length)];
    const isDuplicate = history.some((item) => item.id === song.id);
    setSelectedSong(song);
    setDuplicate(isDuplicate);

    if (!isDuplicate) {
      setHistory((current) => [...current, { ...song, time: Date.now() }]);
    }
  };

  const deleteAllHistory = () => {
    setHistory([]);
    setRemove(false);
  };

  return (
    <Container sx={{ maxWidth: "480px" }}>
      <Card style={{ padding: "50px" }}>
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center">
            FirstTake
          </Typography>
          <Stack minHeight="120px" justifyContent="center" spacing={1}>
            {selectedSong ? (
              <>
                <Typography textAlign="center">{selectedSong.title}</Typography>
                {selectedSong.artist && (
                  <Typography variant="body2" textAlign="center">
                    {selectedSong.artist}
                  </Typography>
                )}
                <Link
                  href={selectedSong.url}
                  target="_blank"
                  rel="noreferrer"
                  textAlign="center"
                >
                  YouTubeで見る
                </Link>
                {duplicate && (
                  <Typography color="error" textAlign="center">
                    ※履歴にあります
                  </Typography>
                )}
              </>
            ) : (
              <Typography textAlign="center">
                {loading ? "読み込み中..." : "曲を生成してください"}
              </Typography>
            )}
          </Stack>
          {error && (
            <Typography color="error" role="alert">
              {error}
            </Typography>
          )}
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            onClick={createRandom}
            disabled={loading || songs.length === 0}
          >
            生成
          </Button>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>履歴：{history.length}件</Typography>
            {remove ? (
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="error" onClick={deleteAllHistory}>
                  全部
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setRemove(false)}
                >
                  キャンセル
                </Button>
              </Stack>
            ) : (
              <Button variant="contained" onClick={() => setRemove(true)}>
                履歴削除
              </Button>
            )}
          </Stack>
          <Stack spacing={1}>
            {[...history].reverse().map((item) => (
              <Link
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.title}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}

export default FirstTake;
