import { Stack, Toolbar } from "@mui/material";
import HealthStatusBadge from "../character/components/HealthStatusBadge";
import MoneyStatusBadge from "../character/components/MoneyStatusBadge";
import XPStatusBadge from "../character/components/XPStatusBadge";

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
