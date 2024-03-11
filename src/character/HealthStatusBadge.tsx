import FavoriteIcon from "@mui/icons-material/Favorite";
import { Chip, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterHealth, $characterMaxHealth } from "./state";

export default function HealthStatusBadge() {
  const hp = useUnit($characterHealth);
  const hpMax = useUnit($characterMaxHealth);
  const label = `${hp} / ${hpMax}`;
  return (
    <Tooltip title="Health" arrow placement="top">
      <Chip
        color="success"
        variant="outlined"
        label={label}
        icon={<FavoriteIcon />}
      />
    </Tooltip>
  );
}
