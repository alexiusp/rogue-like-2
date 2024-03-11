import PaidIcon from "@mui/icons-material/Paid";
import { Chip, Tooltip } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterMoney } from "./state";

export default function MoneyStatusBadge() {
  const money = useUnit($characterMoney);
  const label = `${money}`;
  return (
    <Tooltip title="Money" arrow placement="top">
      <Chip
        component="span"
        color="warning"
        variant="outlined"
        label={label}
        icon={<PaidIcon />}
      />
    </Tooltip>
  );
}
