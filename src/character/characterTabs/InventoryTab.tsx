import { Box, Button } from "@mui/material";
import { useState } from "react";
import ItemDetailsDialog from "../../items/ItemDetailsDialog";
import { TGameItem } from "../../items/models";
import InventoryList from "../InventoryList";
import {
  characterDroppedAnItem,
  characterEquippedAnItem,
  characterUnequippedAnItem,
} from "../state";

interface IInventoryTabProps {
  show: boolean;
}

export default function InventoryTab({ show }: IInventoryTabProps) {
  const [selectedItem, selectItem] = useState<TGameItem>();
  const equipSelectedItem = () => {
    if (
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      selectedItem.isEquipped
    ) {
      return;
    }
    selectItem(undefined);
    characterEquippedAnItem(selectedItem);
  };
  const unequipSelectedItem = () => {
    if (
      !selectedItem ||
      selectedItem.kind !== "equipable" ||
      !selectedItem.isEquipped
    ) {
      return;
    }
    selectItem(undefined);
    characterUnequippedAnItem(selectedItem);
  };
  const dropSelectedItem = () => {
    if (!selectedItem) {
      return;
    }
    selectItem(undefined);
    characterDroppedAnItem(selectedItem);
  };

  if (!show) {
    return null;
  }
  return (
    <Box>
      <InventoryList selectedItem={selectedItem} onItemSelect={selectItem} />
      <ItemDetailsDialog
        item={selectedItem}
        onClose={() => selectItem(undefined)}
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
