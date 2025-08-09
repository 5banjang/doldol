import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Achievement } from '../../types';

interface AchievementNotificationProps {
  newAchievements: Achievement[];
  leveledUp: boolean;
  newLevel?: number;
  onComplete: () => void;
}

const MotionBox = motion(Box);
const MotionText = motion(Text);

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  newAchievements,
  leveledUp,
  newLevel,
  onComplete,
}) => {
  const toast = useToast();

  useEffect(() => {
    if (newAchievements.length > 0 || leveledUp) {
      // 업적/레벨업 축하 색종이
      const colors = leveledUp 
        ? ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'] // 골드/레벨업 색상
        : ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3']; // 일반 업적 색상

      // 강력한 색종이 효과
      confetti({
        particleCount: leveledUp ? 150 : 100,
        angle: 90,
        spread: 80,
        origin: { x: 0.5, y: 0.4 },
        colors: colors,
      });

      // 토스트 알림
      if (leveledUp && newLevel) {
        toast({
          title: '🎉 레벨업!',
          description: `레벨 ${newLevel} 달성! 새로운 테마가 해제되었습니다.`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }

      newAchievements.forEach((achievement) => {
        toast({
          title: `🏆 업적 달성: ${achievement.name}`,
          description: `${achievement.description} (+${achievement.xpReward} XP)`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      });

      // 3초 후 자동 완료
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [newAchievements, leveledUp, newLevel, toast, onComplete]);

  if (newAchievements.length === 0 && !leveledUp) {
    return null;
  }

  return (
    <AnimatePresence>
      <MotionBox
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={1000}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <VStack
          spacing={4}
          bg="white"
          p={8}
          borderRadius="2xl"
          boxShadow="0 20px 40px rgba(0,0,0,0.3)"
          border="3px solid #FFD700"
          textAlign="center"
          minW="300px"
        >
          {/* 레벨업 알림 */}
          {leveledUp && newLevel && (
            <MotionBox
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <VStack spacing={2}>
                <MotionText
                  fontSize="3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: 2,
                  }}
                >
                  🎊
                </MotionText>
                <Badge
                  colorScheme="yellow"
                  fontSize="xl"
                  px={6}
                  py={2}
                  borderRadius="full"
                  textTransform="none"
                >
                  레벨 {newLevel} 달성!
                </Badge>
                <Text fontSize="sm" color="gray.600">
                  새로운 테마와 효과가 해제되었습니다!
                </Text>
              </VStack>
            </MotionBox>
          )}

          {/* 업적 알림들 */}
          {newAchievements.map((achievement, index) => (
            <MotionBox
              key={achievement.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: leveledUp ? 0.5 + (index * 0.2) : index * 0.2 }}
            >
              <VStack
                spacing={2}
                p={4}
                bg="purple.50"
                borderRadius="lg"
                border="2px solid"
                borderColor="purple.200"
              >
                <Text fontSize="2xl">{achievement.icon}</Text>
                <Text fontSize="lg" fontWeight="bold" color="purple.700">
                  {achievement.name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {achievement.description}
                </Text>
                <Badge colorScheme="purple" borderRadius="full">
                  +{achievement.xpReward} XP
                </Badge>
              </VStack>
            </MotionBox>
          ))}

          {/* 자동 닫기 안내 */}
          <MotionText
            fontSize="xs"
            color="gray.500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            3초 후 자동으로 닫힙니다...
          </MotionText>
        </VStack>

        {/* 배경 빛나는 효과 */}
        <MotionBox
          position="absolute"
          top="-10px"
          left="-10px"
          right="-10px"
          bottom="-10px"
          borderRadius="3xl"
          bg="linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #FFA500)"
          opacity={0.3}
          zIndex={-1}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </MotionBox>
    </AnimatePresence>
  );
};

export default AchievementNotification;