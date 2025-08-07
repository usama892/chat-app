// pages/Home.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('http://localhost:5000/api/users');
      dispatch({ type: 'SET_USERS', payload: res.data });
    };
    fetchUsers();
  }, [dispatch]);

  return (
    <div>
      <h2>Users:</h2>
      {users.map((u) => (
        <div key={u._id}>
          <Link to={`/chat/${u._id}`}>{u.username}</Link>
        </div>
      ))}
    </div>
  );
};

export default Home;