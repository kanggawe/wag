const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  number: String,
  message: String,
  status: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
