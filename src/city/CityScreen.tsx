import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import BalanceIcon from "@mui/icons-material/Balance";
import CastleIcon from "@mui/icons-material/Castle";
import ExploreIcon from "@mui/icons-material/Explore";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StoreIcon from "@mui/icons-material/Store";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import bg from "../assets/city.webp";
import { descendToDungeonLevel, dungeonLoaded } from "../dungeon/state";
import Screen from "../layout/Screen";
import { navigate } from "../navigation";
import CityStatusBar from "./CityStatusBar";
import { storeStateLoaded, storeStateSaved } from "./generalStore/state";

export default function CityScreen() {
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    if (dataLoaded) {
      return;
    }
    storeStateLoaded();
    dungeonLoaded();
    setDataLoaded(true);
  }, [dataLoaded, setDataLoaded]);
  const openDungeon = () => {
    storeStateSaved();
    navigate("dungeon");
    descendToDungeonLevel(1);
  };
  return (
    <Screen
      header={
        <Typography variant="h3" component="h1">
          City
        </Typography>
      }
    >
      <img src={bg} style={{ objectFit: "cover", width: "100%" }} />
      <CityStatusBar />
      <Grid container spacing={0.5}>
        <Grid xs={6}>
          <Button
            onClick={() => navigate("tavern")}
            size="large"
            variant="outlined"
            fullWidth={true}
            startIcon={<RestaurantIcon />}
          >
            Tavern
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            onClick={() => navigate("store")}
            size="large"
            variant="outlined"
            fullWidth={true}
            startIcon={<BalanceIcon />}
          >
            General Store
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            onClick={() => navigate("guilds")}
            size="large"
            variant="outlined"
            fullWidth={true}
            startIcon={<StoreIcon />}
          >
            Guilds
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            onClick={() => navigate("bank")}
            size="large"
            variant="outlined"
            fullWidth={true}
            startIcon={<AccountBalanceIcon />}
          >
            Bank
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            onClick={() => navigate("tower")}
            size="large"
            variant="outlined"
            fullWidth={true}
            startIcon={<CastleIcon />}
          >
            Tower of the Mage
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            onClick={() => navigate("character")}
            size="large"
            variant="outlined"
            fullWidth={true}
            startIcon={<AccountBoxIcon />}
          >
            Character
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            onClick={openDungeon}
            size="large"
            variant="outlined"
            fullWidth={true}
            startIcon={<ExploreIcon />}
          >
            Dungeon
          </Button>
        </Grid>
      </Grid>
    </Screen>
  );
}
