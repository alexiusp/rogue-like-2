import FavoriteIcon from "@mui/icons-material/Favorite";
import { Chip, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterHealth, $characterMaxHp } from "./state";

export default function HealthStatusBadge() {
  const hp = useUnit($characterHealth);
  const hpMax = useUnit($characterMaxHp);
  const label = `${hp} / ${hpMax}`;
  // TODO: change chip color when health lower than threshold
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
