import { Box } from "@mui/material";
import { useUnit } from "effector-react";
import { ReactNode } from "react";
import BattleScreen from "../battle/BattleScreen";
import { $encounter } from "./state";
import { EEncounterType } from "./types";

export default function EncounterScreen() {
  const encounter = useUnit($encounter);
  let subScreen: ReactNode;
  switch (encounter?.type) {
    case EEncounterType.Monster:
      subScreen = <BattleScreen monsters={encounter.monsters} />;
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
