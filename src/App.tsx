import { Box } from "@mui/material";
import { useState } from "react";
import Bar from "./Bar";
import FirstTake from "./FirstTake";
import Hiragana from "./Hiragana";
import Karaoke from "./Karaoke";

function App() {
  const [route, setRoute] = useState("カラオケ");
  const routes = ["カラオケ", "FirstTake", "平仮名"];

  return (
    <Box>
      <Bar route={route} routes={routes} onRouteChange={setRoute} />
      {route === "カラオケ" && <Karaoke />}
      {route === "FirstTake" && <FirstTake />}
      {route === "平仮名" && <Hiragana />}
    </Box>
  );
}

export type SongData = {
  rank: Number;
  name: string;
  artist: string;
};

export default App;
