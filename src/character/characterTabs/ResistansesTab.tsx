import { Divider, List, ListItem, ListItemText } from "@mui/material";
import CharacterEffectsList from "../components/CharacterEffectsList";
interface IResistansesTabProps {
  show: boolean;
}
export default function ResistansesTab({ show }: IResistansesTabProps) {
  if (!show) {
    return null;
  }
  return (
    <List dense={true}>
      <ListItem>
        <ListItemText>Active effects:</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          <CharacterEffectsList />
        </ListItemText>
      </ListItem>
      <Divider component="li" />
      <ListItem>
        <ListItemText>Current resistances:</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>Resistanses info to be developed</ListItemText>
        <ListItemText primaryTypographyProps={{ align: "right" }}>
          ---
        </ListItemText>
      </ListItem>
    </List>
  );
}
