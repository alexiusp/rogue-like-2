import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Chip, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterMana, $characterMaxMana } from "../state";

export default function ManaStatusBadge() {
  const mp = useUnit($characterMana);
  const mpMax = useUnit($characterMaxMana);
  const label = `${mp} / ${mpMax}`;
  const color = mp < 5 ? "default" : "primary";
  return (
    <Tooltip title="Mana" arrow placement="top">
      <Chip
        color={color}
        variant="outlined"
        label={label}
        icon={<AutoAwesomeIcon />}
      />
    </Tooltip>
  );
}
