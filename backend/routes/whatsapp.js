const express = require("express");
const router = express.Router();
const { sendMessage, getQr } = require("../controllers/whatsappController");

router.post("/send", sendMessage);
router.get("/qr", getQr);

module.exports = router;
