import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useUnit } from "effector-react";
import "./Messages.css";
import { $messages } from "./state";

export default function Messages() {
  const messages = useUnit($messages);
  const list = messages.slice(-50).reverse();
  return (
    <Paper sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            Messages: <Chip component="span" label={list.length} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="messages-container">
          <List>
            {list.map((msg, index) => (
              <ListItem dense={true} key={index}>
                <ListItemText primary={msg} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
