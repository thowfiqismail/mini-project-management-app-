import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProjectList from './components/ProjectList';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/product"
          element={user ? <ProjectList /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/product" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
