// =======================
// Imports
// =======================
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import os from "os";
import bonjour from "bonjour";
import "dotenv/config";


// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// =======================
// Message Schema
// =======================
const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 9000 },
  user: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});
MessageSchema.index({ createdAt: 1 });
const Message = mongoose.model("Message", MessageSchema);

// =======================
// Counter Schema for user numbering
// =======================
const CounterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", CounterSchema);

// Get next user number
async function getNextUserNumber() {
  const result = await Counter.findOneAndUpdate(
    { key: "userCount" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return result.value;
}

// =======================
// Express Setup
// =======================
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Serve chat.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/chat.html"));
});

// Delete all messages from DB
app.post("/delete-chat", async (req, res) => {
  try {
    await Message.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete chat error:", err.message);
    res.status(500).json({ success: false });
  }
});

// =======================
// Socket.io Setup
// =======================
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// =======================
// OpenRouter API Config
// =======================
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = process.env.OPENROUTER_URL;

async function getAIResponse(messages) {
  try {
    const formattedMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4-fast:free",
        messages: formattedMessages,
        max_tokens: 9000,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.6,
      }),
    });

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "🤖 Sorry, I couldn't respond.";
  } catch (err) {
    console.error("❌ OpenRouter API error:", err.message);
    return "🤖 Sorry, the AI is temporarily unreachable. Please try again later.";
  }
}

// =======================
// Socket.io Events
// =======================
io.on("connection", async (socket) => {
  // Assign persistent username
  const userNumber = await getNextUserNumber();
  const username = `user${userNumber}`;
  console.log(`✅ ${username} connected: ${socket.id}`);
  socket.emit("assignUsername", username);

  // Session memory for this socket
  let chatMemory = [];

  // Send last 20 messages from DB
  const msgs = await Message.find().sort({ createdAt: -1 }).limit(20);
  socket.emit("chatHistory", msgs.reverse());

  socket.on("sendMessage", async (msg) => {
    try {
      const safeMsg = {
        text: msg.text.toString().slice(0, 9000),
        user: msg.user,
        createdAt: new Date(),
      };

      const newMsg = new Message(safeMsg);
      await newMsg.save();
      io.emit("receiveMessage", newMsg);

      // Add user message to session memory
      chatMemory.push({ role: "user", content: msg.text });

      // AI response only if user is not AI
      if (!msg.user.name.toLowerCase().includes("ai")) {
        // Emit typing indicator as AI Agent
        socket.emit("aiTyping", { status: true, name: "AI Agent" });

        // Send full conversation memory to AI
        const aiText = await getAIResponse(chatMemory);

        // Stop typing indicator
        socket.emit("aiTyping", { status: false, name: "AI Agent" });

        // Save AI message with generic AI Agent name
        const aiMsg = new Message({
          text: aiText,
          user: { _id: "ai-bot", name: "AI Agent" },
        });

        await aiMsg.save();
        io.emit("receiveMessage", aiMsg);

        // Add AI response to memory
        chatMemory.push({ role: "assistant", content: aiText });
      }

    } catch (err) {
      console.error("❌ Error handling message:", err.message);
    }
  });

  // Clear memory when New Chat button is clicked
  socket.on("newChat", () => {
    chatMemory = [];
    socket.emit("clearChat");
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${username} disconnected: ${socket.id}`);
  });
});

// =======================
// Start Server
// =======================


function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const IP_ADDRESS = getLocalIP();
console.log(`Local IP Address: ${IP_ADDRESS}`);


const PORT = process.env.PORT;
server.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server running on port ${PORT}`);

  const service = bonjour().publish({ name: 'MyChatServer', type: 'http', port: PORT });
  console.log(`Access the server at http://${IP_ADDRESS}:${PORT}`);
});
