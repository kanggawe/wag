const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const mongoose = require("mongoose");
const qrcode = require("qrcode");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const cron = require("node-cron");

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://wagger:KGdat0091@cluster0.jblsag6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    number: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  })
);

const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema({
    name: String,
    number: String,
    group: String,
  })
);

const client = new Client({ authStrategy: new LocalAuth() });
let qrCodeString = "";
let isReady = false;

client.on("qr", (qr) => {
  qrcode.toDataURL(qr, (err, url) => (qrCodeString = url));
});
client.on("ready", () => (isReady = true));
client.on("message", async (msg) => {
  if (msg.body.toLowerCase() === "halo") {
    msg.reply("Halo juga! 👋 Ada yang bisa dibantu?");
  }
});
client.initialize();

app.get("/qr", (req, res) => res.send({ qr: qrCodeString, ready: isReady }));

// app.post("/send", async (req, res) => {
//   try {
//     const { number, message } = req.body;
//     const chatId = number + "@c.us";
//     const isRegistered = await client.isRegisteredUser(chatId);

//     if (!isRegistered) {
//       return res
//         .status(400)
//         .json({
//           status: "error",
//           message: "Nomor tidak terdaftar di WhatsApp",
//         });
//     }

//     await client.sendMessage(chatId, message);
//     res.send({ status: "Message sent" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ status: "error", message: "Gagal kirim pesan" });
//   }
// });

app.post("/send", async (req, res) => {
  const { number, message } = req.body;
  const chatId = number + "@c.us";

  try {
    const isRegistered = await client.isRegisteredUser(chatId);

    if (!isRegistered) {
      return res.status(400).json({
        status: "error",
        message: "Nomor tidak terdaftar di WhatsApp!",
      });
    }

    await client.sendMessage(chatId, message);
    res.status(200).json({ status: "success", message: "Pesan terkirim!" });
  } catch (error) {
    console.error("Gagal kirim:", error.message);
    res.status(500).json({
      status: "error",
      message:
        "Gagal mengirim pesan. Pastikan nomor valid dan aktif di WhatsApp.",
    });
  }
});

// app.post("/send", async (req, res) => {
//   const { number, message } = req.body;
//   const chatId = number + "@c.us";
//   await client.sendMessage(chatId, message);
//   await new Message({ number, message }).save();
//   res.send({ status: "sent" });
// });

app.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 });
  res.send(messages);
});

app.post("/contacts", async (req, res) => {
  await new Contact(req.body).save();
  res.send({ success: true });
});
app.get("/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.send(contacts);
});
app.get("/groups", async (req, res) => {
  const groups = await Contact.distinct("group");
  res.send(groups);
});
app.get("/stats", async (req, res) => {
  const total = await Message.countDocuments();
  const top = await Message.aggregate([
    { $group: { _id: "$number", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);
  res.send({ total, top });
});

const upload = multer({ dest: "uploads/" });
app.post("/import-csv", upload.single("file"), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (d) => results.push(d))
    .on("end", async () => {
      await Contact.insertMany(results);
      res.send({ inserted: results.length });
    });
});

cron.schedule("0 8 * * *", async () => {
  const contacts = await Contact.find();
  contacts.forEach((c) => {
    const chatId = c.number + "@c.us";
    client.sendMessage(chatId, "Pengingat harian otomatis dari sistem.");
  });
});

app.listen(port, () =>
  console.log("Server running on http://localhost:" + port)
);
