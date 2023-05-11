import './App.css';
import '@picocss/pico/css/pico.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const response = await axios.get('http://localhost:5000/auth', {
        headers: {
          Authorization: JSON.parse(localStorage.getItem('user'))
        }
      }, { withCredentials: true });
      if(response.data) {
        setUser(response.data);
      }
    };
    if(localStorage.getItem('user')) {
      if(JSON.parse(localStorage.getItem('ttl')) < new Date().getTime()) {
        localStorage.removeItem('user');
        localStorage.removeItem('ttl');
      } else {
        checkUser();
      }
    }
  }, []);

  return (
  <BrowserRouter>
      <div className="app">
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      </Routes>
      </div>
  </BrowserRouter>
  );
}

export default App;
