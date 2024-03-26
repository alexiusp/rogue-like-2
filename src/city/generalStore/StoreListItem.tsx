import { Chip, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ItemName from "../../items/ItemName";
import { TShopItem } from "./types";

interface IStoreListItemProps {
  item: TShopItem;
  isLast?: boolean;
  selected: boolean;
  onSelect: () => void;
}

export default function StoreListItem({
  isLast,
  item,
  selected,
  onSelect,
}: IStoreListItemProps) {
  return (
    <ListItem
      disablePadding
      divider={!isLast}
      secondaryAction={<Chip label={item.amount} variant="outlined" />}
    >
      <ListItemButton selected={selected} onClick={() => onSelect()}>
        <ListItemText primary={<ItemName item={item} />} />
      </ListItemButton>
    </ListItem>
  );
}
