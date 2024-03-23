import { useUnit } from "effector-react";
import ProgressBar from "../components/ProgressBar";
import { $characterHealth, $characterMaxHp } from "./state";

export default function HealthStatusProgress() {
  const hp = useUnit($characterHealth);
  const hpMax = useUnit($characterMaxHp);
  const color = hp < 5 ? "error" : hp < hpMax / 2 ? "warning" : "success";
  const pulsate = hp < 5;
  return (
    <ProgressBar current={hp} max={hpMax} color={color} pulsate={pulsate} />
  );
}
