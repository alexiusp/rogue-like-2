import { Box, Button } from "@mui/material";
import { useUnit } from "effector-react";
import { useMemo, useState } from "react";
import ItemDetailsDialog from "../../items/ItemDetailsDialog";
import InventoryList from "../InventoryList";
import {
  $characterInventory,
  characterDroppedAnItem,
  characterEquippedAnItem,
  characterUnequippedAnItem,
} from "../state";

interface IInventoryTabProps {
  show: boolean;
}

export default function InventoryTab({ show }: IInventoryTabProps) {
  const inventory = useUnit($characterInventory);
  const [selectedItemIndex, selectIndex] = useState<number>(-1);
  const selectedItem = useMemo(() => {
    if (selectedItemIndex < 0) {
      return;
    }
    return inventory[selectedItemIndex];
  }, [inventory, selectedItemIndex]);
  const equipSelectedItem = () => {
    if (
      selectedItemIndex < 0 ||
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      selectedItem.isEquipped
    ) {
      return;
    }
    characterEquippedAnItem(selectedItemIndex);
    selectIndex(-1);
  };
  const unequipSelectedItem = () => {
    if (
      selectedItemIndex < 0 ||
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      !selectedItem.isEquipped
    ) {
      return;
    }
    characterUnequippedAnItem(selectedItemIndex);
    selectIndex(-1);
  };
  const dropSelectedItem = () => {
    if (selectedItemIndex < 0) {
      return;
    }
    characterDroppedAnItem(selectedItemIndex);
    selectIndex(-1);
  };

  if (!show) {
    return null;
  }
  return (
    <Box>
      <InventoryList
        selectedIndex={selectedItemIndex}
        onIndexSelect={selectIndex}
      />
      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => selectIndex(-1)}
        footer={
          <>
            {selectedItem &&
            selectedItem.kind === "equipable" &&
            !selectedItem.isEquipped &&
            selectedItem.idLevel === 2 ? (
              <Button onClick={equipSelectedItem}>equip</Button>
            ) : null}
            {selectedItem &&
            selectedItem.kind === "equipable" &&
            selectedItem.isEquipped ? (
              <Button onClick={unequipSelectedItem}>uneqip</Button>
            ) : null}
            <Button onClick={dropSelectedItem}>drop</Button>
          </>
        }
      />
    </Box>
  );
}
