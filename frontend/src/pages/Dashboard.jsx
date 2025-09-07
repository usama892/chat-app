import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../actions/authActions';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

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
let username=localStorage.getItem('username')
console.log(users);
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{`Welcome ${username}`}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="users-list">
        <h3>Users:</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <span>{user.username}</span>
              <Link to={`/chat/${user._id}`}>Chat</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
