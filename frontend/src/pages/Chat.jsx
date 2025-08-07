import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

// Make sure this matches your backend server
const socket = io('http://localhost:5000');

const Chat = () => {
  const { userId: receiverId } = useParams(); // ID of the user you're chatting with
  const senderId = localStorage.getItem('myUserId'); // logged-in user's ID
  const token = localStorage.getItem('token'); // JWT token
console.log(senderId);
  const [history, setHistory] = useState([]); // messages from DB
  const [liveMessages, setLiveMessages] = useState([]); // real-time messages
  const [content, setContent] = useState('');

  // Load previous messages and setup socket
  useEffect(() => {
    if (!senderId || !receiverId || !token) {
      alert("You are not properly logged in. Please log in again.");
      return;
    }

    // Join sender's private room
    socket.emit('joinRoom', { userId: senderId });

    // Fetch message history
    axios
      .get(`http://localhost:5000/api/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setHistory(res.data))
      .catch((err) => console.error('Chat history error:', err.response?.data || err.message));

    // Listen for new incoming messages
    socket.on('privateMessage', (msg) => {
      setLiveMessages((prev) => [...prev, msg]);
    });

    // Cleanup
    return () => {
      socket.off('privateMessage');
    };
  }, [receiverId, senderId, token]);

  const sendMessage = () => {
    if (!content.trim()) return;

    const newMsg = {
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString()
    };

    // Emit message to receiver
    socket.emit('privateMessage', newMsg);

    // Add to local messages
    setLiveMessages((prev) => [...prev, newMsg]);
    setContent('');
  };

  const allMessages = [...history, ...liveMessages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div>
      <h2>Chat with User {receiverId}</h2>

      <div
        style={{
          border: '1px solid #ccc',
          height: '300px',
          padding: '10px',
          overflowY: 'scroll',
          marginBottom: '10px'
        }}
      >
        {allMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.senderId === senderId ? 'right' : 'left',
              margin: '5px 0'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: msg.senderId === senderId ? '#dcf8c6' : '#f1f0f0',
                padding: '8px 12px',
                borderRadius: '20px',
                maxWidth: '60%',
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        style={{ padding: '8px', width: '75%' }}
      />
      <button onClick={sendMessage} style={{ padding: '8px 16px', marginLeft: '5px' }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
