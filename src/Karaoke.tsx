import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import {
  getSongName,
  History,
  HistoryList,
  intializeHistory,
  storeHistory,
} from "./history"
const defaultUrl =
  "https://www.joysound.com/web/karaoke/ranking/age/ranking?age=1995&startIndex=0"


/**
 * 機能
 * ・乱数が振れる
 * ・リンクを出す
 * ・履歴保存（24時間？）
 * ・年代±10機能
 */
function Karaoke() {
  const [max, setMax] = useState(500)
  const [min, setMin] = useState(1)
  const [age, setAge] = useState(1995)
  const [rand, setRand] = useState(0)
  const [duplicationTitle, setDuplication] = useState("")
  const [history, setHistory] = useState<History>({ list: [] })
  const [url, setUrl] = useState(defaultUrl)
  const [remove, setRemove] = useState(false)

  const createRandom = async () => {
    try {
      const number = Math.ceil(Math.random() * (max - min + 1)) + min - 1
      const title = await getSongName(number, age)
      const duplictate = history.list.some((li) => li.title === title)

      // 重複確認して履歴に追加
      if (!duplictate) {
        const newHistory = {
          number: number,
          time: new Date().getTime(),
          age,
          title,
        }
        setHistory({ list: [...history.list, newHistory] })
        setDuplication("")
      } else {
        // 重複表示
        setDuplication(title)
      }

      setRand(number)
    } catch (e) {
      console.error(e)
    }
  }

  const changeAge = () => {
    setAge(Math.ceil(Math.random() * (1984 - 2006 + 1)) + 2006 - 1)
  }
  const createUrl = () => {
    try {
      const urlObj = new URL(defaultUrl)
      const stIdx = Math.floor((rand - 1) / 50) * 50
      // start
      urlObj.search = urlObj.search
        .split("&")
        .map((param) => {
          if (param.includes("startIndex")) {
            return `startIndex=${stIdx}`
          } else if (param.includes("age")) {
            return `age=${age}`
          } else {
            return param
          }
        })
        .join("&")
      setUrl(urlObj.href)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(createUrl, [rand, age])
  useEffect(() => storeHistory(history), [history])

  // 履歴の初期取得
  useEffect(() => setHistory(intializeHistory()), [])

  const deleteAllHistory = () => {
    localStorage.clear()
    setHistory({ list: [] })
    setRemove(false)
  }

  return (
    <div>
      <Container sx={{ maxWidth: "480px" }}>
        <Card style={{ padding: "50px" }}>
          <Stack spacing={2}>
            <Stack spacing={3} direction="row" justifyContent="center">
              <Box alignSelf="center" width="200px">
                <Typography variant="h2" sx={{ textAlign: "center" }}>
                  {rand}
                </Typography>
                {duplicationTitle && (
                  <Typography color="error">※重複</Typography>
                )}
                {duplicationTitle && (
                  <Typography color="error" sx={{ fontSize: 12 }}>
                    {duplicationTitle}
                  </Typography>
                )}
              </Box>
              <Stack spacing={2} justifyContent="center">
                <TextField
                  label="最大値"
                  value={max}
                  type="number"
                  onChange={(e) => setMax(Number(e.target.value))}
                />
                <TextField
                  label="最小値"
                  value={min}
                  type="number"
                  onChange={(e) => setMin(Number(e.target.value))}
                />
                <Stack direction="row">
                  <TextField
                    label="年代"
                    value={age}
                    type="number"
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                  <Button variant="contained" onClick={changeAge}>
                    乱数
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <Button
              sx={{ width: "100%" }}
              variant="contained"
              onClick={createRandom}
            >
              生成
            </Button>
            <a href={url}>
              <Button variant="outlined" sx={{ width: "100%" }}>
                開く
              </Button>
            </a>
            <Stack
              direction="row"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>履歴：{history.list.length}件</Typography>
              {remove ?
                <Stack direction={"row"} spacing={2}>
                  <Button variant="contained" color="error" onClick={deleteAllHistory}>
                    全部
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => setRemove(false)}>
                    キャンセル
                  </Button>
                </Stack> :
                <Button
                  variant="contained"
                  onClick={() => setRemove(true)}
                >
                  履歴削除
                </Button>
              }
            </Stack>
            <HistoryList history={history} isRemove={remove} setHistory={(h) => setHistory(h)} />
            <Typography>URL</Typography>
            <TextareaAutosize
              minRows={3}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Stack>
        </Card>
      </Container>
    </div >
  )
}

export default Karaoke
