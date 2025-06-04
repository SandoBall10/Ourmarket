import React, { useState } from 'react';

const Registro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    contrasena: '',
    telefono: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
  });

  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cliente = {
      ...formData,
      rol: { idRol: 1 }, // Ajusta según tu sistema si necesitas enviar otro rol
      fechaRegistro: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:8080/api/clientes/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cliente registrado:', data);
        setMensaje('¡Registro exitoso!');
        setFormData({
          nombreCompleto: '',
          email: '',
          contrasena: '',
          telefono: '',
          tipoDocumento: 'DNI',
          numeroDocumento: ''
        });
      } else {
        setMensaje('Error al registrar cliente. Verifica los datos.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMensaje('Error de red al registrar cliente.');
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombreCompleto"
          placeholder="Nombre completo"
          value={formData.nombreCompleto}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <select
          name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={handleChange}
          required
        >
          <option value="DNI">DNI</option>
          <option value="CARNET_EXTRANJERIA">Carnet de Extranjería</option>
        </select>
        <input
          type="text"
          name="numeroDocumento"
          placeholder="Número de documento"
          value={formData.numeroDocumento}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default Registro;
