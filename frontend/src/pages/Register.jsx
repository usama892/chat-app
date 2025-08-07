import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form, navigate));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        name="username"
        onChange={handleChange}
        placeholder="Username"
        value={form.username}
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
        value={form.password}
      />
      <button type="submit">Register</button>
      {loading && <p>Registering...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Register;
