import { Typography } from "@mui/material";
import { useUnit } from "effector-react";
import chestBg from "../assets/chest-big.webp";
import Screen from "../layout/Screen";
import { $chest } from "./state";

export default function ChestScreen() {
  const chest = useUnit($chest);
  if (!chest) {
    return null;
  }
  return (
    <Screen
      header={
        <Typography variant="h3" component="h1">
          A chest!
        </Typography>
      }
    >
      <img
        src={chestBg}
        alt="chest"
        style={{ objectFit: "cover", width: "100%" }}
      />
    </Screen>
  );
}
