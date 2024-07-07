import {
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTimer } from "react-timer-hook";
const allHiraganas =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split(
    "",
  );

/**
 * 機能
 *
 */
function Hiragana() {
  const [hiraganas, setHiraganas] = useState<{
    hiragana1: string;
    hiragana2: string;
  }>({ hiragana1: "？", hiragana2: "？" });
  const createHiragana = () => {
    const hiragana1 =
      allHiraganas[Math.floor(Math.random() * allHiraganas.length)];
    const hiragana2 =
      allHiraganas[Math.floor(Math.random() * allHiraganas.length)];
    setHiraganas({ hiragana1, hiragana2 });
  };

  const before3min = new Date(new Date().getTime() - 30000);

  return (
    <Container style={{ display: "grid", justifyContent: "center" }}>
      <Card
        style={{ width: "fit-content", padding: "40px", marginBottom: "30px" }}
      >
        <MyTimer expiryTimestamp={before3min} />
      </Card>
      <Card
        style={{ padding: "50px", display: "grid", justifyContent: "center" }}
      >
        <Stack direction={"row"} spacing={6} style={{ marginBottom: "20px" }}>
          <Typography variant="h3">{hiraganas.hiragana1}</Typography>
          <Typography variant="h3">{hiraganas.hiragana2}</Typography>
        </Stack>
        <Button
          sx={{ width: 150 }}
          variant="contained"
          onClick={createHiragana}
        >
          生成
        </Button>
      </Card>
    </Container>
  );
}

const MyTimer = (props: { expiryTimestamp: Date }) => {
  const { expiryTimestamp } = props;

  const { seconds, minutes, hours, days, start, pause, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });
  const [time, setTime] = useState(180);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "80px" }}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
      <Stack spacing={2} direction={"row"} justifyContent={"center"}>
        <Button variant="contained" onClick={start}>
          Start
        </Button>
        <Button variant="contained" onClick={pause}>
          Pause
        </Button>
        {/* <Button variant='contained' onClick={resume}>Resume</Button> */}
        <Button
          variant="contained"
          onClick={() => {
            const now = new Date();
            now.setSeconds(now.getSeconds() + time);
            restart(now);
          }}
        >
          Restart
        </Button>
      </Stack>
      <TextField
        type="number"
        value={time}
        label={"秒"}
        onChange={(e) => setTime(Number(e.target.value as string))}
        style={{ marginTop: "20px", width: "300px" }}
      />
    </div>
  );
};

export default Hiragana;
