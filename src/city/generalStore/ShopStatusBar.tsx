import { Stack, Toolbar } from "@mui/material";
import MoneyStatusBadge from "../../character/MoneyStatusBadge";

export default function ShopStatusBar() {
  return (
    <Toolbar disableGutters={true}>
      <Stack spacing={2} direction="row">
        <MoneyStatusBadge />
      </Stack>
    </Toolbar>
  );
}
