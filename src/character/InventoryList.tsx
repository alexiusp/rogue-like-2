import { List, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { TGameItem } from "../items/models";
import InventoryItem from "./InventoryItem";
import { $characterInventory } from "./state";

interface IInventoryListProps {
  selectedItem?: TGameItem;
  onItemSelect: (item: TGameItem) => void;
}

export default function InventoryList({
  selectedItem,
  onItemSelect,
}: IInventoryListProps) {
  const inventory = useUnit($characterInventory);
  if (!inventory.length) {
    return <Typography>Your inventory is empty!</Typography>;
  }
  const listStyle = {
    p: 0,
    border: "1px solid",
    borderColor: "divider",
  };
  return (
    <List sx={listStyle}>
      {inventory.map((item, index) => (
        <InventoryItem
          key={`${index}-${item.item}`}
          item={item}
          selected={item === selectedItem}
          divider={index !== inventory.length - 1}
          onSelect={() => onItemSelect(item)}
        />
      ))}
    </List>
  );
}
