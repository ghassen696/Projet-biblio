import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { keyframes } from '@mui/system';

// Smooth fade-in animation for the dialog box
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// DialogFlowChatbot component (unchanged)
const DialogFlowChatbot: React.FC = () => (
  <div>
    <df-messenger
      intent="WELCOME"
      chat-title="biblio_agent"
      agent-id="50953824-fdc7-4f95-bb00-dfd1b1ce0aa5"
      language-code="fr"
    />
  </div>
);

export function ChatbotComponent() {
  // State to control the opening of the dialog
  const [chatOpen, setChatOpen] = useState(false);

  // Open the chatbot dialog
  const handleChatbotClick = () => {
    setChatOpen(true);
  };

  // Close the chatbot dialog
  const handleClose = () => {
    setChatOpen(false);
  };

  return (
    <>
      {/* Floating chatbot button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={handleChatbotClick}
          aria-label="Open Chatbot"
          sx={{
            background: 'linear-gradient(45deg, #FF6F61, #FF8A00, #FFD700)',
            color: 'white',
            borderRadius: '50%',
            boxShadow: 2,
            animation: 'backgroundAnimation 6s ease infinite',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            padding: 1.5,
            width: 60,
            height: 60,
          }}
        >
          {/* Avatar or icon for the chatbot */}
          <img
            src="assets/images/avatar/avatar-1.webp"
            alt="Chatbot Avatar"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </IconButton>
      </Box>

      {/* Chatbot dialog box with fade-in animation */}
      <Dialog
        open={chatOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          animation: `${fadeIn} 0.5s ease-out`,
        }}
      >
        <DialogContent dividers>
          <DialogFlowChatbot />
        </DialogContent>
      </Dialog>
    </>
  );
}