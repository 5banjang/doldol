import React, { useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Item } from '../../types';

interface ResultDisplayProps {
  item: Item;
  showResult: boolean;
  timingAccuracy?: 'perfect' | 'good' | 'miss';
  xpGained?: number;
}

const MotionBox = motion(Box);
const MotionText = motion(Text);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ item, showResult, timingAccuracy, xpGained }) => {
  useEffect(() => {
    if (showResult) {
      // 타이밍 정확도에 따른 다른 색종이 효과
      let colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38BA8'];
      let particleCount = 50;
      let duration = 3000;

      if (timingAccuracy === 'perfect') {
        colors = ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#00CED1'];
        particleCount = 100;
        duration = 5000;
      } else if (timingAccuracy === 'good') {
        colors = ['#32CD32', '#00FF7F', '#ADFF2F', '#98FB98'];
        particleCount = 75;
        duration = 4000;
      }

      const end = Date.now() + duration;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors,
        });

        confetti({
          particleCount,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors,
        });
      }, timingAccuracy === 'perfect' ? 50 : 100);

      // 초기 폭발 효과
      setTimeout(() => {
        confetti({
          particleCount: timingAccuracy === 'perfect' ? 200 : particleCount * 2,
          angle: 90,
          spread: 80,
          origin: { x: 0.5, y: 0.6 },
          colors,
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [showResult, timingAccuracy]);

  if (!showResult) return null;

  return (
    <Box position="relative" w="full" display="flex" justifyContent="center">
      {/* 배경 효과 */}
      <Box
        position="absolute"
        top="-50px"
        left="-50px"
        w="400px"
        h="400px"
        bg="radial-gradient(circle, rgba(255, 230, 109, 0.3) 0%, transparent 70%)"
        borderRadius="full"
        pointerEvents="none"
        as={MotionBox}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        } as any}
      />

      <MotionBox
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.8,
        }}
        position="relative"
        zIndex={2}
      >
        <VStack gap={6}>
          {/* 🎉 아이콘 */}
          <MotionText
            fontSize="4xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            🎉
          </MotionText>

          {/* 타이밍 정확도 표시 */}
          {timingAccuracy && (
            <Badge
              colorScheme={
                timingAccuracy === 'perfect' ? 'yellow' :
                timingAccuracy === 'good' ? 'green' : 'gray'
              }
              variant="solid"
              px={4}
              py={2}
              fontSize="md"
              borderRadius="full"
              boxShadow="0 4px 12px rgba(255, 230, 109, 0.4)"
            >
              {timingAccuracy === 'perfect' && '🏆 완벽한 타이밍!'}
              {timingAccuracy === 'good' && '👍 좋은 타이밍!'}
              {timingAccuracy === 'miss' && '😅 아쉬운 타이밍'}
            </Badge>
          )}

          {/* "결과" 라벨 */}
          <Badge
            colorScheme="purple"
            variant="solid"
            px={4}
            py={2}
            fontSize="md"
            borderRadius="full"
            boxShadow="0 4px 12px rgba(128, 90, 213, 0.4)"
          >
            🎯 결과
          </Badge>

          {/* 메인 결과 */}
          <MotionBox
            bg="white"
            p={8}
            borderRadius="2xl"
            boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
            border="4px solid #FFE66D"
            position="relative"
            whileHover={{ scale: 1.05 }}
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(78, 205, 196, 0.05) 100%)"
              borderRadius="xl"
            />
            
            <MotionText
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              color="#2D3748"
              textAlign="center"
              position="relative"
              zIndex={1}
            >
              {item.text}
            </MotionText>

            <Box
              position="absolute"
              top="-10px"
              right="-10px"
              w="30px"
              h="30px"
              bg="#FFE66D"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 8px rgba(255, 230, 109, 0.3)"
            >
              <Text fontSize="lg">✨</Text>
            </Box>
          </MotionBox>

          {/* XP 획득 정보 */}
          {xpGained && (
            <MotionText
              fontSize="lg"
              fontWeight="bold"
              color={timingAccuracy === 'perfect' ? '#FFD700' : '#4ECDC4'}
              textAlign="center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              +{xpGained} XP 획득! 💎
            </MotionText>
          )}

          {/* 축하 메시지 */}
          <MotionText
            fontSize="lg"
            fontWeight="medium"
            color="#4ECDC4"
            textAlign="center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            선택되었습니다! 🎊
          </MotionText>
        </VStack>
      </MotionBox>
    </Box>
  );
};

export default ResultDisplay;