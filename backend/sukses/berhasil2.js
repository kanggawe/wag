const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require("qrcode");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let qrCodeString = "";
let isReady = false;

// ⬇️ Di sini kita simpan semua riwayat pesan yang dikirim
const history = [];

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    qrCodeString = url;
  });
});

client.on("ready", () => {
  isReady = true;
  console.log("Client is ready!");
});

client.initialize();

// Endpoint untuk ambil QR code dan status
app.get("/qr", (req, res) => {
  res.send({ qr: qrCodeString, ready: isReady });
});

// Endpoint untuk kirim pesan dan simpan riwayat
app.post("/send", async (req, res) => {
  const { number, message } = req.body;
  const chatId = number + "@c.us";

  try {
    await client.sendMessage(chatId, message);

    // Simpan ke riwayat
    const time = new Date().toLocaleString();
    history.push({ number, message, time });

    res.send({ status: "Message sent" });
  } catch (error) {
    res
      .status(500)
      .send({ status: "Error sending message", error: error.message });
  }
});

// Endpoint untuk ambil riwayat
app.get("/history", (req, res) => {
  res.send(history);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
