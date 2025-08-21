import React, { useState } from 'react';
import {
  IconButton,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import GameSettingsModal from './GameSettingsModal';

const SettingsButton: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <Box
        position="fixed"
        top="20px"
        right="20px"
        zIndex={1000}
      >
        <Tooltip
          label="게임 설정"
          placement="left"
          hasArrow
        >
          <IconButton
            aria-label="게임 설정"
            icon={<SettingsIcon />}
            size="lg"
            colorScheme="gray"
            variant="solid"
            borderRadius="full"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
            _hover={{
              transform: 'rotate(90deg)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            }}
            transition="all 0.2s"
            onClick={() => setIsSettingsOpen(true)}
          />
        </Tooltip>
      </Box>

      <GameSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default SettingsButton;