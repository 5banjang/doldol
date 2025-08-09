import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useApp } from '../../context/AppContext';
import type { Item } from '../../types';
import { sanitizeFileName } from '../../utils/sanitization';

interface SaveFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
}

const SaveFavoriteModal: React.FC<SaveFavoriteModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addFavorite, state } = useApp();
  const toast = useToast();

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  const validateName = (value: string): string => {
    if (!value.trim()) {
      return '이름을 입력해주세요';
    }
    
    if (value.trim().length > 20) {
      return '이름은 20자를 넘을 수 없습니다';
    }

    const exists = state.favorites.some(
      (fav) => fav.name.toLowerCase() === value.trim().toLowerCase()
    );
    if (exists) {
      return '이미 같은 이름의 즐겨찾기가 있습니다';
    }

    return '';
  };

  const handleSave = async () => {
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (items.length === 0) {
      setError('저장할 항목이 없습니다');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const sanitizedName = sanitizeFileName(name);
      addFavorite(sanitizedName, items);
      
      toast({
        title: '즐겨찾기가 저장되었습니다',
        description: `"${name.trim()}" (${items.length}개 항목)`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      handleClose();
    } catch (err) {
      setError('저장 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    if (error) {
      const validationError = validateName(value);
      setError(validationError);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#FF6B6B">즐겨찾기 저장</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack gap={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              현재 {items.length}개 항목을 즐겨찾기로 저장합니다.
            </Text>
            
            <FormControl isInvalid={!!error}>
              <FormLabel>즐겨찾기 이름</FormLabel>
              <Input
                placeholder="예: 점심 메뉴, 주말 활동..."
                value={name}
                onChange={handleNameChange}
                maxLength={20}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>

            {items.length > 0 && (
              <VStack align="stretch" gap={1}>
                <Text fontSize="sm" fontWeight="medium">
                  저장될 항목:
                </Text>
                <VStack align="stretch" gap={1} maxH="120px" overflowY="auto">
                  {items.slice(0, 5).map((item, index) => (
                    <Text
                      key={item.id}
                      fontSize="xs"
                      color="gray.600"
                      pl={2}
                      borderLeft="2px solid #4ECDC4"
                    >
                      {index + 1}. {item.text}
                    </Text>
                  ))}
                  {items.length > 5 && (
                    <Text fontSize="xs" color="gray.500" pl={2}>
                      ... 외 {items.length - 5}개
                    </Text>
                  )}
                </VStack>
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            취소
          </Button>
          <Button
            colorScheme="red"
            onClick={handleSave}
            isLoading={isLoading}
            isDisabled={!name.trim() || !!error || items.length === 0}
          >
            저장
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveFavoriteModal;