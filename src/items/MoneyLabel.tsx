import moneyImg from "../assets/items/coins.png";
import "./MoneyLabel.css";

interface IMoneyLabelProps {
  amount: number;
}

export default function MoneyLabel({ amount }: IMoneyLabelProps) {
  return (
    <span className="money-label">
      <img src={moneyImg} alt="money" />
      <span>{amount} Gold</span>
    </span>
  );
}
