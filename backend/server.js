const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require("qrcode");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let qrImage = "";
let ready = false;
let history = [];

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    qrImage = url;
    ready = false;
  });
});

client.on("ready", () => {
  console.log("WhatsApp is ready!");
  ready = true;
});

client.on("disconnected", () => {
  ready = false;
});

client.initialize();

app.get("/qr", (req, res) => {
  res.send({ qr: qrImage, ready });
});

app.post("/send", async (req, res) => {
  const { number, message } = req.body;
  const chatId = number + "@c.us";

  try {
    await client.sendMessage(chatId, message);
    const now = new Date().toLocaleString();
    history.push({ number, message, time: now });

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get("/history", (req, res) => {
  res.send(history);
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
