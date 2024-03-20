import { EAlignment } from "../common/alignment";
import { IBaseMonster } from "./model";

const GlobalMonsterCatalogue: { [name: string]: IBaseMonster } = {
  "Giant Rat": {
    name: "Giant Rat",
    picture: "giant-rat.png",
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
    baseHp: 15,
    baseMp: 0,
    specials: [],
    items: ["Bronze Dagger", null, null, null],
    money: [10, 10, 10, 5, 5, null],
  },
};

export default GlobalMonsterCatalogue;
