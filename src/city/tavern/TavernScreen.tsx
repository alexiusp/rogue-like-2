import RestaurantIcon from "@mui/icons-material/Restaurant";
import { IconButton, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import bg from "../../assets/tavern.jpg";
import Screen from "../../layout/Screen";
import { back } from "../../navigation";
import DrinksTab from "./DrinksTab";
import TalksTab from "./TalksTab";

type TTabName = "drinks" | "talks";

export default function TavernScreen() {
  const [tab, toggleTab] = useState<TTabName>("drinks");
  const handleTabChange = (_: React.SyntheticEvent, newValue: TTabName) => {
    toggleTab(newValue);
  };
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
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab value="drinks" label="Drinks" />
        <Tab value="talks" label="Talks" />
      </Tabs>
      <DrinksTab show={tab === "drinks"} />
      <TalksTab show={tab === "talks"} />
    </Screen>
  );
}
