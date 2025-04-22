const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require("qrcode");
const app = express();
const port = 3001;

const cors = require("cors");
app.use(cors());

let qrCodeString = "";
let isReady = false;

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

app.use(express.json());

app.get("/qr", (req, res) => {
  res.send({ qr: qrCodeString, ready: isReady });
});

app.post("/send", async (req, res) => {
  const { number, message } = req.body;
  const chatId = number + "@c.us";
  client.sendMessage(chatId, message);
  res.send({ status: "Message sent" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
