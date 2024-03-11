import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Chip, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterXpToNextLevel } from "./state";

export default function XPStatusBadge() {
  const xp = useUnit($characterXpToNextLevel);
  const label = `${xp}`;
  return (
    <Tooltip
      title="XP to next level in the current Guild"
      arrow
      placement="top"
    >
      <Chip variant="outlined" label={label} icon={<AccountBalanceIcon />} />
    </Tooltip>
  );
}
