import { Stack, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import Screen from "../layout/Screen";
import {
  $encounterItemsReward,
  $encounterMoneyReward,
  $encounterXpReward,
} from "./state";

export default function RewardScreen() {
  const money = useUnit($encounterMoneyReward);
  const xp = useUnit($encounterXpReward);
  const items = useUnit($encounterItemsReward);

  return (
    <Screen
      header={
        <Typography variant="h3" component="h1">
          Victory!
        </Typography>
      }
    >
      <Stack direction="column" spacing={2} sx={{ justifyContent: "center" }}>
        <Typography>
          {" "}
          rewards: {money} Gold, {xp} XP
        </Typography>

        <Typography>{JSON.stringify(items)}</Typography>
      </Stack>
    </Screen>
  );
}
