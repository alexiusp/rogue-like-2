import { Stack, Toolbar } from "@mui/material";
import HealthStatusBadge from "../character/components/HealthStatusBadge";
import ManaStatusBadge from "../character/components/ManaStatusBadge";
import MoneyStatusBadge from "../character/components/MoneyStatusBadge";
import XPStatusBadge from "../character/components/XPStatusBadge";

export default function CityStatusBar() {
  return (
    <Toolbar disableGutters={true}>
      <Stack spacing={1} direction="row">
        <HealthStatusBadge />
        <ManaStatusBadge />
        <MoneyStatusBadge />
        <XPStatusBadge />
      </Stack>
    </Toolbar>
  );
}
