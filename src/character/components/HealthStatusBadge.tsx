import FavoriteIcon from "@mui/icons-material/Favorite";
import { Chip, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterHealth, $characterMaxHp } from "../state";

export default function HealthStatusBadge() {
  const hp = useUnit($characterHealth);
  const hpMax = useUnit($characterMaxHp);
  const label = `${hp} / ${hpMax}`;
  const color = hp < 5 ? "error" : hp < hpMax / 2 ? "warning" : "success";
  return (
    <Tooltip title="Health" arrow placement="top">
      <Chip
        color={color}
        variant="outlined"
        label={label}
        icon={<FavoriteIcon />}
      />
    </Tooltip>
  );
}
