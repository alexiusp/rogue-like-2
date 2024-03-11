import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import bg from "../../assets/bank.jpg";
import {
  $characterMoney,
  characterSaved,
  moneyAddedToCharacter,
  moneyRemovedFromCharacter,
} from "../../character/state";
import Screen from "../../layout/Screen";
import { back } from "../../navigation";
import {
  $bankMoney,
  bankStateSaved,
  depositMoney,
  withdrawMoney,
} from "./state";

export default function BankScreen() {
  const personalMoney = useUnit($characterMoney);
  const bankMoney = useUnit($bankMoney);
  const [depositInput, setDepositInputValue] = useState<number | "">("");
  const handleChangeDepositInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let numValue = Number(event.target.value);
    if (isNaN(numValue)) {
      return;
    }
    if (numValue > personalMoney) {
      numValue = personalMoney;
    }
    setDepositInputValue(numValue);
  };
  const handleDepositMoney = () => {
    if (!depositInput) {
      return;
    }
    depositMoney(depositInput);
    moneyRemovedFromCharacter(depositInput);
  };
  const handleDepositAllMoney = () => {
    setDepositInputValue(personalMoney);
    depositMoney(personalMoney);
    moneyRemovedFromCharacter(personalMoney);
  };
  const [withdrawInput, setWithdrawInputValue] = useState<number | "">("");
  const handleChangeWithdrawInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let numValue = Number(event.target.value);
    if (isNaN(numValue)) {
      return;
    }
    if (numValue > bankMoney) {
      numValue = bankMoney;
    }
    setWithdrawInputValue(numValue);
  };
  const handleWithdrawMoney = () => {
    if (!withdrawInput) {
      return;
    }
    withdrawMoney(withdrawInput);
    moneyAddedToCharacter(withdrawInput);
  };
  const handleWithdrawAllMoney = () => {
    setWithdrawInputValue(bankMoney);
    withdrawMoney(bankMoney);
    moneyAddedToCharacter(bankMoney);
  };
  const goBackToCity = () => {
    characterSaved();
    bankStateSaved();
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
          You have {bankMoney} gold and 40 free Bank slots available
        </Alert>
        <Stack direction="row" spacing={2}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="deposit-input">Deposit money</InputLabel>
              <OutlinedInput
                id="deposit-input"
                startAdornment={
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <Stack spacing={0.5} direction="row">
                    <Button onClick={handleDepositMoney}>deposit</Button>
                    <Button onClick={handleDepositAllMoney}>all</Button>
                  </Stack>
                }
                label="Deposit money"
                value={depositInput}
                onChange={handleChangeDepositInput}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="withdraw-input">Withdraw money</InputLabel>
              <OutlinedInput
                id="withdraw-input"
                startAdornment={
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <Stack spacing={0.5} direction="row">
                    <Button onClick={handleWithdrawMoney}>withdraw</Button>
                    <Button onClick={handleWithdrawAllMoney}>all</Button>
                  </Stack>
                }
                label="Withdraw money"
                value={withdrawInput}
                onChange={handleChangeWithdrawInput}
              />
            </FormControl>
          </Stack>
          <Typography>deposit/withdraw items here (WIP)</Typography>
        </Stack>
      </Stack>
    </Screen>
  );
}
