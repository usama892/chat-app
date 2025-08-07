const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Message = require('./models/Message'); // ✅ Add this
const authRoutes = require('./routes/authRoutes');
const chatroutes = require('./routes/chatroutes');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"]
  }
});

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', chatroutes);
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('privateMessage', async ({ senderId, receiverId, content }) => {
    const newMessage = new Message({ senderId, receiverId, content });

    try {
      await newMessage.save(); // ✅ Save to MongoDB

      io.to(receiverId).emit('privateMessage', {
        senderId,
        content,
        timestamp: newMessage.timestamp
      });

    } catch (err) {
      console.error('Message save error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
