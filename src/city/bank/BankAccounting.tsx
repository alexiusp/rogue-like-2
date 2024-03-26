import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useUnit } from "effector-react";
import { useState } from "react";
import {
  $characterMoney,
  moneyAddedToCharacter,
  moneyRemovedFromCharacter,
} from "../../character/state";
import { $bankMoney, depositMoney, withdrawMoney } from "./state";

export default function BankAccounting() {
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

  return (
    <Stack direction="row" spacing={2}>
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
  );
}
