import React from 'react';
import {
  Box,
  Text,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { Item } from '../../types';
import { shuffleArray } from '../../utils/helpers';

interface GachaAnimationProps {
  items: Item[];
}

const MotionBox = motion(Box);
const MotionText = motion(Text);

const GachaAnimation: React.FC<GachaAnimationProps> = ({ items }) => {
  const animationItems = React.useMemo(() => {
    const repeated = [];
    for (let i = 0; i < 10; i++) {
      repeated.push(...shuffleArray(items));
    }
    return repeated.slice(0, 20); // 성능을 위해 제한
  }, [items]);

  return (
    <Box
      position="relative"
      w="full"
      h="400px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      bg="linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)"
      borderRadius="xl"
      boxShadow="xl"
    >
      {/* 배경 효과 */}
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* 중앙 뽑기 슬롯 */}
      <Box
        position="relative"
        w="300px"
        h="200px"
        bg="white"
        borderRadius="lg"
        border="4px solid white"
        boxShadow="inset 0 0 20px rgba(0,0,0,0.1)"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* 간단한 애니메이션 */}
        <VStack gap={2} position="absolute" w="full">
          {animationItems.slice(0, 5).map((item, index) => (
            <MotionText
              key={`${item.id}-${index}`}
              fontSize="lg"
              fontWeight="bold"
              color="#2D3748"
              textAlign="center"
              px={4}
              py={2}
              w="full"
              initial={{ y: -100, opacity: 0 }}
              animate={{
                y: [0, 100],
                opacity: [1, 0],
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              {item.text}
            </MotionText>
          ))}
        </VStack>

        {/* 포커스 라인 */}
        <Box
          position="absolute"
          top="45%"
          left={0}
          right={0}
          h="2px"
          bg="#FF6B6B"
          zIndex={2}
        />
        <Box
          position="absolute"
          top="55%"
          left={0}
          right={0}
          h="2px"
          bg="#FF6B6B"
          zIndex={2}
        />
      </Box>

      {/* 로딩 텍스트 */}
      <MotionText
        position="absolute"
        bottom="20px"
        fontSize="sm"
        color="white"
        fontWeight="medium"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      >
        뽑는 중...
      </MotionText>
    </Box>
  );
};

export default GachaAnimation;