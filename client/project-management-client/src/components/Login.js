import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Viewer');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/Auth/login', {
        username: username.trim(),
        role,
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/product');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ minWidth: '350px' }}>
        <h3 className="mb-4 text-center">🔐 Project Manager Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              👤 Username
            </label>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="form-label">
              🧑‍💼 Select Role
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            🚀 Login
          </button>
        </form>
      </div>
    </div>
  );
}
