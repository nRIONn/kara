import { Box, Button, Card, Stack } from '@mui/material'
import { useState } from 'react'
import Bar from './Bar'
import Hiragana from './Hiragana'
import Karaoke from './Karaoke'

function App() {
  const [route, setRoute] = useState("カラオケ")
  const handleRoute = (val: string) => setRoute(val)
  const Btn = (props: { route: string }) => <Button onClick={() => handleRoute(props.route)} variant='contained'>{props.route}</Button>

  return (
    <Box>
      <Bar />
      {route === "カラオケ" && <Karaoke />}
      {route === "平仮名" && <Hiragana />}
      <Box position={"fixed"} bottom={0} mb={10} textAlign={"center"} width={"100%"}>
        <Stack direction={"row"} spacing={4} justifyContent={"center"} >
          <Btn route="カラオケ" />
          <Btn route="平仮名" />
        </Stack >
      </Box>
    </Box>
  )
}



export default App
