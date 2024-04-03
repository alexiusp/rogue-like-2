import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useUnit } from "effector-react";
import { $characterSpells } from "../../magic/state";
import CharacterSpellsRow from "./CharacterSpellsRow";
interface ISpellsTabProps {
  show: boolean;
}
export default function SpellsTab({ show }: ISpellsTabProps) {
  const spells = useUnit($characterSpells);
  if (!show) {
    return null;
  }
  return (
    <Table size="small">
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
