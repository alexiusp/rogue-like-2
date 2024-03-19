import { List, ListItem, ListItemText } from "@mui/material";
interface ISpellsTabProps {
  show: boolean;
}
export default function SpellsTab({ show }: ISpellsTabProps) {
  if (!show) {
    return null;
  }
  return (
    <List dense={true}>
      <ListItem>
        <ListItemText>Spells info tab to be developed</ListItemText>
        <ListItemText primaryTypographyProps={{ align: "right" }}>
          ---
        </ListItemText>
      </ListItem>
    </List>
  );
}
