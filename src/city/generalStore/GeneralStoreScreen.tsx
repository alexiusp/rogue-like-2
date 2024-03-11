import BalanceIcon from "@mui/icons-material/Balance";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import bg from "../../assets/fantasy-medieval-store.jpg";
import MoneyStatusBadge from "../../character/MoneyStatusBadge";
import { characterSaved } from "../../character/state";
import Screen from "../../layout/Screen";
import { back } from "../../navigation";
import CharacterInventoryStoreList from "./CharacterInventoryStoreList";
import StoreStockPanel from "./StoreStockPanel";
import { storeStateSaved } from "./state";

export default function GeneralStoreScreen() {
  const goBackToCity = () => {
    characterSaved();
    storeStateSaved();
    back();
  };

  return (
    <Screen
      header={
        <>
          <IconButton onClick={goBackToCity} size="small">
            <BalanceIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            General Store
          </Typography>
        </>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <Stack spacing={0.5} direction="row">
        <Card elevation={2} sx={{ flex: "1 1 50%" }}>
          <CardHeader
            title={
              <>
                Inventory <MoneyStatusBadge />
              </>
            }
          />
          <CardContent>
            <CharacterInventoryStoreList />
          </CardContent>
        </Card>
        <StoreStockPanel />
      </Stack>
    </Screen>
  );
}
