import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import Bar from './Bar'
import { useTimer } from 'react-timer-hook'
import Footer from './Footer'
const allHiraganas = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split("")

/** 
 * 機能
 * 
 */
function Hiragana() {
    const [hiraganas, setHiraganas] = useState<{ hiragana1: string, hiragana2: string }>({ hiragana1: "", hiragana2: "" })

    const [time, setTime] = useState(180)

    const createHiragana = () => {
        const hiragana1 = allHiraganas[Math.floor(Math.random() * allHiraganas.length)]
        const hiragana2 = allHiraganas[Math.floor(Math.random() * allHiraganas.length)]
        setHiraganas({ hiragana1, hiragana2 })
    }

    const before3min = new Date(new Date().getTime() - 30000)

    return (
        <div>
            <Bar />
            <Container sx={{ maxWidth: '480px' }}>
                <MyTimer expiryTimestamp={before3min} time={time} />
                <Box width={100} height={200} m={10}>
                    <Stack direction={"row"} mt={10} spacing={4}>
                        <Button sx={{ width: 80 }} variant="contained" onClick={createHiragana}>生成</Button>
                        <Typography variant='h3'>{hiraganas.hiragana1}</Typography>
                        <Typography variant='h3'>{hiraganas.hiragana2}</Typography>
                    </Stack>
                </Box>
            </Container>
            <Footer />
        </div >
    )
}



const MyTimer = (props: { expiryTimestamp: Date, time: number }) => {
    const { expiryTimestamp } = props

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') })


    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '100px' }}>
                <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <Stack spacing={2} direction={"row"} justifyContent={"center"}>
                <Button variant='contained' onClick={start}>Start</Button >
                <Button variant='contained' onClick={pause}>Pause</Button>
                {/* <Button variant='contained' onClick={resume}>Resume</Button> */}
                <Button variant='contained' onClick={() => {
                    const time = new Date()
                    time.setSeconds(time.getSeconds() + props.time)
                    restart(time)
                }}>Restart</Button>
            </Stack>


        </div>
    )
}

export default Hiragana
