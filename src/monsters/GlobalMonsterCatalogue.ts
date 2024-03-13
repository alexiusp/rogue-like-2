import { EAlignment } from "../common/alignment";
import { IBaseMonster } from "./model";

const GlobalMonsterCatalogue: { [name: string]: IBaseMonster } = {
  "Giant Rat": {
    name: "Giant Rat",
    picture: "",
    type: "animal",
    alignment: EAlignment.Neutral,
    level: 1,
    stats: {
      strength: 4,
      intelligence: 0,
      wisdom: 0,
      endurance: 4,
      charisma: 0,
      dexterity: 4,
    },
    baseHp: 1,
    baseMp: 0,
    specials: [],
    items: ["Bronze Dagger", null, null, null],
    money: [10, null],
  },
};

export default GlobalMonsterCatalogue;
