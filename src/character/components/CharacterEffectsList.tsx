import { Typography } from "@mui/material";
import { useUnit } from "effector-react";
import { $characterEffects } from "../../magic/effects/state";

export default function CharacterEffectsList() {
  const effects = useUnit($characterEffects);
  return (
    <>
      {effects.map((effect, index) => (
        <Typography component="span" key={`${index}-${effect.name}`}>
          {effect.name}
        </Typography>
      ))}
    </>
  );
}
