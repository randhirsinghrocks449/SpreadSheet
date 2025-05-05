import User from '../models/user.model.js';
import { asyncHandler } from '../utils/catchasync.utils.js';
import { generateEncryptedToken } from '../utils/token.utils.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({ username, email, password });
  if (user) {
    return res.status(201).json({ message: 'User registered successfully' });
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateEncryptedToken({ id: user._id });
    return res.status(200).json({ message: 'Login successful', token, user });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
});

export const checkAuth = asyncHandler((req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({ user: req.user });
});
