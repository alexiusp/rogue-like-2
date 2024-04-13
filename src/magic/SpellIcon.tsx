import { Tooltip } from "@mui/material";
import GlobalBaseSpellsCatalogue from "./GlobalSpellsCatalogue";
import "./SpellIcon.css";

interface ISpellIconProps {
  spell: string;
  showTooltip?: boolean;
}

export default function SpellIcon({
  spell,
  showTooltip = false,
}: ISpellIconProps) {
  const { name, picture } = GlobalBaseSpellsCatalogue[spell];
  let icon = (
    <img
      className="spell-icon"
      src={`/src/assets/spells/${picture}`}
      alt={name}
    />
  );
  if (showTooltip) {
    icon = (
      <Tooltip title={name} placement="top" arrow>
        {icon}
      </Tooltip>
    );
  }
  return icon;
}
