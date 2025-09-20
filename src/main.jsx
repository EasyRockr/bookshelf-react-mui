import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1c1c1c', 
    },
    background: {
      default: '#121212',
      paper: '#1c1c1c',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline /> 
    <App />
  </ThemeProvider>
);
