import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import ItemIcon from "./ItemIcon";
import ItemName from "./ItemName";
import { TGameItem } from "./models";

interface IItemDetailsDialogProps {
  item?: TGameItem;
  footer?: ReactNode;
  onClose: () => void;
}

export default function ItemDetailsDialog({
  footer,
  item,
  onClose,
}: IItemDetailsDialogProps) {
  if (!item) {
    return null;
  }
  const idLevel = item.idLevel;
  const itemName = item.item;
  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>
        <ItemName idLevel={idLevel} item={itemName} />
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            <ItemName idLevel={idLevel} item={itemName} />
          </Typography>
          <ItemIcon item={itemName} />
          <Typography>
            TODO: implement more detailed view for the item
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        {footer}
      </DialogActions>
    </Dialog>
  );
}
