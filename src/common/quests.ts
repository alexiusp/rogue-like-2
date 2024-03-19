enum EQuestKind {
  Item,
  Monster,
}

interface IQuest {
  name: string;
  kind: EQuestKind;
}

interface IItemQuest extends IQuest {
  kind: EQuestKind.Item;
  item: string;
}

interface IMonsterQuest extends IQuest {
  kind: EQuestKind.Monster;
  monster: string;
}

export type TQuest = IItemQuest | IMonsterQuest;

export function printQuest(quest: TQuest) {
  switch (quest.kind) {
    case EQuestKind.Item:
      return `bring ${quest.item}`;
    case EQuestKind.Monster:
      return `kill a ${quest.monster}`;
  }
}
