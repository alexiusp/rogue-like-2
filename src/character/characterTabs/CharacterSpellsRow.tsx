import { TableCell, TableRow } from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import { getMaxLevelGuildForSpell } from "../../guilds/models";
import { EGuild } from "../../guilds/types";
import SpellDetailsDialog from "../../magic/SpellDetailsDialog";
import { $characterGuilds } from "../state";

interface ICharacterSpellsRowProps {
  spellName: string;
}

export default function CharacterSpellsRow({
  spellName,
}: ICharacterSpellsRowProps) {
  const [spellSelected, toggleInfoDialog] = useState(false);
  const characterGuilds = useUnit($characterGuilds);
  const { guild, level, spellCost } = getMaxLevelGuildForSpell(
    spellName,
    characterGuilds,
  );
  const closeInfoDialog = () => toggleInfoDialog(false);
  return (
    <>
      <TableRow
        hover
        onClick={() => toggleInfoDialog(true)}
        selected={spellSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>{spellName}</TableCell>
        <TableCell>{EGuild[guild]}</TableCell>
        <TableCell>{level}</TableCell>
        <TableCell>{spellCost}</TableCell>
      </TableRow>
      <SpellDetailsDialog
        guild={guild}
        level={level}
        manaCost={spellCost}
        show={spellSelected}
        spellName={spellName}
        onClose={closeInfoDialog}
      />
    </>
  );
}
