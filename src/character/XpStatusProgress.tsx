import { useUnit } from "effector-react";
import ProgressBar from "../components/ProgressBar";
import { $characterCurrentXp, $characterMaxXpForCurrentGuild } from "./state";

export default function XpStatusProgress() {
  const xp = useUnit($characterCurrentXp);
  const xpMax = useUnit($characterMaxXpForCurrentGuild);
  return <ProgressBar current={xp} max={xpMax} color="inherit" />;
}
