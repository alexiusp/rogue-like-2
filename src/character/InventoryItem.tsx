import BackHandIcon from "@mui/icons-material/BackHand";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { getAlignmentShort } from "../common/alignment";
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
  const { idLevel, item: itemName, alignment, kind } = item;
  const alignmentSuffix = alignment ? ` (${getAlignmentShort(alignment)})` : "";
  const usableSuffix = kind === "usable" ? ` [${item.usesLeft}]` : "";
  const itemLabel = `${itemName}${alignmentSuffix}${usableSuffix}`;
  const sx = idLevel === 2 ? { sx: { fontWeight: 700 } } : undefined;
  const eqIcon =
    kind === "equipable" && item.isEquipped ? (
      <ListItemIcon>
        <BackHandIcon />
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
          primary={itemLabel}
          primaryTypographyProps={sx}
          prefix="*"
        />
      </ListItemButton>
    </ListItem>
  );
}
