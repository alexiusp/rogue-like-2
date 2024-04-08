import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import { Alert, IconButton, Stack, Typography } from "@mui/material";
import { useUnit } from "effector-react";
import bg from "../../assets/bank.webp";
import Screen from "../../layout/Screen";
import { back } from "../../navigation";
import BankAccounting from "./BankAccounting";
import BankItems from "./BankItems";
import { $bankMoney, $bankStashFreeSlots } from "./state";

export default function BankScreen() {
  const bankMoney = useUnit($bankMoney);
  const bankStashFreeSlots = useUnit($bankStashFreeSlots);
  const goBackToCity = () => {
    back();
  };

  return (
    <Screen
      header={
        <>
          <IconButton onClick={goBackToCity} size="small">
            <AccountBalanceIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            Bank
          </Typography>
        </>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <Stack spacing={2}>
        <Typography variant="h4" component="h2">
          Welcome to the Bank!
        </Typography>
        <Alert variant="outlined" severity="warning" icon={false}>
          You have {bankMoney} gold and {bankStashFreeSlots} free Bank slots
          available
        </Alert>
        <BankAccounting />
        <BankItems />
      </Stack>
    </Screen>
  );
}
