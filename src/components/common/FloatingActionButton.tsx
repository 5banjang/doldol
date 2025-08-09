import React from 'react';
import {
  Button,
  Box,
  Tooltip,
} from '@chakra-ui/react';

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  count: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  disabled,
  count,
}) => {
  const buttonText = disabled 
    ? '항목을 2개 이상 추가해주세요'
    : `뽑으러 가기! (${count}개)`;

  const tooltipText = disabled
    ? '뽑기를 시작하려면 최소 2개의 항목이 필요합니다'
    : `현재 ${count}개 항목으로 뽑기를 시작합니다`;

  return (
    <Box
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
    >
      <Tooltip
        label={tooltipText}
        placement="top"
        hasArrow
        isDisabled={!disabled}
      >
        <Button
          size="lg"
          colorScheme="red"
          onClick={onClick}
          disabled={disabled}
          px={8}
          py={6}
          fontSize="lg"
          fontWeight="bold"
          borderRadius="full"
          boxShadow={disabled 
            ? "0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 8px 20px rgba(255, 107, 107, 0.4)"
          }
          _hover={disabled ? {} : {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 25px rgba(255, 107, 107, 0.5)',
          }}
          _disabled={{
            bg: 'gray.300',
            color: 'gray.500',
            cursor: 'not-allowed',
            _hover: {
              bg: 'gray.300',
              transform: 'none',
            },
          }}
        >
          {!disabled && '🎯 '}
          {buttonText}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default FloatingActionButton;