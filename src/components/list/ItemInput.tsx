import React, { useState } from 'react';
import {
  HStack,
  Input,
  Button,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, StarIcon } from '@chakra-ui/icons';
import { useApp } from '../../context/AppContext';
import { sanitizeWithLength } from '../../utils/sanitization';

interface ItemInputProps {
  onSave: () => void;
}

const ItemInput: React.FC<ItemInputProps> = ({ onSave }) => {
  const [inputValue, setInputValue] = useState('');
  const { addItem, clearItems, state } = useApp();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddItem();
  };

  const handleAddItem = () => {
    const sanitized = sanitizeWithLength(inputValue, 100);
    if (sanitized) {
      addItem(sanitized);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleSave = () => {
    if (state.currentItems.length === 0) {
      toast({
        title: '저장할 항목이 없습니다',
        description: '항목을 먼저 추가해주세요.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    onSave();
  };

  const handleClear = () => {
    clearItems();
    toast({
      title: '모든 항목이 삭제되었습니다',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <HStack spacing={2}>
          <Input
            placeholder="항목을 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            bg="white"
            focusBorderColor="#FF6B6B"
          />
          <Button
            colorScheme="red"
            leftIcon={<AddIcon />}
            onClick={handleAddItem}
            isDisabled={!inputValue.trim()}
          >
            추가
          </Button>
        </HStack>
      </form>

      <HStack spacing={2} justify="flex-end">
        <Tooltip label="현재 목록을 즐겨찾기로 저장">
          <IconButton
            aria-label="즐겨찾기 저장"
            icon={<StarIcon />}
            colorScheme="yellow"
            variant="outline"
            onClick={handleSave}
            isDisabled={state.currentItems.length === 0}
          />
        </Tooltip>
        
        <Button
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={handleClear}
          isDisabled={state.currentItems.length === 0}
        >
          전체 삭제
        </Button>
      </HStack>
    </>
  );
};

export default ItemInput;