import { Container } from "@mui/material";
import CharacterScreen from "./character/CharacterScreen";
import CityScreen from "./city/CityScreen";
import GuildsScreen from "./city/GuildsScreen";
import TavernScreen from "./city/TavernScreen";
import BankScreen from "./city/bank/BankScreen";
import GeneralStoreScreen from "./city/generalStore/GeneralStoreScreen";
import DungeonScreen from "./dungeon/DungeonScreen";
import { Route } from "./navigation";
import GenerateCharacter from "./start/GenerateCharacter";
import MenuScreen from "./start/MenuScreen";
import StartScreen from "./start/StartScreen";

function App() {
  return (
    <Container maxWidth="md">
      <Route route="menu">
        <MenuScreen />
      </Route>
      <Route route="start">
        <StartScreen />
      </Route>
      <Route route="generate">
        <GenerateCharacter />
      </Route>
      <Route route="city">
        <CityScreen />
      </Route>
      <Route route="tavern">
        <TavernScreen />
      </Route>
      <Route route="store">
        <GeneralStoreScreen />
      </Route>
      <Route route="guilds">
        <GuildsScreen />
      </Route>
      <Route route="bank">
        <BankScreen />
      </Route>
      <Route route="dungeon">
        <DungeonScreen />
      </Route>
      <Route route="character">
        <CharacterScreen />
      </Route>
    </Container>
  );
}

export default App;
