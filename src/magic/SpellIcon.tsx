import GlobalBaseSpellsCatalogue from "./GlobalSpellsCatalogue";
import "./SpellIcon.css";

interface ISpellIconProps {
  spell: string;
}

export default function SpellIcon({ spell }: ISpellIconProps) {
  const { name, picture } = GlobalBaseSpellsCatalogue[spell];
  return (
    <img
      className="spell-icon"
      src={`/src/assets/spells/${picture}`}
      alt={name}
    />
  );
}
