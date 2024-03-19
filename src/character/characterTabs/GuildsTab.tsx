import { List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useUnit } from "effector-react";
import {
  getMaxSkillFromGuilds,
  getTotalSkillFromGuilds,
} from "../../guilds/models";
import { EGuild } from "../../guilds/types";
import { $characterCurrentGuild, $characterGuilds } from "../state";
interface IGuildsTabProps {
  show: boolean;
}
export default function GuildsTab({ show }: IGuildsTabProps) {
  const characterGuilds = useUnit($characterGuilds);
  const currentGuild = useUnit($characterCurrentGuild);
  if (!show) {
    return null;
  }
  const critSkill = getMaxSkillFromGuilds("crit", characterGuilds);
  const backstabSkill = getMaxSkillFromGuilds("backstab", characterGuilds);
  const swingSkill = getMaxSkillFromGuilds("swing", characterGuilds);
  const perceptionSkill = getMaxSkillFromGuilds("perception", characterGuilds);
  const openSkill = getMaxSkillFromGuilds("open", characterGuilds);
  const poisonSkill = getMaxSkillFromGuilds("poison", characterGuilds);
  const regenSkill = getMaxSkillFromGuilds("regen", characterGuilds);
  const resistSkill = getMaxSkillFromGuilds("resist", characterGuilds);
  const focusSkill = getMaxSkillFromGuilds("focus", characterGuilds);
  return (
    <Grid container spacing={2}>
      <Grid xs={6}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h5" component="h3">
            Guilds
          </Typography>
          <List dense={true}>
            {characterGuilds.map((guildInfo) => (
              <ListItem divider key={`${guildInfo.guild}`}>
                <ListItemText>{EGuild[guildInfo.guild]}</ListItemText>
                <ListItemText primaryTypographyProps={{ align: "right" }}>
                  {guildInfo.level}
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Typography variant="h5" component="h3">
            Skills
          </Typography>
          <List dense={true}>
            <ListItem divider>
              <ListItemText>Fighting</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {getTotalSkillFromGuilds("fight", characterGuilds)}
              </ListItemText>
            </ListItem>
            <ListItem divider>
              <ListItemText>Thieving</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {getTotalSkillFromGuilds("thief", characterGuilds)}
              </ListItemText>
            </ListItem>
            <ListItem divider>
              <ListItemText>Magical</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {getTotalSkillFromGuilds("magic", characterGuilds)}
              </ListItemText>
            </ListItem>
          </List>
          <Typography variant="h5" component="h3">
            Current guild
          </Typography>
          <List dense={true}>
            <ListItem>
              <ListItemText>{EGuild[currentGuild]}</ListItemText>
            </ListItem>
          </List>
        </Stack>
      </Grid>
      <Grid xs={6}>
        <Typography variant="h5" component="h3">
          Guild abilities
        </Typography>
        <List dense={true}>
          {critSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Critical hit</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {critSkill.max} from {EGuild[critSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {backstabSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Backstab</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {backstabSkill.max} from {EGuild[backstabSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {swingSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Multiple swings</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {swingSkill.max} from {EGuild[swingSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {perceptionSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Perception</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {perceptionSkill.max} from {EGuild[perceptionSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {openSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Open locks</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {openSkill.max} from {EGuild[openSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {poisonSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Poison</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {poisonSkill.max} from {EGuild[poisonSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {regenSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Mana regeneration</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {regenSkill.max} from {EGuild[regenSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {resistSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Magical resistance</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {resistSkill.max} from {EGuild[resistSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
          {focusSkill.max > 0 ? (
            <ListItem divider>
              <ListItemText>Focus</ListItemText>
              <ListItemText primaryTypographyProps={{ align: "right" }}>
                {focusSkill.max} from {EGuild[focusSkill.guild]}
              </ListItemText>
            </ListItem>
          ) : null}
        </List>
      </Grid>
    </Grid>
  );
}
