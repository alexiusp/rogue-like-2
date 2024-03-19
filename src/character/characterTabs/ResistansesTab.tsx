import { List, ListItem, ListItemText } from "@mui/material";
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
        <ListItemText>Resistanses info tab to be developed</ListItemText>
        <ListItemText primaryTypographyProps={{ align: "right" }}>
          ---
        </ListItemText>
      </ListItem>
    </List>
  );
}
