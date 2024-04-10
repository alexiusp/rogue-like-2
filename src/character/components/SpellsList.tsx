import { Badge, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useUnit } from "effector-react";
import { $spellSelected } from "../../battle/state";
import SpellIcon from "../../magic/SpellIcon";
import { isSpellCombat, isSpellNonCombat } from "../../magic/models";
import { $characterSpells, characterCastsASpell } from "../../magic/state";
import "./SpellsList.css";

interface ISpellsListProps {
  filter?: "all" | "dungeon" | "battle";
}

export default function SpellsList({ filter = "all" }: ISpellsListProps) {
  const allSpells = useUnit($characterSpells);
  let spellsList: string[];
  const castASpell = useUnit(characterCastsASpell);
  const selectedBattleSpell = useUnit($spellSelected);
  const selectedSpell =
    filter === "battle"
      ? selectedBattleSpell
        ? selectedBattleSpell.name
        : ""
      : "";
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
  // TODO: calculate if spell can be cast due to mana cost
  return (
    <ToggleButtonGroup
      size="large"
      className="spells-list"
      value={selectedSpell}
    >
      {spellsList.map((spell) => (
        <ToggleButton
          size="large"
          value={spell}
          key={`spells-list-button-${spell}`}
          onClick={getCastHandler(spell)}
        >
          {spell === selectedSpell ? (
            <Badge variant="dot">
              <SpellIcon spell={spell} />
            </Badge>
          ) : (
            <SpellIcon spell={spell} />
          )}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
