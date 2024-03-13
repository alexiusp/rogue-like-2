const MonstersByLevel = [["Giant Rat"]];

export default function getMonstersForLevel(level: number) {
  return MonstersByLevel[level - 1];
}
