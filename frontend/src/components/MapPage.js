import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import './MapPage.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to control map view
const MapController = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

const MapPage = () => {
  const [position, setPosition] = useState([12.9716, 77.5946]); // Default: Bengaluru, India
  const [address, setAddress] = useState('');
  const [marker, setMarker] = useState({ lat: 12.9716, lng: 77.5946, popup: 'Bengaluru, Karnataka' });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const navigate = useNavigate();

  // Fetch search history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://map-seven-orpin.vercel.app/api/search', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          console.error('Error fetching search history:', err);
        }
      }
    };
    fetchHistory();
  }, [navigate]);

  // Handle address suggestions while typing
  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setAddress(value);
    setShowRecentSearches(false); // Hide recent searches while typing
    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`
        );
        setSuggestions(response.data.map(item => item.display_name));
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion);
    setSuggestions([]);
    setShowRecentSearches(false);
  };

  const handleInputFocus = () => {
    if (!address) {
      setShowRecentSearches(true); // Show recent searches when input is focused and empty
    }
  };

  const handleClearInput = () => {
    setAddress('');
    setSuggestions([]);
    setShowRecentSearches(true); // Show recent searches after clearing
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        setMarker({ lat: parseFloat(lat), lng: parseFloat(lon), popup: display_name });

        // Save search history to backend
        const token = localStorage.getItem('token');
        await axios.post(
          'https://map-seven-orpin.vercel.app/api/search',
          { address: display_name, latitude: lat, longitude: lon },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Refresh history after new search
        const historyResponse = await axios.get('https://map-seven-orpin.vercel.app/api/search', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyResponse.data);
        setSuggestions([]);
        setShowRecentSearches(false);
      } else {
        alert('Address not found');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert('Error searching for address: ' + err.message);
      }
    }
  };

  const handleHistoryClick = (lat, lng, popup) => {
    const newPosition = [lat, lng];
    setPosition(newPosition);
    setMarker({ lat, lng, popup });
    setShowHistory(false); // Close history sidebar after selection
  };

  const handleDeleteHistory = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://map-seven-orpin.vercel.app/api/search/${index}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        console.error('Error deleting history item:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Function to format date/time for history items
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="map-page">
      {/* Logo */}
      <div className="header">
        <div className="logo">
          <img src="/x.png" alt="Logo" />
        </div>
        <h2>Address Search</h2>
      </div>

      {/* User Profile Button */}
      <button className="user-profile" onClick={handleLogout}>
        U
      </button>

      {/* History Button */}
      <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-wrapper">
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search Map"
            value={address}
            onChange={handleAddressChange}
            onFocus={handleInputFocus}
            required
          />
          {address && (
            <button type="button" className="clear-btn" onClick={handleClearInput}>
              ✕
            </button>
          )}
          {(suggestions.length > 0 || (showRecentSearches && history.length > 0)) && (
            <ul className="suggestions">
              {showRecentSearches && !address && history.slice(0, 3).map((item, index) => (
                <li
                  key={`recent-${index}`}
                  onClick={() => handleSuggestionClick(item.address)}
                >
                  <div className="suggestion-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  {item.address}
                </li>
              ))}
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  <div className="suggestion-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Search</button>
      </form>

      {/* History Sidebar */}
      <div className={`history-sidebar ${showHistory ? 'show' : ''}`}>
        <div className="history-header">
          <h3>History</h3>
          <button className="close-history" onClick={() => setShowHistory(false)}>✕</button>
        </div>
        {history.length > 0 ? (
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <div className="location-info" onClick={() => handleHistoryClick(item.latitude, item.longitude, item.address)}>
                  <div className="location-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="address-details">
                    <div className="address">{item.address}</div>
                    <div className="timestamp">{formatDateTime(item.timestamp)}</div>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteHistory(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No search history yet.</p>
        )}
      </div>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapController position={position} />
          <Marker position={[marker.lat, marker.lng]}>
            <Popup>{marker.popup}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;