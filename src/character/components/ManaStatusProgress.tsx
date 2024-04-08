import { useUnit } from "effector-react";
import ProgressBar from "../../components/ProgressBar";
import { $characterMana, $characterMaxMana } from "../state";

export default function ManaStatusProgress() {
  const mp = useUnit($characterMana);
  const mpMax = useUnit($characterMaxMana);
  return <ProgressBar current={mp} max={mpMax} color="info" />;
}
