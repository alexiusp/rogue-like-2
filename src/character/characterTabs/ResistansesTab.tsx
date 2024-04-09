import { List, ListItem, ListItemText, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CharacterEffectsList from "../components/CharacterEffectsList";
interface IResistansesTabProps {
  show: boolean;
}
export default function ResistansesTab({ show }: IResistansesTabProps) {
  if (!show) {
    return null;
  }
  return (
    <Grid container spacing={0.5}>
      <Grid xs={6}>
        <Typography variant="h6" component="h4">
          Active effects:
        </Typography>
        <CharacterEffectsList />
      </Grid>
      <Grid xs={6}>
        <Typography variant="h6" component="h4">
          Resistances:
        </Typography>
        <List dense={true}>
          <ListItem>
            <ListItemText>Resistanses info to be developed</ListItemText>
            <ListItemText primaryTypographyProps={{ align: "right" }}>
              ---
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}
