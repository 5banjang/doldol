import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { useGameSettings } from '../../context/GameSettingsContext';
import type { GameSettings } from '../../types';

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, setDifficulty, setAnimation, setHaptics, setSounds } = useGameSettings();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>
          <HStack>
            <Text>⚙️ 게임 설정</Text>
            <Badge colorScheme="blue" variant="subtle">
              v1.0
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            
            {/* 난이도 설정 */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <Text>🎯 게임 난이도</Text>
                </HStack>
              </FormLabel>
              <Select 
                value={settings.difficulty} 
                onChange={(e) => setDifficulty(e.target.value as GameSettings['difficulty'])}
              >
                <option value="auto">자동 (연속 성공에 따라 조정)</option>
                <option value="easy">쉬움 (타이밍 존 20%)</option>
                <option value="normal">보통 (타이밍 존 10%)</option>
                <option value="hard">어려움 (타이밍 존 6%)</option>
                <option value="expert">전문가 (타이밍 존 4%)</option>
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {settings.difficulty === 'auto' ? 
                  '실력에 맞춰 자동으로 난이도가 조정됩니다' :
                  `고정 난이도로 플레이합니다`
                }
              </Text>
            </FormControl>

            <Divider />

            {/* 애니메이션 설정 */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <Text>✨ 애니메이션 효과</Text>
                </HStack>
              </FormLabel>
              <Select 
                value={settings.animation} 
                onChange={(e) => setAnimation(e.target.value as GameSettings['animation'])}
              >
                <option value="full">전체 (모든 효과)</option>
                <option value="reduced">축소 (부드러운 효과)</option>
                <option value="minimal">최소 (성능 우선)</option>
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {settings.animation === 'full' ? 
                  '모든 애니메이션과 색종이 효과' :
                  settings.animation === 'reduced' ?
                  '절제된 애니메이션 (현재 적용됨)' :
                  '최소한의 애니메이션으로 성능 최적화'
                }
              </Text>
            </FormControl>

            <Divider />

            {/* 햅틱 피드백 */}
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb="0">
                <HStack>
                  <Text>📳 햅틱 피드백 (진동)</Text>
                  {typeof navigator.vibrate === 'undefined' && (
                    <Badge colorScheme="gray" size="sm">지원 안함</Badge>
                  )}
                </HStack>
              </FormLabel>
              <Switch 
                isChecked={settings.haptics} 
                onChange={(e) => setHaptics(e.target.checked)}
                isDisabled={typeof navigator.vibrate === 'undefined'}
              />
            </FormControl>
            <Text fontSize="xs" color="gray.500" mt={-4}>
              {typeof navigator.vibrate !== 'undefined' ? 
                '게임 결과에 따라 진동으로 피드백을 제공합니다' :
                '현재 브라우저에서는 햅틱 피드백을 지원하지 않습니다'
              }
            </Text>

            <Divider />

            {/* 사운드 효과 */}
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb="0">
                <HStack>
                  <Text>🔊 사운드 효과</Text>
                  <Badge colorScheme="orange" size="sm">준비중</Badge>
                </HStack>
              </FormLabel>
              <Switch 
                isChecked={settings.sounds} 
                onChange={(e) => setSounds(e.target.checked)}
                isDisabled={true}
              />
            </FormControl>
            <Text fontSize="xs" color="gray.500" mt={-4}>
              향후 업데이트에서 추가될 예정입니다
            </Text>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            설정 완료
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameSettingsModal;