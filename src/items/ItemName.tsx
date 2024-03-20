import { getAlignmentShort } from "../common/alignment";
import GlobalItemsCatalogue from "./GlobalItemsCatalogue";
import { TGameItem } from "./models";

interface IItemNameProps {
  item: TGameItem;
}

export default function ItemName({ item }: IItemNameProps) {
  const { item: itemName, idLevel, alignment } = item;
  if (idLevel === 0) return "<Unknown>";
  const baseItem = GlobalItemsCatalogue[itemName];
  const { aligned, name, kind, material = "" } = baseItem;
  const itemNameToDisplay = idLevel > 0 ? name : `${material} ${kind}`;
  const alignmentLabel =
    idLevel === 2 && aligned ? ` [${getAlignmentShort(alignment)}]` : "";
  return (
    <span>
      {itemNameToDisplay}
      {alignmentLabel}
    </span>
  );
}
