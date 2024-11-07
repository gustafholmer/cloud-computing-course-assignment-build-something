import React, { useState } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: string; // Optional, if you want to display timestamps
}

interface BackendMessage {
  message_text: string;
  sender: "user" | "bot";
  timestamp: string; // Adjust to 'Date' if your backend returns a Date object instead of a string
}

const Chat: React.FC = () => {
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const apiBaseURL = "http://localhost:30081";

  const fetchLatestConversation = async () => {
    try {
      const response = await axios.post(`${apiBaseURL}/api/startChat`, { username });
      const formattedMessages = response.data.history.map((msg: BackendMessage) => ({
        text: msg.message_text,
        sender: msg.sender,
        timestamp: msg.timestamp,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching conversation history:", error);
    }
  };

  // Handle setting the username
  const handleSetUsername = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
      fetchLatestConversation(); // Fetch conversation once username is set
    }
  };

  // Handle user input submission
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(`${apiBaseURL}/api/sendMessage`, {
        username,
        message: input,
      });
      const botMessage: Message = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, I'm having trouble right now." },
      ]);
    }
  };

  if (!isUsernameSet) {
    // Render the username input screen
    return (
      <div style={styles.usernameContainer}>
        <h2>Enter your username to start chatting</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={styles.input}
        />
        <button onClick={handleSetUsername} style={styles.button}>
          Start Chat
        </button>
      </div>
    );
  }

  console.log("Messages:", messages);

  // Render the chat interface
  return (
    <div className="chat-container" style={styles.chatContainer}>
      <div className="messages" style={styles.messages}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <span
              style={{
                ...styles.bubble,
                backgroundColor: message.sender === "user" ? "#DCF8C6" : "#FFF",
              }}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="input-container" style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column" as const,
    width: "400px",
    height: "500px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
  },
  usernameContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100px",
    padding: "20px",
    textAlign: "center" as const,
  },
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    marginBottom: "10px",
  },
  message: {
    display: "flex",
    padding: "5px",
    margin: "5px 0",
  },
  bubble: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    marginTop: "10px",
    width: "100%", // Ensures input is full-width in usernameContainer
    maxWidth: "300px", // Limits input width to keep it visually balanced
  },
  button: {
    padding: "10px 15px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px", // Adds space between input and button
    maxWidth: "150px", // Limits button width to keep it visually balanced
    width: "100%",
  },
};

export default Chat;
