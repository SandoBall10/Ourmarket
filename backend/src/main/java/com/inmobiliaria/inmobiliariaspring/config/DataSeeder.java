package com.inmobiliaria.inmobiliariaspring.config;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Rol;
import com.inmobiliaria.inmobiliariaspring.repository.AdministradorRepository;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.repository.RolRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    public static final String ADMIN_USERNAME = "admin";
    public static final String ADMIN_PASSWORD = "Admin123!";
    public static final String CLIENTE_EMAIL = "usuario@gmail.com";
    public static final String CLIENTE_PASSWORD = "Cliente123!";

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final RolRepository rolRepository;
    private final AdministradorRepository administradorRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            RolRepository rolRepository,
            AdministradorRepository administradorRepository,
            ClienteRepository clienteRepository,
            PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.administradorRepository = administradorRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Rol master = ensureRol("MASTER");
        ensureRol("ADMIN");
        Rol clienteRol = ensureRol("CLIENTE");
        ensureAdmin(master);
        ensureCliente(clienteRol);
        log.info("Cuentas del equipo listas. Admin '{}' / Cliente '{}'", ADMIN_USERNAME, CLIENTE_EMAIL);
    }

    private Rol ensureRol(String nombre) {
        return rolRepository.findByNombre(nombre).orElseGet(() -> {
            Rol rol = new Rol();
            rol.setNombre(nombre);
            return rolRepository.save(rol);
        });
    }

    private void ensureAdmin(Rol master) {
        Administrador admin = administradorRepository.findByUsername(ADMIN_USERNAME).orElseGet(Administrador::new);
        admin.setUsername(ADMIN_USERNAME);
        admin.setRol(master);
        admin.setContrasena(passwordEncoder.encode(ADMIN_PASSWORD));
        administradorRepository.save(admin);
    }

    private void ensureCliente(Rol clienteRol) {
        Cliente cliente = clienteRepository.findByEmail(CLIENTE_EMAIL).orElseGet(Cliente::new);
        cliente.setEmail(CLIENTE_EMAIL);
        cliente.setNombreCompleto("Usuario Equipo");
        cliente.setTelefono("999888777");
        cliente.setGenero("Prefiero no decirlo");
        cliente.setFechaNacimiento(LocalDate.of(1998, 1, 15));
        cliente.setTipoDocumento(Cliente.TipoDocumento.DNI);
        cliente.setNumeroDocumento("99999999");
        cliente.setRol(clienteRol);
        cliente.setContrasena(passwordEncoder.encode(CLIENTE_PASSWORD));
        clienteRepository.save(cliente);
    }
}
