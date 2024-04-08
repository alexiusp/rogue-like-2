import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import HealthStatusBadge from "../../character/components/HealthStatusBadge";
import MoneyStatusBadge from "../../character/components/MoneyStatusBadge";
import {
  $characterMoney,
  characterDrinkBeer,
  characterDrinkWine,
  characterEatBread,
  characterEatLunch,
} from "../../character/state";

interface IDrinksTabProps {
  show: boolean;
}
export default function DrinksTab({ show }: IDrinksTabProps) {
  const money = useUnit($characterMoney);
  if (!show) {
    return;
  }
  return (
    <>
      <Box display="flex" flexDirection="row" paddingTop={2} paddingBottom={2}>
        <HealthStatusBadge />
        <Box sx={{ flexGrow: 1 }} />
        <MoneyStatusBadge />
      </Box>
      <Box minHeight={64} padding={2}>
        <Typography>
          The barkeeper is busy polishing some old mugs, he does not pay much
          attention to you...
        </Typography>
      </Box>
      <List>
        <ListItem divider disablePadding>
          <ListItemButton
            onClick={() => characterEatBread()}
            disabled={money < 10}
          >
            <ListItemText
              primary="Order some bread"
              secondary="10 HP for 10 Gold"
            />
          </ListItemButton>
        </ListItem>
        <ListItem divider disablePadding>
          <ListItemButton
            onClick={() => characterDrinkBeer()}
            disabled={money < 20}
          >
            <ListItemText
              primary="Order some beer"
              secondary="10 MP for 20 Gold"
            />
          </ListItemButton>
        </ListItem>
        <ListItem divider disablePadding>
          <ListItemButton
            onClick={() => characterEatLunch()}
            disabled={money < 100}
          >
            <ListItemText
              primary="Order full lunch"
              secondary="100 HP for 100 Gold"
            />
          </ListItemButton>
        </ListItem>
        <ListItem divider disablePadding>
          <ListItemButton
            onClick={() => characterDrinkWine()}
            disabled={money < 200}
          >
            <ListItemText
              primary="Order wine"
              secondary="100 MP for 200 Gold"
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
