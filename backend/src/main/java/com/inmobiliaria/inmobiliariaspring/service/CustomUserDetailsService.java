package com.inmobiliaria.inmobiliariaspring.service;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import org.springframework.security.core.userdetails.UserDetailsService;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ClienteRepository clienteRepository;

    public CustomUserDetailsService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscar el cliente por email
        Cliente cliente = clienteRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el email: " + username));

        // Obtener los roles del cliente y convertirlos en authorities
        Collection<SimpleGrantedAuthority> authorities = cliente.getRol() != null
                ? List.of(new SimpleGrantedAuthority("ROLE_" + cliente.getRol().getNombre().toUpperCase()))
                : List.of();

        System.out.println("Roles del cliente: " + authorities);

        // Construir y devolver un objeto UserDetails
        return new org.springframework.security.core.userdetails.User(
                cliente.getEmail(),
                cliente.getContraseña(),
                authorities // Pasar como Collection
        );
    }
}