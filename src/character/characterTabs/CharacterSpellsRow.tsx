import { TableCell, TableRow } from "@mui/material";
import { useUnit } from "effector-react";
import { getMaxLevelGuildForSpell } from "../../guilds/models";
import { EGuild } from "../../guilds/types";
import { $characterGuilds } from "../state";

interface ICharacterSpellsRowProps {
  spellName: string;
}

export default function CharacterSpellsRow({
  spellName,
}: ICharacterSpellsRowProps) {
  const characterGuilds = useUnit($characterGuilds);
  const { guild, level, spellCost } = getMaxLevelGuildForSpell(
    spellName,
    characterGuilds,
  );
  return (
    <TableRow key={spellName}>
      <TableCell>{spellName}</TableCell>
      <TableCell>{EGuild[guild]}</TableCell>
      <TableCell>{level}</TableCell>
      <TableCell>{spellCost}</TableCell>
    </TableRow>
  );
}
