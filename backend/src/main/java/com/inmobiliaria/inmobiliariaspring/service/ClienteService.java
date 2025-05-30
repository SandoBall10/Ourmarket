package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    // Mapa para contar intentos fallidos por email (en memoria)
    private final Map<String, Integer> intentosFallidos = new ConcurrentHashMap<>();

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ClienteService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = new BCryptPasswordEncoder(); 
    }

    // Crear cliente usando Factory
    public Cliente crearCliente(Cliente cliente) {
        // Validar formato de email
        validarEmail(cliente.getEmail());
        
        // Validar teléfono
        validarTelefono(cliente.getTelefono());

        // Validar número de documento según tipo
        validarNumeroDocumento(cliente.getTipoDocumento(), cliente.getNumeroDocumento());

        // Validar fuerza de contraseña
        validarFuerzaContrasena(cliente.getContrasena());

        // Verificar si el email ya está registrado
        if (clienteRepository.findByEmail(cliente.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        // Crear el rol "cliente" directamente sin buscar en la base de datos
        Rol rolCliente = new Rol();
        rolCliente.setIdRol(3); // Asegúrate de que este ID corresponde al rol "cliente" en tu base de datos
        rolCliente.setNombre("CLIENTE");

        // Encriptar la contraseña antes de usarla
        String contraseñaEncriptada = passwordEncoder.encode(cliente.getContrasena());

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

    public Cliente iniciarSesionClientePorEmail(String email, String contrasena) {
        // Limitar intentos de login a 3
        if (intentosFallidos.getOrDefault(email, 0) >= 3) {
            throw new RuntimeException("Cuenta bloqueada por demasiados intentos fallidos.");
        }
        
        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(email);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            if (passwordEncoder.matches(contrasena, cliente.getContrasena())) {
                return cliente;
            }
        }
    return null;
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

            // Validar y actualizar teléfono solo si se envía uno nuevo
            if (clienteActualizado.getTelefono() != null && !clienteActualizado.getTelefono().isEmpty()) {
                validarTelefono(clienteActualizado.getTelefono());
                cliente.setTelefono(clienteActualizado.getTelefono());
            }
            // Verificar si el nuevo email ya está registrado por otro cliente
            if (!cliente.getEmail().equals(clienteActualizado.getEmail()) &&
                clienteRepository.findByEmail(clienteActualizado.getEmail()).isPresent()) {
                throw new RuntimeException("El email ya está registrado por otro cliente");
            }
            cliente.setNombreCompleto(clienteActualizado.getNombreCompleto());
            cliente.setEmail(clienteActualizado.getEmail());

            // Si la contraseña fue modificada, encriptarla antes de actualizarla
            if (clienteActualizado.getContrasena() != null && !clienteActualizado.getContrasena().isEmpty()) {
            cliente.setContrasena(passwordEncoder.encode(clienteActualizado.getContrasena()));
}

            return clienteRepository.save(cliente);
        } else {
            return null;
        }
    }

    //eliminar cliente
    public void eliminarCliente(Integer id) {
        clienteRepository.deleteById(id);
    }
    

    // MÉTODOS DE VALIDACIÓN PARA TELEFONO Y TIPO DE DOCUMENTO, EMAIL Y FUERZA CONTRASENA

    // Validar teléfono (local o internacional)
    private void validarTelefono(String telefono) {
        if (telefono == null || !telefono.matches("^\\+?[0-9\\- ]{7,15}$")) {
            throw new RuntimeException("Número de teléfono inválido. Debe tener entre 9 y 15 dígitos y puede incluir el símbolo '+'.");
        }
    }

    // validar email:
    private void validarEmail(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new RuntimeException("Formato de correo electrónico inválido.");
        }
    }

    // Validar fuerza de contraseña
    private void validarFuerzaContrasena(String contrasena) {
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
        if (contrasena == null || !contrasena.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) {
            throw new RuntimeException("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
        }
    }

    // Validar número de documento según tipo
    private void validarNumeroDocumento(Cliente.TipoDocumento tipoDocumento, String numeroDocumento) {
        if (tipoDocumento == Cliente.TipoDocumento.DNI) {
            if (numeroDocumento == null || !numeroDocumento.matches("^\\d{8}$")) {
                throw new RuntimeException("El DNI debe tener exactamente 8 dígitos numéricos.");
            }
        } else if (tipoDocumento == Cliente.TipoDocumento.CARNET_EXTRANJERIA) {
            if (numeroDocumento == null || !numeroDocumento.matches("^[A-Za-z0-9]{9,12}$")) {
                throw new RuntimeException("El Carnet de Extranjería debe tener entre 9 y 12 caracteres alfanuméricos.");
            }
        }
    }
    
}