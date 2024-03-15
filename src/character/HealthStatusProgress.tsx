import { useUnit } from "effector-react";
import HPProgressBar from "../components/HPProgressBar/HPProgressBar";
import { $characterHealth, $characterMaxHealth } from "./state";

export default function HealthStatusProgress() {
  const hp = useUnit($characterHealth);
  const hpMax = useUnit($characterMaxHealth);
  return <HPProgressBar hp={hp} hpMax={hpMax} />;
}
