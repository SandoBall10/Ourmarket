import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route,} from 'react-router-dom';
import Login from './components/Login';
import Principal from './components/Principal';
import Registro from './components/Registro/Registro';
import Vendedores from './components/Guia/Vendedores';
import Compradores from './components/Guia/Compradores';
import Conocenos from './components/Guia/Conocenos';
import Publicaciones from './components/Opciones/Publicaciones';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/vendedores" element={<Vendedores />} />
      <Route path="/compradores" element={<Compradores />} />
      <Route path="/conocenos" element={<Conocenos />} />
      <Route path="/publicaciones" element={<Publicaciones />} />
    </Routes>
  );
};

export default App;