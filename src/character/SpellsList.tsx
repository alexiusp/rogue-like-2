import { Button, ButtonGroup } from "@mui/material";
import { useUnit } from "effector-react";
import SpellIcon from "../magic/SpellIcon";
import { isSpellCombat, isSpellNonCombat } from "../magic/models";
import { $characterSpells, characterCastsASpell } from "../magic/state";
import "./SpellsList.css";

interface ISpellsListProps {
  filter?: "all" | "dungeon" | "battle";
}

export default function SpellsList({ filter = "all" }: ISpellsListProps) {
  const allSpells = useUnit($characterSpells);
  let spellsList: string[];
  const castASpell = useUnit(characterCastsASpell);
  const getCastHandler = (spell: string) => () => castASpell({ name: spell });
  switch (filter) {
    case "battle":
      spellsList = allSpells.filter(isSpellCombat);
      break;
    case "dungeon":
      spellsList = allSpells.filter(isSpellNonCombat);
      break;
    default:
      spellsList = allSpells;
      break;
  }
  return (
    <ButtonGroup size="large" className="spells-list">
      {spellsList.map((spell) => (
        <Button
          key={`spells-list-button-${spell}`}
          onClick={getCastHandler(spell)}
        >
          <SpellIcon spell={spell} />
        </Button>
      ))}
    </ButtonGroup>
  );
}
