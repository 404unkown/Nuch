import express from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/get-chat-id", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Bot token is required" });
  }

  try {
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    const tgRes = await fetch(url);
    const data = await tgRes.json();

    if (!data.ok) {
      return res.status(400).json({ error: "Invalid bot token" });
    }

    const chats = [];

    for (const update of data.result) {
      if (update.message) {
        const chat = update.message.chat;
        chats.push({
          id: chat.id,
          type: chat.type,
          name: chat.title || chat.first_name || "Unknown"
        });
      }
    }

    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat IDs" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});