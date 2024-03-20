import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { EGuild, TGuildValues } from "../guilds/types";
import { IdLevel } from "./models";

interface IItemGuildRequirementsProps {
  idLevel: IdLevel;
  requirements: TGuildValues;
}
export default function ItemGuildRequirements({
  idLevel,
  requirements,
}: IItemGuildRequirementsProps) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            <Typography>Guilds allowed:</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {requirements.map((requirement) => (
          <TableRow key={`${requirement.guild}`}>
            <TableCell>{EGuild[requirement.guild]}</TableCell>
            <TableCell>{idLevel === 2 ? requirement.value : "?"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
