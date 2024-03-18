import GlobalItemsCatalogue from "./GlobalItemsCatalogue";
import { IdLevel } from "./models";

interface IItemNameProps {
  item: string;
  idLevel: IdLevel;
}

export default function ItemName({ item, idLevel }: IItemNameProps) {
  const { name, kind } = GlobalItemsCatalogue[item];
  const itemNameToDisplay = idLevel === 2 ? name : kind;
  return <span>{itemNameToDisplay}</span>;
}
