interface ICharacterAgeLabelProps {
  age: number;
}

export default function CharacterAgeLabel({ age }: ICharacterAgeLabelProps) {
  const years = Math.trunc(age);
  const months = Math.round((age - Math.trunc(age)) * 12);
  const pluralLabel = months > 1 ? "s" : "";
  return (
    <span>
      {years} years {months} month{pluralLabel}
    </span>
  );
}
