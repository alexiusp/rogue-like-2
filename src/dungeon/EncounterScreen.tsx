import { Box } from "@mui/material";
import { useUnit } from "effector-react";
import { ReactNode } from "react";
import BattleScreen from "../battle/BattleScreen";
import { areAllMonstersDead } from "../monsters/model";
import ChestScreen from "./ChestScreen";
import { $encounter } from "./state";
import { EEncounterType } from "./types";

export default function EncounterScreen() {
  const encounter = useUnit($encounter);
  let subScreen: ReactNode;
  switch (encounter?.type) {
    case EEncounterType.Monster:
      if (!areAllMonstersDead(encounter.monsters)) {
        subScreen = <BattleScreen />;
      } else {
        subScreen = <ChestScreen />;
      }
      break;
    case EEncounterType.Chest:
      subScreen = <ChestScreen />;
      break;
    default:
      subScreen = null;
      break;
  }
  return (
    <Box
      sx={{
        height: "100vh",
        justifyContent: "center",
        mb: 0,
        mt: 0,
        my: 0,
      }}
    >
      {subScreen}
    </Box>
  );
}
