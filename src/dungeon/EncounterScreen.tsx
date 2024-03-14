import { Typography } from "@mui/material";
import bg from "../assets/dungeon.jpg";
import Screen from "../layout/Screen";

export default function EncounterScreen() {
  return (
    <Screen>
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <Typography>encounter</Typography>
    </Screen>
  );
}
