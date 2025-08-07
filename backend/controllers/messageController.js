const mongoose = require('mongoose');
const Message = require('../models/Message');

const getChatMessages = async (req, res) => {
  try {
    const currentUserId = mongoose.Types.ObjectId.createFromHexString(req.user._id.toString());
    const otherUserId = mongoose.Types.ObjectId.createFromHexString(req.params.userId.toString());

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Get chat messages error:', err.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { getChatMessages };
