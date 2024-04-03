import {
  Button,
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
import { EGuild } from "../guilds/types";
import GlobalBaseSpellsCatalogue from "./GlobalSpellsCatalogue";
import SpellIcon from "./SpellIcon";
import { ESpellClass } from "./types";

interface ISpellDetailsDialogProps {
  footer?: ReactNode;
  guild: EGuild;
  level: number;
  manaCost: number;
  show: boolean;
  spellName: string;
  onClose: () => void;
}
export default function SpellDetailsDialog({
  footer,
  guild,
  level,
  manaCost,
  show,
  spellName,
  onClose,
}: ISpellDetailsDialogProps) {
  const { spellClass, description, nature, power, powerGain, statsRequired } =
    GlobalBaseSpellsCatalogue[spellName];
  return (
    <Dialog onClose={onClose} open={show}>
      <DialogTitle>Spell Info: {spellName}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={2}>
            <SpellIcon spell={spellName} />
          </Grid>
          <Grid container xs={10}>
            <Grid xs={4}>
              <Typography>Spell:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>{spellName}</Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>Class:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>{ESpellClass[spellClass]}</Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>Nature Element:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>{nature}</Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>Power:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>
                {power}/{powerGain}
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>Guild:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>{EGuild[guild]}</Typography>
            </Grid>
            <Grid xs={4}>
              <Typography>Mana cost:</Typography>
            </Grid>
            <Grid xs={8}>
              <Typography>{manaCost}</Typography>
            </Grid>
          </Grid>
          <Grid xs={12}>
            <Typography>Description:</Typography>
            <Typography>{description}</Typography>
            <Typography>
              This spell is currently cast at a spell level of {level} by your{" "}
              {EGuild[guild]} training.
            </Typography>
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
                  <TableCell>{statsRequired.strength}</TableCell>
                  <TableCell>{statsRequired.intelligence}</TableCell>
                  <TableCell>{statsRequired.wisdom}</TableCell>
                  <TableCell>{statsRequired.endurance}</TableCell>
                  <TableCell>{statsRequired.charisma}</TableCell>
                  <TableCell>{statsRequired.dexterity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {footer}
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
