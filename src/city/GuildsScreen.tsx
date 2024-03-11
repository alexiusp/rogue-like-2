import StoreIcon from "@mui/icons-material/Store";
import { IconButton, Typography } from "@mui/material";
import bg from "../assets/guilds-street.jpg";
import Screen from "../layout/Screen";
import { back } from "../navigation";

export default function GuildsScreen() {
  return (
    <Screen
      header={
        <>
          <IconButton onClick={() => back()} size="small">
            <StoreIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            Guilds
          </Typography>
        </>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <Typography>Guilds to be developed</Typography>
    </Screen>
  );
}
