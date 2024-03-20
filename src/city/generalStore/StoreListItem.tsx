import { Chip, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { getAlignmentShort } from "../../common/alignment";
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
  const { amount, item: itemName, alignment, kind } = item;
  const alignmentSuffix =
    typeof alignment !== "undefined"
      ? ` (${getAlignmentShort(alignment)})`
      : "";
  const usableSuffix = kind === "usable" ? ` [${item.usesLeft}]` : "";
  const itemLabel = `${itemName}${alignmentSuffix}${usableSuffix}`;
  return (
    <ListItem
      disablePadding
      divider={!isLast}
      secondaryAction={<Chip label={amount} variant="outlined" />}
    >
      <ListItemButton selected={selected} onClick={() => onSelect()}>
        <ListItemText primary={itemLabel} />
      </ListItemButton>
    </ListItem>
  );
}
