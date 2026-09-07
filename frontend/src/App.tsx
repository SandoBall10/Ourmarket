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
import Dashboard from './components/Super/Dashboard';
import Inmuebles from './components/Opciones/Inmuebles';
import ProtectedRoute from './auth/ProtectedRoute';

import AOS from 'aos';
import 'aos/dist/aos.css';
import 'animate.css';

const App: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out'
    });
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/" element={<Principal />} />
      <Route path="/vendedores" element={<Vendedores />} />
      <Route path="/compradores" element={<Compradores />} />
      <Route path="/conocenos" element={<Conocenos />} />
      <Route path="/buscar" element={<Buscar />} />
      <Route
        path="/vender"
        element={
          <ProtectedRoute>
            <Vender />
          </ProtectedRoute>
        }
      />
      <Route
        path="/publicaciones"
        element={
          <ProtectedRoute>
            <Publicaciones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inmuebles"
        element={
          <ProtectedRoute>
            <Inmuebles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favoritos"
        element={
          <ProtectedRoute>
            <Favoritos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
