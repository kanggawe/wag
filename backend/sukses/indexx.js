const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const qrcode = require("qrcode");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://wagger:KGdat0091@cluster0.jblsag6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error", err));

const MessageSchema = new mongoose.Schema({
  number: String,
  message: String,
  time: String,
});

const Message = mongoose.model("Message", MessageSchema);

let qrImage = "";
let ready = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ["--no-sandbox"] },
});

client.on("qr", (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    qrImage = url;
    ready = false;
  });
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
  ready = true;
});

client.initialize();

app.get("/qr", (req, res) => {
  res.send({ qr: qrImage, ready });
});

app.post("/send", async (req, res) => {
  const { numbers, message } = req.body;

  try {
    const promises = numbers.map(async (number) => {
      const chatId = number + "@c.us";
      await client.sendMessage(chatId, message);

      const msg = new Message({
        number,
        message,
        time: new Date().toLocaleString(),
      });
      await msg.save();
    });

    await Promise.all(promises);
    res.send({ success: true, message: "Pesan dikirim ke semua nomor." });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get("/history", async (req, res) => {
  const history = await Message.find().sort({ _id: -1 }).limit(100);
  res.send(history);
});

app.listen(port, () => {
  console.log(`Backend jalan di http://localhost:${port}`);
});
