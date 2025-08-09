import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Badge,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { useApp } from '../../context/AppContext';
import type { Favorite } from '../../types';

const FavoriteList: React.FC = () => {
  const { state, removeFavorite, loadItems } = useApp();
  const itemBg = 'white';
  const borderColor = 'gray.200';
  const toast = useToast();

  const handleLoadFavorite = (favorite: Favorite) => {
    loadItems(favorite.items);
    toast({
      title: '즐겨찾기를 불러왔습니다',
      description: `"${favorite.name}" (${favorite.items.length}개 항목)`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeleteFavorite = (favorite: Favorite) => {
    removeFavorite(favorite.id);
    toast({
      title: '즐겨찾기가 삭제되었습니다',
      description: `"${favorite.name}"`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (state.favorites.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="md"
        color="gray.500"
      >
        <Text>저장된 즐겨찾기가 없습니다</Text>
        <Text fontSize="sm" mt={2}>
          자주 사용하는 목록을 저장해보세요
        </Text>
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      overflowY="auto"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
    >
      <VStack gap={3} align="stretch">
        {state.favorites.map((favorite) => (
          <Box
            key={favorite.id}
            bg={itemBg}
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{
              borderColor: '#4ECDC4',
              transform: 'translateY(-1px)',
            }}
          >
            <VStack gap={3} align="stretch">
              <HStack justify="space-between" align="flex-start">
                <VStack align="flex-start" spacing={1} flex={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    {favorite.name}
                  </Text>
                  <HStack spacing={2}>
                    <Badge
                      colorScheme="teal"
                      variant="subtle"
                      fontSize="xs"
                    >
                      {favorite.items.length}개 항목
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {formatDate(favorite.createdAt)}
                    </Text>
                  </HStack>
                </VStack>

                <Tooltip label="삭제">
                  <IconButton
                    aria-label={`${favorite.name} 삭제`}
                    icon={<DeleteIcon />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteFavorite(favorite)}
                  />
                </Tooltip>
              </HStack>

              {/* 미리보기 항목들 */}
              <VStack align="stretch" spacing={1}>
                {favorite.items.slice(0, 3).map((item, index) => (
                  <Text
                    key={item.id}
                    fontSize="xs"
                    color="gray.600"
                    pl={2}
                    borderLeft="2px solid"
                    borderLeftColor="#4ECDC4"
                  >
                    {index + 1}. {item.text}
                  </Text>
                ))}
                {favorite.items.length > 3 && (
                  <Text fontSize="xs" color="gray.500" pl={2}>
                    ... 외 {favorite.items.length - 3}개
                  </Text>
                )}
              </VStack>

              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<DownloadIcon />}
                onClick={() => handleLoadFavorite(favorite)}
                variant="outline"
              >
                불러오기
              </Button>
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default FavoriteList;