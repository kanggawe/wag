const express = require("express");
const router = express.Router();
const { getHistory } = require("../controllers/whatsappController");

router.get("/", getHistory);

module.exports = router;
