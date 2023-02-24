import { Box, Button, Container, List, Stack, TextareaAutosize, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import Bar from './Bar';

const defaultUrl = "https://www.joysound.com/web/karaoke/ranking/age/ranking?age=1995&startIndex=0&search=1990#jp-cmp-main"

type History = {
  list: {
    number: number,
    time: number,
  }[]
}

// ミリ秒
const day = 86400000

/** 
 * 機能
 * ・乱数が振れる
 * ・リンクを出す
 * ・履歴保存（24時間？）
 * ・
 * https://www.joysound.com/web/karaoke/ranking/age/ranking?age=1990&startIndex=50&search=1990#jp-cmp-main
 */
function App() {
  const [max, setMax] = useState(500)
  const [min, setMin] = useState(1)
  const [rand, setRand] = useState(0)
  const [isDuplication, setDuplication] = useState(false)
  const [history, setHistory] = useState<History>({ list: [] })
  const [url, setUrl] = useState(defaultUrl)

  const createRandom = () => {
    const randamNum = Math.ceil(Math.random() * (max - min + 1)) + min - 1

    const duplictate = history.list.map(li => li.number).includes(randamNum)

    if (!duplictate) {
      // 履歴に追加
      setHistory({ list: [{ number: randamNum, time: new Date().getTime() }, ...history.list] })
    }

    // 重複確認
    setDuplication(duplictate)

    setRand(randamNum)
    // 乱数の正確性確認
    // let sum = 0
    // for (let i = 0; i < 100000000; i++)
    //   sum += Math.ceil(Math.random() * (max - min + 1)) + min - 1
    // console.log(sum)
  }

  const createUrl = () => {
    const urlObj = new URL(url)
    const stIdx = (Math.floor((rand) / 50)) * 50 - 1
    // start
    urlObj.search = urlObj.search.split('&').map((param) => {
      if (param.includes('startIndex')) {
        return `startIndex=${stIdx}`
      } else {
        return param
      }
    }).join('&')
    setUrl(urlObj.href)
  }

  const storeHistory = () => {
    if (history.list.length) {
      localStorage.setItem('karaHistory', JSON.stringify(history))
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(createUrl, [rand])
  useEffect(storeHistory, [history])

  useEffect(() => {
    // 履歴の初期取得
    const historyJson = localStorage.getItem('karaHistory')
    try {
      if (historyJson) {
        // 24時間経過してるやつを捨てる
        const history = { list: (JSON.parse(historyJson) as History).list.filter((his) => new Date().getTime() - his.time < day) }
        setHistory(history)
      }
    } catch {
      console.error('json parse error')
    }
  }, [])

  const historyList = history.list.map((h) => <Typography sx={{ m: '0.5rem' }} key={h.time}>{h.number}</Typography>)
  // eslint-disable-next-line no-restricted-globals
  const open = () => location.href = url

  const deleteHistory = () => {
    localStorage.clear()
    setHistory({ list: [] })
  }

  return (
    <div>
      <Bar />
      <Container sx={{ maxWidth: '480px' }}>
        <Stack spacing={2} >
          <Stack spacing={3} direction="row" justifyContent="center">
            <Box alignSelf="center" width="150px">
              <Typography variant="h2">{rand}</Typography>
              {isDuplication && <Typography color="error">※重複</Typography>}
            </Box>
            <Stack spacing={3} justifyContent="center">
              <TextField label="最大値" value={max} type="number" onChange={(e) => setMax(Number(e.target.value))} />
              <TextField label="最小値" value={min} type="number" onChange={(e) => setMin(Number(e.target.value))} />
            </Stack>
          </Stack>
          <Button sx={{ width: '100%' }} variant="contained" onClick={createRandom}>生成</Button>
          <a href={url}><Button variant="outlined" sx={{ width: '100%' }}>開く</Button></a>
          <Typography>URL</Typography>
          <TextareaAutosize minRows={5} value={url} onChange={(e) => setUrl(e.target.value)} />
          <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>履歴：{history.list.length}件</Typography>
            <Button variant='contained' onClick={deleteHistory}>履歴削除</Button>
          </Stack>
          <List sx={{ display: 'flex', flexWrap: 'wrap' }}>{historyList}</List>
        </Stack>
      </Container>
    </div >
  );
}

export default App;
