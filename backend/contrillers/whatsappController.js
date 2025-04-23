const { client } = require("../services/whatsappClient");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  const { number, message } = req.body;
  const chatId = number + "@c.us";

  try {
    await client.sendMessage(chatId, message);

    await Message.create({ number, message, status: "sent" });
    res.send({ status: "sent" });
  } catch (err) {
    await Message.create({ number, message, status: "failed" });
    res.status(500).send({ error: err.message });
  }
};

exports.getQr = (req, res) => {
  const { qrCodeString, isReady } = require("../services/whatsappClient");
  res.send({ qr: qrCodeString(), ready: isReady() });
};

exports.getHistory = async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(100);
  res.send(messages);
};
exports.getMessage = async (req, res) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return res.status(404).send({ error: "Message not found" });
  }
  res.send(message);
};
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  const message = await Message.findByIdAndDelete(id);
  if (!message) {
    return res.status(404).send({ error: "Message not found" });
  }
  res.send({ message: "Message deleted successfully" });
};
exports.updateMessage = async (req, res) => {
  const { id } = req.params;
  const { number, message } = req.body;
  const updatedMessage = await Message.findByIdAndUpdate(
    id,
    { number, message },
    { new: true }
  );
  if (!updatedMessage) {
    return res.status(404).send({ error: "Message not found" });
  }
  res.send(updatedMessage);
};
exports.getMessages = async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 });
  res.send(messages);
};
exports.getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ name: 1 });
  res.send(contacts);
};
exports.getContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    return res.status(404).send({ error: "Contact not found" });
  }
  res.send(contact);
};
exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    return res.status(404).send({ error: "Contact not found" });
  }
  res.send({ message: "Contact deleted successfully" });
};
exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { name, number },
    { new: true }
  );
  if (!updatedContact) {
    return res.status(404).send({ error: "Contact not found" });
  }
  res.send(updatedContact);
};
exports.createContact = async (req, res) => {
  const { name, number } = req.body;
  const contact = new Contact({ name, number });
  await contact.save();
  res.send(contact);
};
exports.createMessage = async (req, res) => {
  const { number, message } = req.body;
  const newMessage = new Message({ number, message });
  await newMessage.save();
  res.send(newMessage);
};
exports.getMessagesByNumber = async (req, res) => {
  const { number } = req.params;
  const messages = await Message.find({ number }).sort({ timestamp: -1 });
  res.send(messages);
};
exports.getMessagesByDate = async (req, res) => {
  const { date } = req.params;
  const messages = await Message.find({ date }).sort({ timestamp: -1 });
  res.send(messages);
};
exports.getMessagesByStatus = async (req, res) => {
  const { status } = req.params;
  const messages = await Message.find({ status }).sort({ timestamp: -1 });
  res.send(messages);
};
exports.getMessagesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.params;
  const messages = await Message.find({
    timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) },
  }).sort({ timestamp: -1 });
  res.send(messages);
};
exports.getMessagesByNumberAndDate = async (req, res) => {
  const { number, date } = req.params;
  const messages = await Message.find({ number, date }).sort({ timestamp: -1 });
  res.send(messages);
};
exports.getMessagesByNumberAndStatus = async (req, res) => {
  const { number, status } = req.params;
  const messages = await Message.find({ number, status }).sort({
    timestamp: -1,
  });
  res.send(messages);
};
exports.getMessagesByDateAndStatus = async (req, res) => {
  const { date, status } = req.params;
  const messages = await Message.find({ date, status }).sort({ timestamp: -1 });
  res.send(messages);
};
