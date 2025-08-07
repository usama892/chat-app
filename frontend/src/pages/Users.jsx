// File: src/pages/Users.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../actions/chatActions';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../actions/authActions';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.chat.users);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>All Users</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {users.map((user) => (
        <div key={user._id}>
          <button onClick={() => navigate(`/chat/${user._id}`)}>
            {user.username}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Users;
