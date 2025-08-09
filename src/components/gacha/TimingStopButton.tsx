import React, { useState, useEffect } from 'react';
import {
  Button,
  VStack,
  Text,
  Progress,
  Box,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { TimingGame } from '../../types';

interface TimingStopButtonProps {
  timingGame: TimingGame;
  onStop: (accuracy: 'perfect' | 'good' | 'miss') => void;
  animationDuration: number;
}

const MotionButton = motion(Button);
const MotionBox = motion(Box);

const TimingStopButton: React.FC<TimingStopButtonProps> = ({
  timingGame,
  onStop,
  animationDuration,
}) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(animationDuration);

  useEffect(() => {
    if (!timingGame.isActive) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = (elapsed / animationDuration) * 100;
      const remaining = Math.max(0, animationDuration - elapsed);
      
      setProgress(Math.min(100, progressPercent));
      setTimeLeft(remaining);

      // 자동으로 끝나는 경우 (miss 처리)
      if (elapsed >= animationDuration) {
        clearInterval(interval);
        onStop('miss');
      }
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [timingGame.isActive, animationDuration, onStop]);

  const handleStop = () => {
    const currentTime = Date.now() - timingGame.startTime;
    
    let accuracy: 'perfect' | 'good' | 'miss';
    
    if (currentTime >= timingGame.targetZoneStart && currentTime <= timingGame.targetZoneEnd) {
      // 완벽한 타이밍 존 (1.5-2.5초)
      accuracy = 'perfect';
    } else if (
      (currentTime >= timingGame.targetZoneStart - 500 && currentTime < timingGame.targetZoneStart) ||
      (currentTime > timingGame.targetZoneEnd && currentTime <= timingGame.targetZoneEnd + 500)
    ) {
      // 좋은 타이밍 존 (완벽 타이밍 전후 0.5초)
      accuracy = 'good';
    } else {
      // 놓친 타이밍
      accuracy = 'miss';
    }
    
    onStop(accuracy);
  };

  const getTargetZoneColor = () => {
    const targetStart = (timingGame.targetZoneStart / animationDuration) * 100;
    const targetEnd = (timingGame.targetZoneEnd / animationDuration) * 100;
    
    if (progress >= targetStart && progress <= targetEnd) {
      return 'green.400';
    }
    return 'yellow.400';
  };

  if (!timingGame.isActive) return null;

  return (
    <VStack spacing={4} w="full" maxW="400px">
      {/* 타이밍 바 */}
      <Box w="full" position="relative">
        <Progress
          value={progress}
          size="lg"
          colorScheme={progress >= 50 && progress <= 83 ? 'green' : 'red'}
          bg="gray.200"
          borderRadius="full"
          height="20px"
        />
        
        {/* 완벽 타이밍 존 표시 */}
        <Box
          position="absolute"
          top="0"
          left="50%"
          width="33%"
          height="20px"
          bg="green.200"
          borderRadius="full"
          border="2px solid"
          borderColor="green.400"
          opacity={0.7}
        />
        
        {/* 현재 위치 표시 */}
        <MotionBox
          position="absolute"
          top="-5px"
          left={`${progress}%`}
          transform="translateX(-50%)"
          w="10px"
          h="30px"
          bg={getTargetZoneColor()}
          borderRadius="full"
          border="2px solid white"
          boxShadow="0 2px 8px rgba(0,0,0,0.3)"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        />
      </Box>

      {/* 타이밍 정보 */}
      <VStack spacing={2}>
        <Badge
          colorScheme={progress >= 50 && progress <= 83 ? 'green' : 'red'}
          fontSize="md"
          px={3}
          py={1}
          borderRadius="full"
        >
          {progress >= 50 && progress <= 83 ? '🎯 완벽 존!' : '⚡ 타이밍을 노려보세요!'}
        </Badge>
        
        <Text fontSize="sm" color="gray.600">
          남은 시간: {(timeLeft / 1000).toFixed(1)}초
        </Text>
      </VStack>

      {/* 스톱 버튼 */}
      <MotionButton
        size="xl"
        colorScheme={progress >= 50 && progress <= 83 ? 'green' : 'orange'}
        onClick={handleStop}
        px={10}
        py={6}
        fontSize="xl"
        fontWeight="bold"
        borderRadius="full"
        boxShadow="0 6px 20px rgba(0,0,0,0.2)"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        }}
        _active={{
          transform: 'translateY(0)',
        }}
        animate={{
          scale: progress >= 50 && progress <= 83 ? [1, 1.1, 1] : 1,
          boxShadow: progress >= 50 && progress <= 83 
            ? ['0 6px 20px rgba(0,0,0,0.2)', '0 8px 30px rgba(34, 197, 94, 0.4)', '0 6px 20px rgba(0,0,0,0.2)']
            : '0 6px 20px rgba(0,0,0,0.2)',
        }}
        transition={{
          duration: 0.3,
          repeat: progress >= 50 && progress <= 83 ? Infinity : 0,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⏹️ 스톱!
      </MotionButton>

      {/* 힌트 텍스트 */}
      <Text fontSize="xs" color="gray.500" textAlign="center">
        녹색 영역에서 멈추면 완벽한 타이밍! +15 XP 획득
      </Text>
    </VStack>
  );
};

export default TimingStopButton;