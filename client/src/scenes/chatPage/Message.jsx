import React from 'react'
import ChatNavbar from '../navbar/ChatNavbar';
import ChatApp from '../../components/ChatApp';
import { Box } from '@mui/material';

export default function ChatPage() {
  
  return (
    <Box>
      <ChatNavbar />
      <ChatApp />
    </Box>
  )
}
