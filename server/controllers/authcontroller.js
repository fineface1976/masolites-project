const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create user
    const user = new User({ email, password: await bcrypt.hash(password, 10) });
    await user.save();
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({ token, memberId: user.memberId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User authentication
exports.authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token, memberId: user.memberId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
