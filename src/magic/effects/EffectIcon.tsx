import "./EffectIcon.css";
import { GlobalEffectCatalogue } from "./GlobalEffectCatalogue";

interface IEffectIconProps {
  effectName: string;
  size?: "small" | "default";
}

export default function EffectIcon({
  effectName,
  size = "default",
}: IEffectIconProps) {
  const effect = GlobalEffectCatalogue[effectName];
  const className = `effect-icon ${size}`;
  return (
    <img
      className={className}
      src={`/src/assets/effects/${effect.picture}`}
      alt={effect.name}
    />
  );
}
