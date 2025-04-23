const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

let qrCodeString = "";
let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    qrCodeString = url;
  });
});

client.on("ready", () => {
  isReady = true;
  console.log("✅ WhatsApp client is ready!");
});

client.initialize();

module.exports = {
  client,
  qrCodeString: () => qrCodeString,
  isReady: () => isReady,
};
