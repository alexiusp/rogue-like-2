import { Button, Stack, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import XpLabel from "../character/XpLabel";
import { moneyAddedToCharacter, xpGainedByCharacter } from "../character/state";
import ItemDetailsDialog from "../items/ItemDetailsDialog";
import ItemIcon from "../items/ItemIcon";
import MoneyLabel from "../items/MoneyLabel";
import { TGameItem } from "../items/models";
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
  const [selectedItem, selectItem] = useState<TGameItem | undefined>(undefined);
  const collectRewards = () => {
    moneyAddedToCharacter(money);
    xpGainedByCharacter(xp);
    // TODO: add items to character
  };
  return (
    <Screen
      header={
        <Typography variant="h3" component="h1">
          Victory!
        </Typography>
      }
      sx={{
        height: "100vh",
        justifyContent: "center",
        mb: 0,
        mt: 0,
        my: 0,
      }}
      paperSx={{ height: "30%" }}
    >
      <Stack direction="column" spacing={2} sx={{ alignItems: "center" }}>
        <Typography variant="h4" component="h2">
          Your rewards:
        </Typography>
        <Stack spacing={2} direction="row">
          <MoneyLabel amount={money} />
          <XpLabel amount={xp} />
        </Stack>
        <Stack spacing={2} direction="row">
          {items.map((item, index) => (
            <div key={`${index}-${item.item}`} onClick={() => selectItem(item)}>
              <ItemIcon item={item.item} />
            </div>
          ))}
        </Stack>
        <Button title="OK" onClick={collectRewards}>
          OK
        </Button>
      </Stack>
      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => selectItem(undefined)}
      />
    </Screen>
  );
}
