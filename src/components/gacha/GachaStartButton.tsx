import React from 'react';
import {
  Button,
  VStack,
  Text,
  Box,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { GameStats } from '../../types';

interface GachaStartButtonProps {
  onStart: () => void;
  gameStats: GameStats;
  itemCount: number;
}

const MotionButton = motion(Button);
const MotionBox = motion(Box);

const GachaStartButton: React.FC<GachaStartButtonProps> = ({
  onStart,
  gameStats,
  itemCount,
}) => {
  return (
    <VStack spacing={6}>
      {/* 레벨 표시 */}
      <MotionBox
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <Badge
          colorScheme="purple"
          fontSize="lg"
          px={4}
          py={2}
          borderRadius="full"
          textAlign="center"
        >
          🏆 레벨 {gameStats.level} (XP: {gameStats.xp})
        </Badge>
      </MotionBox>

      {/* 준비 메시지 */}
      <VStack spacing={2}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="#FF6B6B"
          textAlign="center"
        >
          🎯 가챠 준비 완료!
        </Text>
        <Text
          fontSize="md"
          color="gray.600"
          textAlign="center"
        >
          {itemCount}개의 항목에서 하나를 뽑아보세요
        </Text>
        <Text
          fontSize="sm"
          color="gray.500"
          textAlign="center"
        >
          💡 타이밍을 맞춰서 더 많은 XP를 획득하세요!
        </Text>
      </VStack>

      {/* 메인 시작 버튼 */}
      <MotionButton
        size="xl"
        colorScheme="red"
        onClick={onStart}
        px={12}
        py={8}
        fontSize="2xl"
        fontWeight="bold"
        borderRadius="full"
        boxShadow="0 8px 25px rgba(255, 107, 107, 0.4)"
        _hover={{
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 30px rgba(255, 107, 107, 0.5)',
        }}
        _active={{
          transform: 'translateY(-1px)',
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🎲 뽑기 시작!
      </MotionButton>

      {/* 펄스 효과 */}
      <MotionBox
        position="absolute"
        w="200px"
        h="80px"
        borderRadius="full"
        border="3px solid #FF6B6B"
        opacity={0.3}
        zIndex={-1}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 통계 정보 */}
      <VStack spacing={1} pt={4}>
        <Text fontSize="xs" color="gray.500">
          총 가챠: {gameStats.totalGachas}회 | 완벽 타이밍: {gameStats.perfectTimings}회
        </Text>
        {gameStats.achievements.length > 0 && (
          <Text fontSize="xs" color="purple.500">
            🏅 달성 업적: {gameStats.achievements.length}개
          </Text>
        )}
      </VStack>
    </VStack>
  );
};

export default GachaStartButton;