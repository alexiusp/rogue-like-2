import heartImg from "../assets/items/heart.png";
import "./XpLabel.css";

interface IXpLabelProps {
  amount: number;
}

export default function XpLabel({ amount }: IXpLabelProps) {
  return (
    <span className="xp-label">
      <img src={heartImg} alt="xp" />
      <span>{amount} XP</span>
    </span>
  );
}
