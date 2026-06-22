import { createTheme, alpha } from '@mui/material/styles';

// Design tokens -------------------------------------------------------------
// Primary / secondary / background are fixed by the brief.
// "accent" is a warm academic gold used sparingly as the page's signature
// (progress rings, GPA target, highlighted stat) so the app doesn't read as
// a flat default MUI blue theme.
export const tokens = {
  primary: '#1976d2',
  primaryDark: '#0d47a1',
  secondary: '#42a5f5',
  accent: '#c98a2c',
  background: '#f5f7fa',
  backgroundDark: '#0f1722',
  paperDark: '#16202c',
  radius: 16,
};

export const courseColorPalette = [
  '#1976d2',
  '#2e7d32',
  '#c98a2c',
  '#9c27b0',
  '#d84315',
  '#00838f',
  '#5e35b1',
  '#ad1457',
];

export const getAppTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: tokens.primary, dark: tokens.primaryDark },
      secondary: { main: tokens.secondary },
      warning: { main: tokens.accent },
      background:
        mode === 'light'
          ? { default: tokens.background, paper: '#ffffff' }
          : { default: tokens.backgroundDark, paper: tokens.paperDark },
      text:
        mode === 'light'
          ? { primary: '#1a2027', secondary: '#5b6b79' }
          : { primary: '#e7edf3', secondary: '#9fb0c0' },
      divider: mode === 'light' ? alpha('#1a2027', 0.08) : alpha('#e7edf3', 0.08),
    },
    shape: { borderRadius: tokens.radius },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Lora", "Georgia", serif', fontWeight: 700 },
      h2: { fontFamily: '"Lora", "Georgia", serif', fontWeight: 700 },
      h3: { fontFamily: '"Lora", "Georgia", serif', fontWeight: 600 },
      h4: { fontFamily: '"Lora", "Georgia", serif', fontWeight: 600 },
      h5: { fontFamily: '"Lora", "Georgia", serif', fontWeight: 600 },
      h6: { fontFamily: '"Lora", "Georgia", serif', fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: tokens.radius,
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 2px 14px 0 rgba(26,32,39,0.08)'
                : '0 2px 14px 0 rgba(0,0,0,0.5)',
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: tokens.radius - 4 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 10, fontWeight: 600 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: '0 1px 0 0 ' + theme.palette.divider,
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: 'none' },
        },
      },
    },
  });
