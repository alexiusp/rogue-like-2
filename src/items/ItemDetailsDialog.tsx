import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ReactNode } from "react";
import { isNotGuildRestricted } from "../guilds/models";
import GlobalItemsCatalogue from "./GlobalItemsCatalogue";
import ItemGuildRequirements from "./ItemGuildRequirements";
import ItemIcon from "./ItemIcon";
import ItemName from "./ItemName";
import {
  TGameItem,
  getHandsStatusLabel,
  getItemAttack,
  getItemDamage,
  getItemDefense,
  getItemProtection,
  getItemSpellStatusLabel,
} from "./models";

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
  const { item: itemName, idLevel, kind } = item;
  const baseItem = GlobalItemsCatalogue[itemName];
  let attack: number | string = "?";
  let damage: number | string = "?";
  let defense: number | string = "?";
  let protection: number | string = "?";
  if (idLevel > 0) {
    attack = getItemAttack(item);
    defense = getItemDefense(item);
    if (idLevel > 1) {
      damage = getItemDamage(item);
      protection = getItemProtection(item);
    }
  }
  const statsRequired = baseItem.statsRequired;
  const statsModified = baseItem.statsBonuses;
  const isNotRestricted = isNotGuildRestricted(baseItem.guildRequired);
  const handsStatus = idLevel > 0 ? getHandsStatusLabel(baseItem) : "";
  const spellStatus = idLevel > 1 ? getItemSpellStatusLabel(baseItem) : "";
  const usesStatus =
    idLevel > 1 && kind === "usable" ? `Uses left: ${item.usesLeft}` : "";
  return (
    <Dialog onClose={onClose} open={true}>
      <DialogTitle>
        <ItemName item={item} />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={2}>
            <ItemIcon item={itemName} />
          </Grid>
          <Grid container xs={10}>
            <Grid xs={4}>
              <Typography>Item:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>
                <ItemName item={item} />
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>Att/Def:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>
                ({attack}/{damage}) [{defense}/{protection}]
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>Type:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>
                {baseItem.kind}
                {idLevel > 1
                  ? isNotRestricted
                    ? " (not restricted)"
                    : " (restricted)"
                  : ""}
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>ID level:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>
                {idLevel === 2
                  ? "Completely identified"
                  : idLevel === 1
                    ? "Mostly identified"
                    : "Partially identified"}
              </Typography>
            </Grid>
          </Grid>
          <Grid xs={12}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>Str</TableCell>
                  <TableCell>Int</TableCell>
                  <TableCell>Wis</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Cha</TableCell>
                  <TableCell>Dex</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Stats Required:
                  </TableCell>
                  <TableCell>
                    {idLevel > 0 ? statsRequired.strength : "?"}
                  </TableCell>
                  <TableCell>
                    {idLevel > 0 ? statsRequired.intelligence : "?"}
                  </TableCell>
                  <TableCell>
                    {idLevel > 0 ? statsRequired.wisdom : "?"}
                  </TableCell>
                  <TableCell>
                    {idLevel > 0 ? statsRequired.endurance : "?"}
                  </TableCell>
                  <TableCell>
                    {idLevel > 0 ? statsRequired.charisma : "?"}
                  </TableCell>
                  <TableCell>
                    {idLevel > 0 ? statsRequired.dexterity : "?"}
                  </TableCell>
                </TableRow>
                {idLevel == 2 ? (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Stats Modified:
                    </TableCell>
                    <TableCell>{statsModified.strength}</TableCell>
                    <TableCell>{statsModified.intelligence}</TableCell>
                    <TableCell>{statsModified.wisdom}</TableCell>
                    <TableCell>{statsModified.endurance}</TableCell>
                    <TableCell>{statsModified.charisma}</TableCell>
                    <TableCell>{statsModified.dexterity}</TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Grid>
          <Grid xs={6}>
            <Typography>{handsStatus}</Typography>
            <Typography>{spellStatus}</Typography>
            <Typography>{usesStatus}</Typography>
          </Grid>
          <Grid xs={6}>
            <ItemGuildRequirements
              idLevel={idLevel}
              requirements={baseItem.guildRequired}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>{footer}</DialogActions>
    </Dialog>
  );
}
