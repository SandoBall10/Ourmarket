package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    private final BCryptPasswordEncoder passwordEncoder;

    public ClienteService() {
        this.passwordEncoder = new BCryptPasswordEncoder(); // Instancia de BCryptPasswordEncoder
    }

    // Crear cliente usando Factory
    public Cliente crearCliente(Cliente cliente) {
        // Verificar si el email ya está registrado
        if (clienteRepository.findByEmail(cliente.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        // Crear el rol "cliente" directamente sin buscar en la base de datos
        Rol rolCliente = new Rol();
        rolCliente.setIdRol(2); // Asegúrate de que este ID corresponde al rol "cliente" en tu base de datos
        rolCliente.setNombre("cliente");

        // Encriptar la contraseña antes de usarla
        String contraseñaEncriptada = passwordEncoder.encode(cliente.getContraseña());

        Cliente nuevoCliente = ClienteFactory.crearCliente(
            cliente.getNombreCompleto(),
            cliente.getEmail(),
            contraseñaEncriptada, // usamos la contraseña encriptada
            cliente.getTelefono(),
            cliente.getTipoDocumento(),
            cliente.getNumeroDocumento(),
            rolCliente
        );

        //Guardamos el cliente en la base de datos
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

    // Obtener un cliente por tipo de documento
    public Optional<Cliente> obtenerClientePorTipoDocumento(String tipoDocumento) {
        return clienteRepository.findByTipoDocumento(tipoDocumento); // Método en el repositorio
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }


    public Rol obtenerRolPorNombre(String nombreRol) {
        return rolRepository.findByNombre(nombreRol)
            .orElseThrow(() -> new RuntimeException("Rol " + nombreRol + " no encontrado"));
    }

    // Obtener cliente por email
    public Optional<Cliente> obtenerClientePorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }


    //actualizar cliente
    public Cliente actualizarCliente(Integer id, Cliente clienteActualizado) {
        Optional<Cliente> clienteExistente = clienteRepository.findById(id);
        if (clienteExistente.isPresent()) {
            Cliente cliente = clienteExistente.get();
            // Verificar si el nuevo email ya está registrado por otro cliente
            if (!cliente.getEmail().equals(clienteActualizado.getEmail()) &&
                clienteRepository.findByEmail(clienteActualizado.getEmail()).isPresent()) {
                throw new RuntimeException("El email ya está registrado por otro cliente");
            }
            cliente.setNombreCompleto(clienteActualizado.getNombreCompleto());
            cliente.setEmail(clienteActualizado.getEmail());

            // Si la contraseña fue modificada, encriptarla antes de actualizarla
            if (!clienteActualizado.getContraseña().equals(cliente.getContraseña())) {
                cliente.setContraseña(passwordEncoder.encode(clienteActualizado.getContraseña()));
            }
            
            cliente.setTipoDocumento(clienteActualizado.getTipoDocumento());
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