import RestaurantIcon from "@mui/icons-material/Restaurant";
import { IconButton, Typography } from "@mui/material";
import bg from "../assets/tavern.jpg";
import Screen from "../layout/Screen";
import { back } from "../navigation";

export default function TavernScreen() {
  return (
    <Screen
      header={
        <>
          <IconButton onClick={() => back()} size="small">
            <RestaurantIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            Tavern
          </Typography>
        </>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <Typography>
        To Be Implemented: Health/mana restoration, quests etc.
      </Typography>
    </Screen>
  );
}
