import { Stack, Toolbar } from "@mui/material";
import HealthStatusBadge from "../character/HealthStatusBadge";
import MoneyStatusBadge from "../character/MoneyStatusBadge";
import XPStatusBadge from "../character/XPStatusBadge";

export default function CityStatusBar() {
  return (
    <Toolbar disableGutters={true}>
      <Stack spacing={2} direction="row">
        <HealthStatusBadge />
        <MoneyStatusBadge />
        <XPStatusBadge />
      </Stack>
    </Toolbar>
  );
}
