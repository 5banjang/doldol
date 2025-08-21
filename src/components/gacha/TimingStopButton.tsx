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
import { triggerHapticFeedback } from '../../utils/gameEngine';

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
    
    // 동적 타이밍 존 계산
    const perfectZoneSize = timingGame.targetZoneEnd - timingGame.targetZoneStart;
    const goodZoneBuffer = perfectZoneSize * 0.8; // perfect zone의 80% 크기를 버퍼로 사용
    
    if (currentTime >= timingGame.targetZoneStart && currentTime <= timingGame.targetZoneEnd) {
      accuracy = 'perfect';
    } else if (
      (currentTime >= timingGame.targetZoneStart - goodZoneBuffer && currentTime < timingGame.targetZoneStart) ||
      (currentTime > timingGame.targetZoneEnd && currentTime <= timingGame.targetZoneEnd + goodZoneBuffer)
    ) {
      accuracy = 'good';
    } else {
      accuracy = 'miss';
    }
    
    // 햅틱 피드백 추가
    triggerHapticFeedback(accuracy);
    
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
    <VStack spacing={4} w={{ base: "90vw", md: "400px" }} maxW="90vw">
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
        
        {/* 동적 완벽 타이밍 존 표시 */}
        <Box
          position="absolute"
          top="0"
          left={`${timingGame.targetZonePosition - (timingGame.targetZoneEnd - timingGame.targetZoneStart) / animationDuration * 50}%`}
          width={`${((timingGame.targetZoneEnd - timingGame.targetZoneStart) / animationDuration) * 100}%`}
          height="20px"
          bg={timingGame.difficulty === 'expert' ? 'red.200' : timingGame.difficulty === 'hard' ? 'orange.200' : 'green.200'}
          borderRadius="full"
          border="2px solid"
          borderColor={timingGame.difficulty === 'expert' ? 'red.400' : timingGame.difficulty === 'hard' ? 'orange.400' : 'green.400'}
          opacity={0.8}
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
          colorScheme={
            progress >= (timingGame.targetZoneStart / animationDuration) * 100 && 
            progress <= (timingGame.targetZoneEnd / animationDuration) * 100 ? 'green' : 
            timingGame.difficulty === 'expert' ? 'red' : 
            timingGame.difficulty === 'hard' ? 'orange' : 'yellow'
          }
          fontSize="md"
          px={3}
          py={1}
          borderRadius="full"
        >
          {progress >= (timingGame.targetZoneStart / animationDuration) * 100 && 
           progress <= (timingGame.targetZoneEnd / animationDuration) * 100 ? 
           '🎯 완벽 존!' : 
           `⚡ ${timingGame.difficulty.toUpperCase()} 모드`}
        </Badge>
        
        <Text fontSize="sm" color="gray.600">
          남은 시간: {(timeLeft / 1000).toFixed(1)}초
        </Text>
      </VStack>

      {/* 스톱 버튼 */}
      <MotionButton
        size={{ base: "lg", md: "xl" }}
        colorScheme={progress >= 50 && progress <= 83 ? 'green' : 'orange'}
        onClick={handleStop}
        px={{ base: 8, md: 10 }}
        py={{ base: 4, md: 6 }}
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        borderRadius="full"
        boxShadow="0 6px 20px rgba(0,0,0,0.2)"
        minH={{ base: "60px", md: "auto" }}
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
        {timingGame.difficulty === 'expert' ? '🔥 전문가 모드: +50 XP' :
         timingGame.difficulty === 'hard' ? '💪 어려움 모드: +37 XP' :
         timingGame.difficulty === 'normal' ? '⚡ 보통 모드: +30 XP' :
         '🌟 쉬움 모드: +25 XP'}
      </Text>
    </VStack>
  );
};

export default TimingStopButton;