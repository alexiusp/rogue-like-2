import { AppBar, Box, Container, Paper, SxProps, Toolbar } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import "./Screen.css";

interface IScreenProps extends PropsWithChildren {
  header?: ReactNode;
  sx?: SxProps;
  paperSx?: SxProps;
}

export default function Screen({
  children,
  header,
  sx,
  paperSx,
}: IScreenProps) {
  const appBar = header ? (
    <AppBar position="absolute" className="screen-header">
      <Container maxWidth="md">
        <Toolbar disableGutters={true}>{header}</Toolbar>
      </Container>
    </AppBar>
  ) : null;
  const mergedBoxStyles: SxProps = {
    display: "flex",
    flexDirection: "column",
    ...sx,
  };
  const headerPadding = header ? <Toolbar></Toolbar> : null;
  const mergedPaperStyles: SxProps = {
    padding: 2,
    mt: 1,
    ...paperSx,
  };
  return (
    <Box sx={mergedBoxStyles}>
      {appBar}
      {headerPadding}
      <Paper sx={mergedPaperStyles}>{children}</Paper>
    </Box>
  );
}
