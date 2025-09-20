import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Box from "@mui/material/Box";

export default function AppBarSite() {
  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={0}
      sx={{ top: 0, left: 0, right: 0 }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 }, gap: 2 }}>
        <MenuBookIcon />
        <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 2 }}>
          BOOKHUB
        </Typography>

        <Box sx={{ display: "flex", gap: 1, ml: 3 }}>
          <Button color="inherit" >
            TRENDING
          </Button>
          <Button color="inherit" component={Link} to="/browse">
            BROWSE
          </Button>
          <Button color="inherit" component={Link} to="/random">
            RANDOM
          </Button>
          <Button color="inherit">
            ABOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
