import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Text,
} from '@chakra-ui/react';
import type { Item, TimingGame, GachaGameMode, GameStats, Achievement } from '../types';
import GachaAnimation from '../components/gacha/GachaAnimation';
import GachaStartButton from '../components/gacha/GachaStartButton';
import TimingStopButton from '../components/gacha/TimingStopButton';
import ResultDisplay from '../components/gacha/ResultDisplay';
import ActionButtons from '../components/gacha/ActionButtons';
import AchievementNotification from '../components/gacha/AchievementNotification';
import { selectRandomItem } from '../utils/helpers';
import { loadGameStats, saveGameStats, updateGachaStats } from '../utils/gameStats';

interface LocationState {
  items: Item[];
}

const GachaPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 게임 상태
  const [gameMode, setGameMode] = useState<GachaGameMode>('ready');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timingAccuracy, setTimingAccuracy] = useState<'perfect' | 'good' | 'miss'>('miss');
  const [xpGained, setXpGained] = useState(0);
  
  // 타이밍 게임 상태
  const [timingGame, setTimingGame] = useState<TimingGame>({
    isActive: false,
    startTime: 0,
    targetZoneStart: 1500, // 1.5초
    targetZoneEnd: 2500,   // 2.5초
  });
  
  // 게임 통계 및 업적
  const [gameStats, setGameStats] = useState<GameStats>(loadGameStats());
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number>();

  const bgColor = '#F7F7F7';
  
  const locationState = location.state as LocationState;
  const items = locationState?.items || [];

  // 항목이 없으면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (items.length < 2) {
      navigate('/');
      return;
    }
  }, [items.length, navigate]);

  // 수동 가챠 시작
  const handleStartGacha = () => {
    setGameMode('animating');
    setShowResult(false);
    setSelectedItem(null);
    
    // 타이밍 게임 초기화 및 시작
    const startTime = Date.now();
    setTimingGame({
      isActive: true,
      startTime,
      targetZoneStart: 1500,
      targetZoneEnd: 2500,
    });
    
    setTimeout(() => {
      setGameMode('timing');
    }, 500); // 애니메이션이 시작된 후 타이밍 게임 활성화
  };

  // 타이밍 스톱 처리
  const handleTimingStop = (accuracy: 'perfect' | 'good' | 'miss') => {
    setTimingAccuracy(accuracy);
    setTimingGame(prev => ({ ...prev, isActive: false }));
    setGameMode('result');

    // 결과 선택
    const result = selectRandomItem(items);
    setSelectedItem(result);

    // 게임 통계 업데이트
    const { newStats, leveledUp: didLevelUp, newAchievements: earnedAchievements } = 
      updateGachaStats(gameStats, accuracy);
    
    setGameStats(newStats);
    saveGameStats(newStats);
    
    // XP 계산
    let earnedXP = 10; // 기본 XP
    if (accuracy === 'perfect') earnedXP += 15;
    else if (accuracy === 'good') earnedXP += 5;
    
    setXpGained(earnedXP);
    setNewAchievements(earnedAchievements);
    setLeveledUp(didLevelUp);
    setNewLevel(didLevelUp ? newStats.level : undefined);

    // 결과 표시
    setTimeout(() => {
      setShowResult(true);
    }, 1000);
  };

  // 재시도
  const handleRetry = () => {
    setGameMode('ready');
    setShowResult(false);
    setSelectedItem(null);
    setTimingAccuracy('miss');
    setXpGained(0);
    setNewAchievements([]);
    setLeveledUp(false);
    setNewLevel(undefined);
  };

  // 홈으로
  const handleGoHome = () => {
    navigate('/');
  };

  // 업적 알림 완료 처리
  const handleAchievementComplete = () => {
    setNewAchievements([]);
    setLeveledUp(false);
    setNewLevel(undefined);
  };

  if (items.length < 2) {
    return null; // 리다이렉트 중
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8} position="relative">
      <Container maxW="4xl" h="90vh">
        <VStack spacing={8} align="center" justify="center" h="full">
          
          {/* Ready Mode - 시작 버튼 */}
          {gameMode === 'ready' && (
            <GachaStartButton
              onStart={handleStartGacha}
              gameStats={gameStats}
              itemCount={items.length}
            />
          )}

          {/* Animating Mode - 애니메이션 */}
          {gameMode === 'animating' && (
            <>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#FF6B6B"
                textAlign="center"
              >
                🎯 가챠 애니메이션 시작!
              </Text>
              <GachaAnimation items={items} />
            </>
          )}

          {/* Timing Mode - 타이밍 게임 */}
          {gameMode === 'timing' && (
            <>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="#FF6B6B"
                textAlign="center"
              >
                ⚡ 지금이야! 타이밍을 맞춰보세요!
              </Text>
              <GachaAnimation items={items} />
              <TimingStopButton
                timingGame={timingGame}
                onStop={handleTimingStop}
                animationDuration={3000}
              />
            </>
          )}

          {/* Result Mode - 결과 표시 */}
          {gameMode === 'result' && (
            <>
              {selectedItem && (
                <ResultDisplay 
                  item={selectedItem} 
                  showResult={showResult}
                  timingAccuracy={timingAccuracy}
                  xpGained={xpGained}
                />
              )}
              
              {showResult && (
                <ActionButtons
                  onRetry={handleRetry}
                  onGoHome={handleGoHome}
                />
              )}
            </>
          )}
        </VStack>
      </Container>

      {/* 업적 및 레벨업 알림 */}
      <AchievementNotification
        newAchievements={newAchievements}
        leveledUp={leveledUp}
        newLevel={newLevel}
        onComplete={handleAchievementComplete}
      />
    </Box>
  );
};

export default GachaPage;