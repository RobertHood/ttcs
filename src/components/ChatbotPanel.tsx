import { Box, TextField, IconButton, Avatar, Typography, Paper, List, ListItem } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useState } from 'react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function ChatbotPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your English practice assistant. What would you like to talk about today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput: string) => {
    const inputLower = userInput.toLowerCase();
    if (inputLower.includes('hello') || inputLower.includes('hi')) {
      return 'Hi there! How are you doing today?';
    } else if (inputLower.includes('how are you')) {
      return "I'm just a bot, but I'm functioning well! How about you?";
    } else if (inputLower.includes('weather')) {
      return 'The weather is a great topic! Do you prefer sunny or rainy days?';
    } else {
      return "That's interesting! Can you tell me more about that?";
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Practice Conversation
      </Typography>
      <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
        <List sx={{ width: '100%' }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                px: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 1,
                  maxWidth: '80%',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32,
                  }}
                >
                  {message.sender === 'user' ? 'U' : 'AI'}
                </Avatar>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius:
                      message.sender === 'user'
                        ? '18px 18px 0 18px'
                        : '18px 18px 18px 0',
                  }}
                >
                  <Typography>{message.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'right',
                      color: message.sender === 'user' ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={input.trim() === ''}
          sx={{ height: 56, width: 56 }}
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
}