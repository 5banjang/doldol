import React from 'react';
import {
  HStack,
  Button,
} from '@chakra-ui/react';
import { RepeatIcon, ArrowBackIcon } from '@chakra-ui/icons';

interface ActionButtonsProps {
  onRetry: () => void;
  onGoHome: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onRetry, onGoHome }) => {
  return (
    <HStack gap={6} mt={8}>
      <Button
        size="lg"
        colorScheme="orange"
        leftIcon={<RepeatIcon />}
        onClick={onRetry}
        px={8}
        py={6}
        borderRadius="full"
      >
        다시 뽑기
      </Button>

      <Button
        size="lg"
        colorScheme="teal"
        variant="outline"
        leftIcon={<ArrowBackIcon />}
        onClick={onGoHome}
        px={8}
        py={6}
        borderRadius="full"
        borderWidth="2px"
      >
        처음으로
      </Button>
    </HStack>
  );
};

export default ActionButtons;