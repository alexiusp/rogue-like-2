import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useUnit } from "effector-react";
import EffectIcon from "../../magic/effects/EffectIcon";
import { $characterEffects } from "../../magic/effects/state";

export default function CharacterEffectsList() {
  const effects = useUnit($characterEffects);
  return (
    <List dense={true}>
      {effects.map((effect, index) => (
        <ListItem key={`${index}-${effect.name}`}>
          <ListItemIcon>
            <EffectIcon effectName={effect.name} showTooltip={false} />
          </ListItemIcon>
          <ListItemText>{effect.name}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
