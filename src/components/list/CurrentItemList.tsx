import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useApp } from '../../context/AppContext';

const CurrentItemList: React.FC = () => {
  const { state, removeItem } = useApp();
  const itemBg = 'white';
  const borderColor = 'gray.200';

  if (state.currentItems.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="md"
        color="gray.500"
      >
        <Text>항목을 추가해주세요</Text>
        <Text fontSize="sm" mt={2}>
          뽑기를 시작하려면 최소 2개의 항목이 필요합니다
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
      <VStack gap={2} align="stretch">
        {state.currentItems.map((item, index) => (
          <Box
            key={item.id}
            bg={itemBg}
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{
              borderColor: '#FF6B6B',
              transform: 'translateY(-1px)',
            }}
          >
            <HStack justify="space-between" align="center">
              <HStack spacing={3}>
                <Badge
                  colorScheme="red"
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {index + 1}
                </Badge>
                <Text fontSize="sm" fontWeight="medium">
                  {item.text}
                </Text>
              </HStack>
              
              <IconButton
                aria-label={`${item.text} 삭제`}
                icon={<CloseIcon />}
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={() => removeItem(item.id)}
                _hover={{
                  bg: 'red.100',
                }}
              />
            </HStack>
          </Box>
        ))}
      </VStack>
      
      {state.currentItems.length < 2 && (
        <Text
          fontSize="xs"
          color="orange.500"
          textAlign="center"
          mt={4}
          fontWeight="medium"
        >
          ⚠️ 뽑기를 하려면 {2 - state.currentItems.length}개 더 추가해주세요
        </Text>
      )}
    </Box>
  );
};

export default CurrentItemList;