import { Container } from "@mui/material";
import RewardScreen from "./battle/RewardScreen";
import CharacterScreen from "./character/CharacterScreen";
import CityScreen from "./city/CityScreen";
import BankScreen from "./city/bank/BankScreen";
import GeneralStoreScreen from "./city/generalStore/GeneralStoreScreen";
import TowerScreen from "./city/mageTower/TowerScreen";
import TavernScreen from "./city/tavern/TavernScreen";
import ChestScreen from "./dungeon/ChestScreen";
import DungeonScreen from "./dungeon/DungeonScreen";
import EncounterScreen from "./dungeon/EncounterScreen";
import GuildsScreen from "./guilds/GuildsScreen";
import Messages from "./messages/Messages";
import { Route } from "./navigation";
import GenerateCharacter from "./start/GenerateCharacter";
import MenuScreen from "./start/MenuScreen";
import StartScreen from "./start/StartScreen";

function App() {
  return (
    <Container component="main" maxWidth="md">
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
      <Route route="encounter">
        <EncounterScreen />
      </Route>
      <Route route="reward">
        <RewardScreen />
      </Route>
      <Route route="tower">
        <TowerScreen />
      </Route>
      <Route route="chest">
        <ChestScreen />
      </Route>
      <Messages />
    </Container>
  );
}

export default App;
