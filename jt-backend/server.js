
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');
const DataCOD = require('./models/DataCOD');
const DataFU = require('./models/DataFU');
const auth = require('./middleware/auth');
const { onlySuperadmin } = require('./middleware/role');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Login gagal' });

  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, token });
});

// CRUD USER (Superadmin only)
app.post('/users', auth, onlySuperadmin, async (req, res) => {
  const { username, password, role } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'User sudah ada' });

  const user = await User.create({ username, password, role });
  res.json(user);
});

app.get('/users', auth, onlySuperadmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

app.put('/users/:id', auth, onlySuperadmin, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/users/:id', auth, onlySuperadmin, async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User dihapus', deleted });
});

// COD
app.post('/chat-cod', auth, async (req, res) => {
  const data = await DataCOD.create(req.body);
  res.json(data);
});

app.get('/chat-cod', auth, async (req, res) => {
  const data = await DataCOD.find().sort({ createdAt: -1 });
  res.json(data);
});

// FU
app.post('/chat-fu', auth, async (req, res) => {
  const data = await DataFU.create(req.body);
  res.json(data);
});

app.get('/chat-fu', auth, async (req, res) => {
  const data = await DataFU.find().sort({ createdAt: -1 });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ready on http://localhost:${PORT}`));
