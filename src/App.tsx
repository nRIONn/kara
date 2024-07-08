import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import Bar from "./Bar";
import Hiragana from "./Hiragana";
import Karaoke from "./Karaoke";

function App() {
  const [route, setRoute] = useState("カラオケ");
  const handleRoute = (val: string) => setRoute(val);
  const Btn = (props: { route: string }) => (
    <Button
      sx={{ color: "white" }}
      onClick={() => handleRoute(props.route)}
      variant="text"
    >
      {props.route}
    </Button>
  );

  return (
    <Box>
      <Bar />
      {/* TODO:BARに載せたい？ */}
      <Box
        position={"absolute"}
        top={0}
        mt={1.5}
        textAlign={"center"}
        width={"100%"}
      >
        <Stack direction={"row"} spacing={4} justifyContent={"center"}>
          <Btn route="カラオケ" />
          <Btn route="平仮名" />
        </Stack>
      </Box>
      {route === "カラオケ" && <Karaoke />}
      {route === "平仮名" && <Hiragana />}
    </Box>
  );
}

export type SongData = {
  age: Number;
  rank: Number;
  name: string;
};

export default App;
