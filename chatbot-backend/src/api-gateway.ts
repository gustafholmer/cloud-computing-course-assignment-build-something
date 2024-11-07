//api-gateway.ts
import express, { Request, Response } from "express";
import { generateBotResponse } from "./services/chatService";
import {
  getConversationHistory,
  getUserIdByUsername,
  getLatestConversationHistory
} from "./services/memoryService";

const router = express.Router();

// Endpoint to fetch latest conversation for the user upon setting the username
router.post("/startChat", async (req: any, res: any) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const userId = await getUserIdByUsername(username);
    if (!userId) {
      return res.status(404).json({ error: "User not found." });
    }

    // Retrieve the latest conversation history
    const history = await getLatestConversationHistory(userId.toString());
    res.json({ history });
  } catch (error) {
    console.error("Error fetching latest conversation:", error);
    res.status(500).json({ error: "Failed to retrieve conversation history." });
  }
});

router.post("/sendMessage", async (req: any, res: any) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res
      .status(400)
      .json({ error: "Username and message are required." });
  }

  const botResponse = await generateBotResponse(username, message);
  res.json({ reply: botResponse });
});

router.get(
  "/conversationHistory/:username",
  async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
      const userId = await getUserIdByUsername(username);
      const history = await getConversationHistory(userId);
      res.json({ history });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to retrieve conversation history." });
    }
  }
);

export default router;
