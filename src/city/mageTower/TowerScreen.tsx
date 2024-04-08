import CastleIcon from "@mui/icons-material/Castle";
import { IconButton, Typography } from "@mui/material";
import bg from "../../assets/mage-tower.webp";
import Screen from "../../layout/Screen";
import { back } from "../../navigation";

export default function TowerScreen() {
  const goBackToCity = () => {
    back();
  };

  return (
    <Screen
      header={
        <>
          <IconButton onClick={goBackToCity} size="small">
            <CastleIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            Tower of the Mage
          </Typography>
        </>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <Typography>
        The doorkeeper briefly looks at you and refuses to let you in.
      </Typography>
    </Screen>
  );
}
