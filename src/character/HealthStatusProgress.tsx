import { useUnit } from "effector-react";
import ProgressBar from "../components/ProgressBar";
import { $characterHealth, $characterMaxHp } from "./state";

export default function HealthStatusProgress() {
  const hp = useUnit($characterHealth);
  const hpMax = useUnit($characterMaxHp);
  return <ProgressBar current={hp} max={hpMax} color="error" />;
}
