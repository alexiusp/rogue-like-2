import { getAlignmentShort } from "../common/alignment";
import GlobalItemsCatalogue from "./GlobalItemsCatalogue";
import { TGameItem } from "./models";

interface IItemNameProps {
  item: TGameItem;
}

export default function ItemName({ item }: IItemNameProps) {
  const { item: itemName, kind: itemKind, idLevel, alignment } = item;
  const baseItem = GlobalItemsCatalogue[itemName];
  const { aligned, name, kind, material = "" } = baseItem;
  if (idLevel === 0) return `<Unknown ${kind}>`;
  const itemNameToDisplay = idLevel > 1 ? name : `${material} ${kind}`;
  const alignmentLabel =
    idLevel === 2 && aligned ? ` [${getAlignmentShort(alignment)}]` : "";
  const usableSuffix =
    idLevel === 2 && itemKind === "usable" ? ` [${item.usesLeft}]` : "";
  return (
    <span>
      {itemNameToDisplay}
      {alignmentLabel}
      {usableSuffix}
    </span>
  );
}
