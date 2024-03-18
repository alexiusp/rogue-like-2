import { Box } from "@mui/material";
import { useUnit } from "effector-react";
import { ReactNode } from "react";
import BattleScreen from "../battle/BattleScreen";
import { $currentMapTile } from "./state";
import { EEncounterType } from "./types";

export default function EncounterScreen() {
  const { effects, terrain, encounter } = useUnit($currentMapTile);
  let subScreen: ReactNode;
  switch (encounter?.type) {
    case EEncounterType.Monster:
      subScreen = (
        <BattleScreen
          chest={encounter.chest}
          effects={effects}
          monsters={encounter.monsters}
          terrain={terrain}
        />
      );
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
