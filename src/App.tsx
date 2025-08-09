import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme, Spinner, Box, Center } from '@chakra-ui/react';
import { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';

// Lazy load pages for better performance
const ListPage = lazy(() => import('./pages/ListPage'));
const GachaPage = lazy(() => import('./pages/GachaPage'));

// Loading component
const LoadingSpinner = () => (
  <Center h="100vh" bg="#F7F7F7">
    <Box textAlign="center">
      <Spinner size="xl" color="#FF6B6B" thickness="4px" />
    </Box>
  </Center>
);

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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/gacha" element={<GachaPage />} />
            </Routes>
          </Suspense>
        </Router>
      </AppProvider>
    </ChakraProvider>
  );
}

export default App;
