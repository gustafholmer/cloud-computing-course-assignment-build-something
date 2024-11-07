// chatService.ts
import { saveMessage, getUserIdByUsername } from './memoryService';

export const generateBotResponse = async (username: string, userMessage: string) => {
  // Retrieve or create user ID
  const userId = await getUserIdByUsername(username);

  // Simple rule-based bot response
  let botMessage;
  if (userMessage.toLowerCase().includes('hello')) {
    botMessage = "Hello! How can I assist you today?";
  } else if (userMessage.toLowerCase().includes('bye')) {
    botMessage = "Goodbye! Have a great day!";
  } else {
    botMessage = "I'm here to help you. Ask me anything!";
  }

  // Save messages to memory
  await saveMessage(userId, userMessage, 'user');
  await saveMessage(userId, botMessage, 'bot');

  return botMessage;
};
