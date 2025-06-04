import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Principal from './components/Principal';
import Registro from './components/Registro/Registro';
import Vendedores from './components/Guia/Vendedores';
import Compradores from './components/Guia/Compradores';
import Conocenos from './components/Guia/Conocenos';
import Publicaciones from './components/Opciones/Publicaciones';
import Perfil from './components/Opciones/Perfil';
import Buscar from './components/Operaciones/Buscar';
import Chats from './components/Chats/Chats';
import Vender from './components/Operaciones/Vender';
import Favoritos from './components/Opciones/Favoritos';

// Importación de AOS para animaciones
import AOS from 'aos';
import 'aos/dist/aos.css';

const App: React.FC = () => {
  // Inicializar AOS para animaciones al cargar la aplicación
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out'
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/vendedores" element={<Vendedores />} />
      <Route path="/compradores" element={<Compradores />} />
      <Route path="/conocenos" element={<Conocenos />} />
      <Route path="/publicaciones" element={<Publicaciones />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/buscar" element={<Buscar />} />
      <Route path="/chats" element={<Chats />} />
      <Route path="/vender" element={<Vender />} />
      <Route path="/favoritos" element={<Favoritos />} />
    </Routes>
  );
};

export default App;