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
  const idLevel = item.idLevel;
  const itemName = item.item;
  const { name, kind } = GlobalItemsCatalogue[itemName];
  const itemNameToDisplay = idLevel === 2 ? name : kind;
  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>{itemNameToDisplay}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>{itemNameToDisplay}</Typography>
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
