import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    svg: {
      buttonColor: string;
      tabButtonColor: string;
    };
    chatMessage: {
      outgoing: string;
    };
  }
  interface ThemeOptions {
    svg?: {
      buttonColor?: string;
      tabButtonColor?: string;
    };
    chatMessage?: {
      outgoing?: string;
    };
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9b8a65',
    },
    text: {
      primary: '#f0e7d5',
    },
  },
  svg: {
    buttonColor: '#f0e7d5',
    tabButtonColor: '#f0e7d5',
  },
  chatMessage: {
    outgoing: '#9b8a65',
  },
});

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  svg: {
    buttonColor: '#ffffff',
    tabButtonColor: '#000000',
  },
  chatMessage: {
    outgoing: '#c2e0ff',
  },
});
