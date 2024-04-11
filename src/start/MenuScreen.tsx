import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { common, grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { characterLoaded } from "../character/state";
import {
  TSaveSlotName,
  TSaveSlotsState,
  getSlotsState,
  setCurrentSlot,
} from "../common/db";
import Screen from "../layout/Screen";
import { navigate } from "../navigation";

export default function MenuScreen() {
  const [slotsState, setSlotsState] = useState<TSaveSlotsState>();
  useEffect(() => {
    const state = getSlotsState();
    setSlotsState(state);
  }, [setSlotsState]);
  const createNewGame = (slot: TSaveSlotName) => {
    setCurrentSlot(slot);
    // simply navigate to start game menu
    navigate("start");
  };
  const loadExistingGame = (slot: TSaveSlotName) => {
    setCurrentSlot(slot);
    characterLoaded();
    // navigate to city where all data from given slot will be loaded
    navigate("city");
  };
  const renderSlot = (slot: TSaveSlotName) => {
    if (!slotsState || !slotsState[slot]) {
      return (
        <MenuItem onClick={() => createNewGame(slot)}>
          <ListItemAvatar>
            <Avatar sx={{ color: common.white, backgroundColor: grey[800] }}>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>Start new game</ListItemText>
        </MenuItem>
      );
    }
    return (
      <MenuItem onClick={() => loadExistingGame(slot)}>
        <ListItemAvatar>
          <Avatar sx={{ color: common.white, backgroundColor: grey[800] }}>
            <AccountBoxIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText>{slotsState[slot]}</ListItemText>
      </MenuItem>
    );
  };
  return (
    <Screen
      sx={{
        height: "100vh",
        justifyContent: "center",
        mb: 0,
        mt: 0,
        my: 0,
      }}
      header={
        <Typography variant="h3" component="h1">
          Welcome
        </Typography>
      }
    >
      <MenuList>
        {renderSlot("slot-1")}
        {renderSlot("slot-2")}
        {renderSlot("slot-3")}
      </MenuList>
    </Screen>
  );
}
