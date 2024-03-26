import AttributionIcon from "@mui/icons-material/Attribution";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ItemName from "../items/ItemName";
import { TGameItem } from "../items/models";

interface IInventoryItemProps {
  item: TGameItem;
  selected?: boolean;
  divider?: boolean;
  onSelect?: () => void;
}

export default function InventoryItem({
  item,
  selected,
  divider,
  onSelect,
}: IInventoryItemProps) {
  const { idLevel, kind } = item;
  const sx = idLevel === 2 ? { sx: { fontWeight: 700 } } : undefined;
  const eqIcon =
    kind === "equipable" && item.isEquipped ? (
      <ListItemIcon title="equipped">
        <AttributionIcon />
      </ListItemIcon>
    ) : null;
  return (
    <ListItem disablePadding divider={divider}>
      <ListItemButton
        selected={selected}
        onClick={onSelect ? () => onSelect() : undefined}
      >
        {eqIcon}
        <ListItemText
          primary={<ItemName item={item} />}
          primaryTypographyProps={sx}
          prefix="*"
        />
      </ListItemButton>
    </ListItem>
  );
}
