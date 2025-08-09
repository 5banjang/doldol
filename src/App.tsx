import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AppProvider } from './context/AppContext';
import ListPage from './pages/ListPage';
import GachaPage from './pages/GachaPage';

const theme = extendTheme({
  fonts: {
    heading: '"Noto Sans KR", sans-serif',
    body: '"Noto Sans KR", sans-serif',
  },
  colors: {
    brand: {
      50: '#FFE8E8',
      100: '#FFBDBD',
      200: '#FF9292',
      300: '#FF6B6B',
      400: '#FF4444',
      500: '#FF1D1D',
      600: '#E60000',
      700: '#B30000',
      800: '#800000',
      900: '#4D0000',
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/gacha" element={<GachaPage />} />
          </Routes>
        </Router>
      </AppProvider>
    </ChakraProvider>
  );
}

export default App;
