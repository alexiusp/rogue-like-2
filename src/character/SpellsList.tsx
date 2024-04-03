import { Button, ButtonGroup } from "@mui/material";
import { useUnit } from "effector-react";
import SpellIcon from "../magic/SpellIcon";
import { $characterSpells } from "../magic/state";
import "./SpellsList.css";

export default function SpellsList() {
  const spells = useUnit($characterSpells);
  return (
    <ButtonGroup size="large" className="spells-list">
      {spells.map((spell) => (
        <Button key={`spells-list-button-${spell}`}>
          <SpellIcon spell={spell} />
        </Button>
      ))}
    </ButtonGroup>
  );
}
