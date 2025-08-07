import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setMessage(res.data.message))
    .catch(() => setMessage('Access denied'));

    axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setUsers(res.data))
    .catch((err) => console.error(err));
  }, [token]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div>
      <h2>{message}</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3> Users:</h3>
      <ul>
        {users.map((user) => (
  <li key={user._id}>
    {user.username} - Age: {user.age}
    <Link to={`/chat/${user._id}`}>Chat</Link>
  </li>
))}
      </ul>
    </div>
  );
};

export default Dashboard;
