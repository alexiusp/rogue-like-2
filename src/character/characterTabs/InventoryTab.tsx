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
  const [selectedItemIndex, selectIndex] = useState<number>();
  const selectedItem = useMemo(() => {
    if (typeof selectedItemIndex === "undefined") {
      return;
    }
    return inventory[selectedItemIndex];
  }, [inventory, selectedItemIndex]);
  const equipSelectedItem = () => {
    if (
      typeof selectedItemIndex === "undefined" ||
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      selectedItem.isEquipped
    ) {
      return;
    }
    selectIndex(undefined);
    characterEquippedAnItem(selectedItemIndex);
  };
  const unequipSelectedItem = () => {
    if (
      typeof selectedItemIndex === "undefined" ||
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      !selectedItem.isEquipped
    ) {
      return;
    }
    selectIndex(undefined);
    characterUnequippedAnItem(selectedItemIndex);
  };
  const dropSelectedItem = () => {
    if (!selectedItem || typeof selectedItemIndex === "undefined") {
      return;
    }
    selectIndex(undefined);
    characterDroppedAnItem(selectedItemIndex);
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
        onClose={() => selectIndex(undefined)}
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
