import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Reuse Login.css for styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/password-reset/request', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      setMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">X</div>
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        <p className="signup-link">
          <a href="/">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;