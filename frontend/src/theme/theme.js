// src/theme/theme.js
// Custom Material UI theme — dark editorial with amber accent

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a1a1a",
      light: "#3d3d3d",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c8862a",
      light: "#e9a94a",
      dark: "#9a6419",
      contrastText: "#ffffff",
    },
    background: {
      default: "#faf8f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#6b6560",
    },
    error: { main: "#c0392b" },
    success: { main: "#27735a" },
    divider: "#e8dfd3",
  },
  typography: {
    fontFamily: '"Inter", "DM Sans", -apple-system, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.01em" },
  },
  shape: { borderRadius: 10 },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.08)",
    "0 2px 8px rgba(0,0,0,0.10)",
    "0 4px 16px rgba(0,0,0,0.10)",
    "0 8px 24px rgba(0,0,0,0.12)",
    "0 12px 40px rgba(0,0,0,0.14)",
    ...Array(19).fill("0 12px 40px rgba(0,0,0,0.14)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.9rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.12)" },
        },
        sizeLarge: { padding: "14px 32px", fontSize: "1rem" },
        sizeSmall: { padding: "6px 16px", fontSize: "0.82rem" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#ffffff",
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#c8862a" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#c8862a",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.75rem" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(250,248,245,0.9)",
          borderBottom: "1px solid #e8dfd3",
          boxShadow: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20 },
      },
    },
  },
});

export default theme;
