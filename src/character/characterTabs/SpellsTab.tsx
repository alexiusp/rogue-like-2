import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useUnit } from "effector-react";
import { getAllSpellsFromGuilds } from "../../guilds/models";
import { $characterGuilds } from "../state";
import CharacterSpellsRow from "./CharacterSpellsRow";
interface ISpellsTabProps {
  show: boolean;
}
export default function SpellsTab({ show }: ISpellsTabProps) {
  const characterGuilds = useUnit($characterGuilds);
  const spells = getAllSpellsFromGuilds(characterGuilds);
  if (!show) {
    return null;
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Spell</TableCell>
          <TableCell>Guild</TableCell>
          <TableCell>Level</TableCell>
          <TableCell>Mana cost</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {spells.map((spellName) => (
          <CharacterSpellsRow key={spellName} spellName={spellName} />
        ))}
      </TableBody>
    </Table>
  );
}
