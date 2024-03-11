import { AppBar, Box, Container, Paper, SxProps, Toolbar } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import "./Screen.css";

interface IScreenProps extends PropsWithChildren {
  header?: ReactNode;
  sx?: SxProps;
}

export default function Screen({ children, header, sx }: IScreenProps) {
  const appBar = header ? (
    <AppBar position="absolute" className="screen-header">
      <Container maxWidth="md">
        <Toolbar disableGutters={true}>{header}</Toolbar>
      </Container>
    </AppBar>
  ) : null;
  const mergedStyles: SxProps = {
    display: "flex",
    flexDirection: "column",
    ...sx,
  };
  const headerPadding = header ? <Toolbar></Toolbar> : null;
  return (
    <Box sx={mergedStyles}>
      {appBar}
      {headerPadding}
      <Paper sx={{ padding: 2, mt: 1 }}>{children}</Paper>
    </Box>
  );
}
