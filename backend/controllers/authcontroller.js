const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: 'Username already exists' });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
  token,
  user: {
    _id: user._id,
    username: user.username,
  },
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dashboard = async (req, res) => {
  res.status(200).json({ message: `Welcome User` });
};
exports.getAllUsersExceptMe = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },  // exclude current user
    }).select('-password'); // exclude password

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



