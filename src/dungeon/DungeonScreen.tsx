import { Typography } from "@mui/material";
import Screen from "../layout/Screen";

export default function DungeonScreen() {
  return (
    <Screen
      header={
        <>
          <Typography variant="h3" component="h1">
            Depths of Arsunn
          </Typography>
        </>
      }
    >
      <Typography>Dungeon to be developed</Typography>
    </Screen>
  );
}
