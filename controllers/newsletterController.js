const Newsletter = require('../models/NewsletterModel');
// 👉 Public: User subscribes
exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address" });
  }

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "You are already subscribed." });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: "Subscribed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 👉 Admin: Get all subscribers
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({ success: true, subscribers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 👉 Admin: Delete a subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Subscriber deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
