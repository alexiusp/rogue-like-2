import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import Screen from "../layout/Screen";
import "./Dungeon.css";
import DungeonTile from "./DungeonTile";
import { $characterPosition, $dungeonLevelMap } from "./state";

export default function DungeonScreen() {
  const dungeonMap = useUnit($dungeonLevelMap);
  const characterPos = useUnit($characterPosition);
  const cells = dungeonMap.map.map((tile, index) => (
    <Grid xs={1} key={`cell-${index}`}>
      <DungeonTile
        tile={tile}
        character={characterPos.x === tile.x && characterPos.y === tile.y}
      />
    </Grid>
  ));
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
      <div className="dungeon">
        <Grid container spacing={0} columns={dungeonMap.height}>
          {cells}
        </Grid>
      </div>
    </Screen>
  );
}
