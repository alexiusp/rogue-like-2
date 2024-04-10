import { Box, Collapse, Stack, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import SpellsList from "../character/components/SpellsList";
import UsableItemsList from "../character/components/UsableItemsList";
import ActionButton from "../components/ActionButton/ActionButton";

type TDungeonActionMode = "buffer" | "items" | "spells";

export default function ActionBar() {
  const [action, selectAction] = useState<TDungeonActionMode>("buffer");
  return (
    <Stack>
      <ToggleButtonGroup size="large" value={action}>
        <ActionButton action="buffer" onClick={() => selectAction("buffer")} />
        <ActionButton action="items" onClick={() => selectAction("items")} />
        <ActionButton action="spells" onClick={() => selectAction("spells")} />
      </ToggleButtonGroup>
      <Box sx={{ minHeight: "72px", mt: 0.5 }}>
        <Collapse in={action === "buffer"}>
          <Box>buffer not implemented yet</Box>
        </Collapse>
        <Collapse in={action === "items"}>
          <UsableItemsList filter="dungeon" />
        </Collapse>
        <Collapse in={action === "spells"}>
          <SpellsList filter="dungeon" />
        </Collapse>
      </Box>
    </Stack>
  );
}
