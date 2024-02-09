import { Box, Button, Container, List, Stack, TextareaAutosize, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Bar from './Bar'
import { generateHistoryElements, History, intializeHistory, storeHistory } from './history'
import RemoveDialog from './RemoveDialog'
import Hiragana from './Hiragana'
const defaultUrl = "https://www.joysound.com/web/karaoke/ranking/age/ranking?age=1995&startIndex=0"

/** 
 * 機能
 * ・乱数が振れる
 * ・リンクを出す
 * ・履歴保存（24時間？）
 * ・年代±10機能
 */
function App() {
  const [max, setMax] = useState(500)
  const [min, setMin] = useState(1)
  const [age, setAge] = useState(1995)
  const [rand, setRand] = useState(0)
  const [isDuplication, setDuplication] = useState(false)
  const [history, setHistory] = useState<History>({ list: [] })
  const [url, setUrl] = useState(defaultUrl)
  const [openRemoveDialpg, setOpenRemoveDialog] = useState(false)

  const createRandom = () => {
    const number = Math.ceil(Math.random() * (max - min + 1)) + min - 1
    const duplictate = history.list.some(li => li.number === number && li.age === age)

    // 重複確認して履歴に追加
    if (!duplictate) setHistory({ list: [{ number: number, time: new Date().getTime(), age }, ...history.list] })

    setRand(number)

    // 重複表示
    setDuplication(duplictate)
  }

  const changeAge = () => {
    setAge(Math.ceil(Math.random() * (1984 - 2006 + 1)) + 2006 - 1)
  }
  const createUrl = () => {
    const urlObj = new URL(defaultUrl)
    const stIdx = (Math.floor((rand - 1) / 50)) * 50
    // start
    urlObj.search = urlObj.search.split('&').map((param) => {
      if (param.includes('startIndex')) {
        return `startIndex=${stIdx}`
      } else if (param.includes('age')) {
        return `age=${age}`
      } else {
        return param
      }
    }).join('&')
    setUrl(urlObj.href)
  }


  useEffect(createUrl, [rand, age])
  useEffect(() => storeHistory(history), [history])

  // 履歴の初期取得
  useEffect(() => setHistory(intializeHistory()), [])

  const historyList: JSX.Element[] = generateHistoryElements(history)

  const deleteHistory = () => {
    history.list.shift()
    setHistory({ list: [...history.list] })
    setOpenRemoveDialog(false)
  }

  const deleteAllHistory = () => {
    localStorage.clear()
    setHistory({ list: [] })
    setOpenRemoveDialog(false)
  }

  return (
    <div>
      <Bar />
      <Container sx={{ maxWidth: '480px' }}>
        <Stack spacing={2} >
          <Stack spacing={3} direction="row" justifyContent="center">
            <Box alignSelf="center" width="200px">
              <Typography variant="h2" sx={{ textAlign: 'center' }}>{rand}</Typography>
              {isDuplication && <Typography color="error">※重複</Typography>}
            </Box>
            <Stack spacing={2} justifyContent="center">
              <TextField label="最大値" value={max} type="number" onChange={(e) => setMax(Number(e.target.value))} />
              <TextField label="最小値" value={min} type="number" onChange={(e) => setMin(Number(e.target.value))} />
              <Stack direction="row">
                <TextField label="年代" value={age} type="number" onChange={(e) => setAge(Number(e.target.value))} />
                <Button variant='contained' onClick={changeAge}>乱数</Button>
              </Stack>
            </Stack>
          </Stack>
          <Button sx={{ width: '100%' }} variant="contained" onClick={createRandom}>生成</Button>
          <a href={url}><Button variant="outlined" sx={{ width: '100%' }}>開く</Button></a>
          <Typography>URL</Typography>
          <TextareaAutosize minRows={3} value={url} onChange={(e) => setUrl(e.target.value)} />
          <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>履歴：{history.list.length}件</Typography>
            <Button variant='contained' onClick={() => setOpenRemoveDialog(true)}>履歴削除</Button>
          </Stack>
          <List sx={{ display: 'flex', flexWrap: 'wrap' }}>{historyList}</List>
        </Stack>
        <Hiragana />
      </Container>
      <RemoveDialog isOpen={openRemoveDialpg}
        close={() => setOpenRemoveDialog(false)}
        deleteHistory={deleteHistory}
        deleteAll={deleteAllHistory} />
    </div >
  )
}

export default App
