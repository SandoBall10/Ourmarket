package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.inmobiliaria.inmobiliariaspring.factory.ClienteFactory;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Rol;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.repository.RolRepository;

@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RolRepository rolRepository;

    // Crear cliente usando Factory
    public Cliente crearCliente(Cliente cliente) {
        Rol rolCliente = rolRepository.findByNombre("CLIENTE")
            .orElseThrow(() -> new RuntimeException("Rol CLIENTE no encontrado"));

        Cliente nuevoCliente = ClienteFactory.crearCliente(
            cliente.getNombre(),
            cliente.getApellido(),
            cliente.getEmail(),
            cliente.getContraseña(),
            rolCliente
        );

        return clienteRepository.save(nuevoCliente);
    }

    //listar por id
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    //obtener por id
    public Optional<Cliente> obtenerClientePorId(Integer id) {
        return clienteRepository.findById(id);
    }

    //Buscar cliente por email
    public Optional<Cliente> ObtenerClientePorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }

    //actualizar cliente
    public Cliente actualizarCliente(Integer id, Cliente clienteActualizado) {
        Optional<Cliente> clienteExistente = clienteRepository.findById(id);
        if (clienteExistente.isPresent()) {
            Cliente cliente = clienteExistente.get();
            cliente.setNombre(clienteActualizado.getNombre());
            cliente.setApellido(clienteActualizado.getApellido());
            cliente.setEmail(clienteActualizado.getEmail());
            cliente.setContraseña(clienteActualizado.getContraseña());
            cliente.setRol(clienteActualizado.getRol());
            return clienteRepository.save(cliente);
        } else {
            return null;
        }
    }

    //eliminar cliente
    public void eliminarCliente(Integer id) {
        clienteRepository.deleteById(id);
    }
}