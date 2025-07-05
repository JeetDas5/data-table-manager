"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorMode } from "@/hooks/ThemeToggle";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const Navbar = () => {
  const { toggleColorMode, mode } = useColorMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
        color: theme.palette.mode === "dark" ? "#f5f5f5" : "#1a1a1a",
        boxShadow: "none",
        borderBottom: `1px solid ${
          theme.palette.mode === "dark" ? "#333" : "#ddd"
        }`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          className="text-blue-600"
          sx={{
            color: theme.palette.mode === "dark" ? "#2d93cf" : "#0f72db",
            fontSize: "1.5rem",
          }}
        >
          Dynamic Data Table
        </Typography>
        <Box>
          <Button
            onClick={toggleColorMode}
            variant="outlined"
            sx={{
              color: theme.palette.mode === "dark" ? "#f87171" : "#3b82f6",
              borderColor:
                theme.palette.mode === "dark" ? "#f87171" : "#3b82f6",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#f87171" : "#3b82f6",
                color: "#fff",
              },
            }}
            startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          >
            <Typography sx={{ display: isMobile ? "none" : "block" }}>
              Toggle Theme
            </Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
