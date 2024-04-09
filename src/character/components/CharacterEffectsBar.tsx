import { Stack } from "@mui/material";
import { useUnit } from "effector-react";
import EffectIcon from "../../magic/effects/EffectIcon";
import { $characterEffects } from "../../magic/effects/state";

export default function CharacterEffectsBar() {
  const effects = useUnit($characterEffects);
  return (
    <Stack spacing={0.5} direction="row">
      {effects.map((effect, index) => (
        <EffectIcon
          key={`${index}-${effect.name}`}
          effectName={effect.name}
          timeout={effect.timeout}
        />
      ))}
    </Stack>
  );
}
