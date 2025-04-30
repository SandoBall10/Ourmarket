import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Principal from './components/Principal';
import Registro from './components/Register/Registro';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registro />} /> {/* Ruta para el registro */}
    </Routes>
  );
};

export default App;