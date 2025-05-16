import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('Please agree to the terms and policy');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/map');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Send the Google ID token to the backend
      const response = await axios.post('http://localhost:5000/api/auth/google-login', {
        idToken,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/map');
    } catch (err) {
      setError('Google login failed: ' + err.message);
    }
  };

  const handleAppleLogin = () => {
    alert('Apple login functionality coming soon!');
    // Placeholder for Apple OAuth login
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo Section - Left side */}
        <div className="logo-section">
          <div className="logo-container">
            <img src="/x.png" alt="X Logo" />
            <div className="logo-text">Login</div>
          </div>
          <p className="credentials-text">
            Please Log in using your authorized credentials to access the platform.
          </p>
        </div>
        
        {/* Form Section - Right side */}
        <div className="form-section">
          {error && <p className="error">{error}</p>}
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#8C8C8C" strokeWidth="1.5"/>
                  <path d="M12 17V11" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="8" r="1" fill="#8C8C8C"/>
                </svg>
              </span>
            </div>
            
            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="icon" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#8C8C8C" strokeWidth="1.5"/>
                    <path d="M4 4L20 20" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#8C8C8C" strokeWidth="1.5"/>
                  </svg>
                )}
              </span>
            </div>
            
            <div className="forgot-password">
              <a href="/forgot-password">FORGOT PASSWORD?</a>
            </div>
            
            <div className="terms">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">I agree to the <a href="/terms">terms & policy</a>.</label>
            </div>
            
            <button type="submit" className="login-button">Login</button>
          </form>
          
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">Or</span>
            <div className="divider-line"></div>
          </div>
          
          <div className="social-login">
            <button className="social-button" onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.0223 13.6071 12.1761 15.0001 9.99984 15.0001C7.23859 15.0001 4.99984 12.7613 4.99984 10.0001C4.99984 7.23884 7.23859 5.00009 9.99984 5.00009C11.2744 5.00009 12.4319 5.48088 13.3177 6.28521L15.6744 3.92855C14.1417 2.52384 12.1714 1.66676 9.99984 1.66676C5.39817 1.66676 1.6665 5.39843 1.6665 10.0001C1.6665 14.6018 5.39817 18.3334 9.99984 18.3334C14.6015 18.3334 18.3332 14.6018 18.3332 10.0001C18.3332 9.44126 18.2757 8.89505 18.1711 8.36788Z" fill="#FFC107"/>
                <path d="M2.62744 6.12116L5.36536 8.12941C6.10619 6.29523 7.90036 5.00009 9.99994 5.00009C11.2744 5.00009 12.432 5.48088 13.3178 6.28521L15.6745 3.92855C14.1419 2.52384 12.1715 1.66676 9.99994 1.66676C6.79911 1.66676 4.02327 3.47352 2.62744 6.12116Z" fill="#FF3D00"/>
                <path d="M9.99984 18.3334C12.1261 18.3334 14.0584 17.5096 15.5752 16.1592L13.0046 13.9826C12.1358 14.6496 11.0802 15.0001 9.99984 15.0001C7.83276 15.0001 5.99226 13.6188 5.29692 11.6909L2.58301 13.7826C3.96192 16.4826 6.76026 18.3334 9.99984 18.3334Z" fill="#4CAF50"/>
                <path d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.3873 12.5896 13.7897 13.3887 13.0039 13.9829L13.0046 13.9825L15.5752 16.1592C15.4002 16.3196 18.3332 14.1666 18.3332 10.0001C18.3332 9.44126 18.2757 8.89505 18.1711 8.36788Z" fill="#1976D2"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
            <button className="social-button" onClick={handleAppleLogin}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0799 10.5092C14.0959 12.2796 15.0446 13.9461 16.5078 14.8828C16.0345 16.0827 15.2719 17.1679 14.2874 18.0478C13.621 18.6342 12.9146 19.2047 11.8854 19.2207C10.8881 19.2366 10.5428 18.6981 9.39505 18.6981C8.26335 18.6981 7.87005 19.2047 6.92137 19.2366C5.90804 19.2686 5.10946 18.6182 4.43508 18.0318C2.91793 16.7839 1.6861 14.7734 1.65813 12.2317C1.64612 10.8638 2.05146 9.51991 2.82798 8.45023C3.8413 7.03426 5.41444 6.16556 7.08691 6.13759C8.06825 6.12559 8.97896 6.74799 9.58934 6.74799C10.1837 6.74799 11.2969 6.03964 12.5048 6.15351C13.069 6.17348 14.6661 6.36528 15.6395 7.79328C15.5235 7.86115 14.071 8.70985 14.0799 10.5092ZM9.60135 4.73162C9.98262 4.27631 10.2319 3.69589 10.239 3.09154C9.6664 3.12348 9.10916 3.3407 8.65448 3.71387C8.21934 4.06717 7.95004 4.64282 7.93804 5.23516C8.5511 5.2471 9.13557 5.0351 9.60135 4.73162Z" fill="black"/>
              </svg>
              <span>Sign in with Apple</span>
            </button>
          </div>
          
          <p className="signup-link">
            New here? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;