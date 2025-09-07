import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { loginUser } from "../actions/authActions";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./login.css"; // Import CSS file

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, success } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form,navigate));
  };

  useEffect(() => {
    if (success) {
      navigate("/dashboard");
    }
  }, [success, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login to Your Account</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <a href="/register" className="signup-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
