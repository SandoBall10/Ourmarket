package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.model.Rol;
import com.inmobiliaria.inmobiliariaspring.repository.AdministradorRepository;
import com.inmobiliaria.inmobiliariaspring.repository.RolRepository;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;

    private final RolRepository rolRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdministradorService(AdministradorRepository administradorRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.administradorRepository = administradorRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Administrador registrarAdministrador(Administrador admin) {
        // Asigna el rol 2 (admin) por defecto
        Rol rolAdmin = rolRepository.findById(2)
            .orElseThrow(() -> new RuntimeException("Rol admin no encontrado"));
        admin.setRol(rolAdmin);

        // Encripta la contraseña antes de guardar
        admin.setContrasena(passwordEncoder.encode(admin.getContrasena()));

        return administradorRepository.save(admin);
    }

    // Método para login simple
    public Optional<Administrador> login(String username, String contrasena) {
        Optional<Administrador> admin = findByUsername(username);
        if (admin.isPresent()) {
            Administrador administrador = admin.get();
            if (passwordEncoder.matches(contrasena, administrador.getContrasena())) {
                return Optional.of(administrador);
            }
        }
        return Optional.empty();
    }


    public List<Administrador> findAll() {
        return administradorRepository.findAll();
    }

    public Optional<Administrador> findById(Integer id) {
        return administradorRepository.findById(id);
    }

    public Optional<Administrador> findByUsername(String username) {
        return administradorRepository.findByUsername(username);
    }

    public void deleteById(Integer id) {
        administradorRepository.deleteById(id);
    }
}
