import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react'
import Bar from './Bar';

const defaultUrl = "https://www.joysound.com/web/karaoke/ranking/age/ranking?age=1990&startIndex=0&search=1990#jp-cmp-main"

function App() {
  const [max, setMax] = useState(500)
  const [min, setMin] = useState(1)
  const [rand, setRand] = useState(0)
  const [url, setUrl] = useState(defaultUrl)

  const createRandom = () => {
    setRand(Math.ceil(Math.random() * (max - min + 1)) + min - 1)
    // 乱数の正確性確認
    // let sum = 0
    // for (let i = 0; i < 100000000; i++)
    //   sum += Math.ceil(Math.random() * (max - min + 1)) + min - 1
    // console.log(sum)

    createUrl()
  }

  const createUrl = () => {
    const urlObj = new URL(url)
    const stIdx = (Math.ceil(rand / 50) - 1) * 50
    // start
    urlObj.search = urlObj.search.split('&').map((param) => {
      if (param.includes('startIndex')) {
        return `startIndex=${stIdx}`
      } else {
        return param
      }
    }).join('&')
    setUrl(urlObj.href)
    console.dir(urlObj)
  }

  /** 
   * 機能
   * ・乱数が振れる
   * ・リンクを出す
   * ・履歴保存（24時間？）
   * ・
   * https://www.joysound.com/web/karaoke/ranking/age/ranking?age=1990&startIndex=50&search=1990#jp-cmp-main
   */

  return (
    <div>
      <Bar />
      <Container sx={{ width: '480px', m: '16px' }}>
        <Stack spacing={2} >
          <Stack spacing={3} direction="row" justifyContent="center">
            <Box alignSelf="center" width="150px">
              <Typography variant="h2">{rand}</Typography>
            </Box>
            <Stack spacing={3} justifyContent="center">
              <TextField label="最大値" value={max} type="number" onChange={(e) => setMax(Number(e.target.value))} />
              <TextField label="最小値" value={min} type="number" onChange={(e) => setMin(Number(e.target.value))} />
            </Stack>
          </Stack>
          <Button sx={{ width: '100%' }} variant="contained" onClick={createRandom}>生成</Button>
        </Stack>
        <TextField label="base url" value={min} type="number" onChange={(e) => setMin(Number(e.target.value))} />
        <Button onClick={() => window.open(url)}>開く</Button>
      </Container>
    </div >
  );
}

export default App;
