import { List, ListItem, ListItemText } from "@mui/material";
import { useUnit } from "effector-react";
import { StatList } from "../../common/stats";
import { $characterItemsStatsBonuses, $characterStats } from "../state";

export default function StatsList() {
  const baseStats = useUnit($characterStats);
  const itemsBonuses = useUnit($characterItemsStatsBonuses);
  return (
    <List dense={true}>
      {StatList.map((statName) => (
        <ListItem key={statName}>
          <ListItemText
            primaryTypographyProps={{
              textTransform: "capitalize",
              fontWeight: itemsBonuses[statName] > 0 ? 600 : 400,
            }}
          >
            {statName}
          </ListItemText>
          <ListItemText
            primaryTypographyProps={{
              align: "right",
              fontWeight: itemsBonuses[statName] > 0 ? 600 : 400,
            }}
          >
            {baseStats[statName] + itemsBonuses[statName]}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
