package com.inmobiliaria.inmobiliariaspring.service;

import java.util.Collections;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.repository.AdministradorRepository;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;

@Service
public class CustomerUserDetailsService implements UserDetailsService{
    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Buscar primero en administradores por username
        Optional<Administrador> adminOpt = administradorRepository.findByUsername(usernameOrEmail);
        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();
            return new User(
                admin.getUsername(),
                admin.getContrasena(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + admin.getRol().getNombre()))
            );
        }
        // Buscar en clientes por email
        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(usernameOrEmail);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            return new User(
                cliente.getEmail(),
                cliente.getContrasena(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENTE"))
            );
        }
        throw new UsernameNotFoundException("Usuario no encontrado");
    }
}
