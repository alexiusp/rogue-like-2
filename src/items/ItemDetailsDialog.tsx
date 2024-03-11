import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import GlobalItemsCatalogue from "./GlobalItemsCatalogue";
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
  const itemName = item.item;
  const { name, kind } = GlobalItemsCatalogue[itemName];
  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>{item.item}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>{name}</Typography>
          <Typography>Type: {kind}</Typography>
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
