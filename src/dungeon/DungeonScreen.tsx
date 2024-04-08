import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import { useState } from "react";
import CharacterEffectsBar from "../character/CharacterEffectsBar";
import HealthStatusProgress from "../character/HealthStatusProgress";
import ManaStatusProgress from "../character/ManaStatusProgress";
import XpStatusProgress from "../character/XpStatusProgress";
import Screen from "../layout/Screen";
import { forward } from "../navigation";
import ActionBar from "./ActionBar";
import "./Dungeon.css";
import DungeonTile from "./DungeonTile";
import { areAdjacentCoordinates, areSameCoordinates } from "./model";
import {
  $characterPosition,
  $currentLevel,
  $dungeonLevelMap,
  $isOnStairsDown,
  $isOnStairsUp,
  ascendToDungeonLevel,
  descendToDungeonLevel,
  dungeonSaved,
  moveCharacter,
} from "./state";
import { IMapCoordinates } from "./types";

export default function DungeonScreen() {
  const dungeonMap = useUnit($dungeonLevelMap);
  const characterPos = useUnit($characterPosition);
  const ladderUp = useUnit($isOnStairsUp);
  const ladderDown = useUnit($isOnStairsDown);
  const currentLevel = useUnit($currentLevel);
  const [ladderConfirmation, toggleConfirmation] = useState(false);
  const tileClickhandler = (pos: IMapCoordinates) => {
    if (areSameCoordinates(characterPos, pos)) {
      if (ladderUp || ladderDown) {
        toggleConfirmation(true);
      }
      return;
    }
    if (!areAdjacentCoordinates(characterPos, pos)) {
      return;
    }
    moveCharacter(pos);
  };
  const leaveTheLevelHandler = () => {
    dungeonSaved();
    if (ladderDown) {
      descendToDungeonLevel(currentLevel + 1);
    } else {
      if (currentLevel > 1) {
        ascendToDungeonLevel(currentLevel - 1);
      } else {
        forward("city");
      }
    }
    toggleConfirmation(false);
  };

  const cells = dungeonMap.map.map((tile, index) => (
    <Grid xs={1} key={`cell-${index}`}>
      <DungeonTile
        tile={tile}
        character={characterPos.x === tile.x && characterPos.y === tile.y}
        onClick={tileClickhandler}
      />
    </Grid>
  ));
  return (
    <Screen
      header={
        <>
          <Typography variant="h3" component="h1">
            Mines of Arsunn
          </Typography>
        </>
      }
    >
      <Stack direction="column" spacing={0.5}>
        <div className="dungeon">
          <Grid container spacing={0} columns={dungeonMap.width}>
            {cells}
          </Grid>
        </div>
        <CharacterEffectsBar />
        <HealthStatusProgress />
        <ManaStatusProgress />
        <XpStatusProgress />
        <ActionBar />
      </Stack>
      <Dialog
        onClose={() => toggleConfirmation(false)}
        open={ladderConfirmation}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>
            Your are going to climb {ladderUp ? "up" : "down"} and leave this
            level.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={leaveTheLevelHandler}
          >
            Yes
          </Button>
          <Button size="small" onClick={() => toggleConfirmation(false)}>
            Not yet
          </Button>
        </DialogActions>
      </Dialog>
    </Screen>
  );
}
