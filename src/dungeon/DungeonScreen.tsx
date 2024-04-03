import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import { useState } from "react";
import HealthStatusProgress from "../character/HealthStatusProgress";
import InventoryList from "../character/InventoryList";
import ManaStatusProgress from "../character/ManaStatusProgress";
import SpellsList from "../character/SpellsList";
import XpStatusProgress from "../character/XpStatusProgress";
import { characterSaved } from "../character/state";
import Screen from "../layout/Screen";
import { forward } from "../navigation";
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
    characterSaved();
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

  const [activeTab, toggleTab] = useState<"inv" | "spells">("inv");
  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "inv" | "spells",
  ) => {
    toggleTab(newValue);
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
        <HealthStatusProgress />
        <ManaStatusProgress />
        <XpStatusProgress />
        <Card elevation={3}>
          <CardContent>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab value="inv" label="Inventory" />
              <Tab value="spells" label="Spells" />
            </Tabs>
            <Box sx={{ display: activeTab === "inv" ? "block" : "none" }}>
              <InventoryList />
            </Box>
            <Box sx={{ display: activeTab === "spells" ? "block" : "none" }}>
              <SpellsList />
            </Box>
          </CardContent>
        </Card>
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
