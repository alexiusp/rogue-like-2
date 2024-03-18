import GlobalItemsCatalogue from "./GlobalItemsCatalogue";
import "./ItemIcon.css";

interface IItemIconProps {
  item: string;
}

export default function ItemIcon({ item }: IItemIconProps) {
  const picture = GlobalItemsCatalogue[item].picture;
  return (
    <img
      className="item-icon"
      src={`/src/assets/items/${picture}`}
      alt={item}
    />
  );
}
