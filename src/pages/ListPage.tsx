import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ItemInput from '../components/list/ItemInput';
import CurrentItemList from '../components/list/CurrentItemList';
import FavoriteList from '../components/list/FavoriteList';
import FloatingActionButton from '../components/common/FloatingActionButton';
import SettingsButton from '../components/common/SettingsButton';
import SaveFavoriteModal from '../components/list/SaveFavoriteModal';

const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  const bgColor = useColorModeValue('#F7F7F7', 'gray.900');
  const canStartGacha = state.currentItems.length >= 2;

  const handleStartGacha = () => {
    if (canStartGacha) {
      navigate('/gacha', { state: { items: state.currentItems } });
    }
  };

  const handleSaveFavorite = () => {
    if (state.currentItems.length > 0) {
      setIsSaveModalOpen(true);
    }
  };

  if (state.isLoading) {
    return (
      <Container maxW="6xl" py={8}>
        <Text textAlign="center">로딩 중...</Text>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" pb={20}>
      <Container maxW="6xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            textAlign="center"
            color="#FF6B6B"
          >
            돌돌 🎯
          </Text>
          <Text
            fontSize="md"
            textAlign="center"
            color="gray.600"
            mb={4}
          >
            선택의 순간, 재미있는 가챠로 결정하세요!
          </Text>

          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={8}
            h={{ base: 'auto', lg: '70vh' }}
          >
            {/* 현재 작업 영역 */}
            <GridItem>
              <VStack gap={4} align="stretch" h="full">
                <Text fontSize="xl" fontWeight="semibold" color="#FF6B6B">
                  현재 항목 ({state.currentItems.length}개)
                </Text>
                
                <ItemInput onSave={handleSaveFavorite} />
                <CurrentItemList />
              </VStack>
            </GridItem>

            {/* 즐겨찾기 영역 */}
            <GridItem>
              <VStack gap={4} align="stretch" h="full">
                <Text fontSize="xl" fontWeight="semibold" color="#4ECDC4">
                  즐겨찾기 ({state.favorites.length}개)
                </Text>
                
                <FavoriteList />
              </VStack>
            </GridItem>
          </Grid>
        </VStack>

        {/* 뽑기 시작 버튼 */}
        <FloatingActionButton
          onClick={handleStartGacha}
          disabled={!canStartGacha}
          count={state.currentItems.length}
        />

        {/* 설정 버튼 */}
        <SettingsButton />

        {/* 즐겨찾기 저장 모달 */}
        <SaveFavoriteModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          items={state.currentItems}
        />
      </Container>
    </Box>
  );
};

export default ListPage;