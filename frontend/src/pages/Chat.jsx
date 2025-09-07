import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import './Chat.css'; // import CSS file

// Make sure this matches your backend server
const socket = io('http://localhost:5000');

const Chat = () => {
  const { userId: receiverId } = useParams();
  const senderId = localStorage.getItem('myUserId');
  const token = localStorage.getItem('token');

  const [history, setHistory] = useState([]);
  const [liveMessages, setLiveMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!senderId || !receiverId || !token) {
      alert("You are not properly logged in. Please log in again.");
      return;
    }

    socket.emit('joinRoom', { userId: senderId });

    axios
      .get(`http://localhost:5000/api/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setHistory(res.data))
      .catch((err) => console.error('Chat history error:', err.response?.data || err.message));

    socket.on('privateMessage', (msg) => {
      setLiveMessages((prev) => [...prev, msg]);
    });

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

    socket.emit('privateMessage', newMsg);
    setLiveMessages((prev) => [...prev, newMsg]);
    setContent('');
  };

  const allMessages = [...history, ...liveMessages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat with User {receiverId}</h2>

      <div className="chat-box">
        {allMessages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.senderId === senderId ? 'sent' : 'received'}`}>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
