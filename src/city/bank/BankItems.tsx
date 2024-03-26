import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import { useState } from "react";
import InventoryList from "../../character/InventoryList";
import {
  $characterInventory,
  characterDroppedAnItem,
  characterReceivedItems,
} from "../../character/state";
import BankItemsStash from "./BankItemsStash";
import {
  $bankStash,
  $bankStashLimitReached,
  itemDeposited,
  itemWithdrawn,
} from "./state";

export default function BankItems() {
  const stash = useUnit($bankStash);
  const inventory = useUnit($characterInventory);
  const [selectedStashIndex, toggleStashSelect] = useState(-1);
  const [selectedInventoryIndex, toggleInventorySelect] = useState(-1);
  const stashLimitReached = useUnit($bankStashLimitReached);

  const resetSelection = () => {
    toggleStashSelect(-1);
    toggleInventorySelect(-1);
  };

  const putItemToStashHandler = () => {
    if (selectedInventoryIndex < 0) {
      return;
    }
    const item = inventory[selectedInventoryIndex];
    characterDroppedAnItem(selectedInventoryIndex);
    itemDeposited(item);
    resetSelection();
  };

  const getItemFromStashHandler = () => {
    if (selectedStashIndex < 0) {
      return;
    }
    itemWithdrawn(selectedStashIndex);
    const item = stash[selectedStashIndex];
    characterReceivedItems([item]);
    resetSelection();
  };
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid xs={5}>
        <InventoryList
          selectedIndex={selectedInventoryIndex}
          onIndexSelect={toggleInventorySelect}
        />
      </Grid>
      <Grid container direction="column" alignItems="center" xs={2}>
        <Button
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={putItemToStashHandler}
          disabled={selectedInventoryIndex < 0 || stashLimitReached}
        >
          &gt;
        </Button>
        <Button
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={getItemFromStashHandler}
          disabled={selectedStashIndex < 0}
        >
          &lt;
        </Button>
      </Grid>
      <Grid xs={5}>
        <BankItemsStash
          stash={stash}
          selected={selectedStashIndex}
          onSelect={toggleStashSelect}
        />
      </Grid>
    </Grid>
  );
}
