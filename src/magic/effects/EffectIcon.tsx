import { Badge, Tooltip } from "@mui/material";
import "./EffectIcon.css";
import { GlobalEffectCatalogue } from "./GlobalEffectCatalogue";

interface IEffectIconProps {
  effectName: string;
  size?: "small" | "default";
  showTooltip?: boolean;
  timeout?: number;
}

export default function EffectIcon({
  effectName,
  size = "default",
  showTooltip = true,
  timeout,
}: IEffectIconProps) {
  const effect = GlobalEffectCatalogue[effectName];
  const className = `effect-icon ${size}`;
  let icon = (
    <img
      className={className}
      src={`/src/assets/effects/${effect.picture}`}
      alt={effect.name}
    />
  );
  if (timeout) {
    icon = <Badge badgeContent={4}>{icon}</Badge>;
  }
  if (showTooltip) {
    icon = (
      <Tooltip arrow title={effectName}>
        {icon}
      </Tooltip>
    );
  }
  return icon;
}
