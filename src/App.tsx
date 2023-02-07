import { AppBar, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react'
import Bar from './Bar';

function App() {
  const [max, setMax] = useState(0)
  const [min, setMin] = useState(0)
  const [rand, setRand] = useState(0)

  const createRandom = () => {
    setRand(Math.ceil(Math.random() * (max - min + 1)) + min - 1)
    // let sum = 0
    // for (let i = 0; i < 100000000; i++)
    //   sum += Math.ceil(Math.random() * (max - min + 1)) + min - 1
    // console.log(sum)
  }


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
      </Container>
    </div >
  );
}

export default App;
