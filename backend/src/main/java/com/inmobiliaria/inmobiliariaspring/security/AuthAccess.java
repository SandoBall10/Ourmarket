package com.inmobiliaria.inmobiliariaspring.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;

@Component
public class AuthAccess {

    @Autowired
    private ClienteRepository clienteRepository;

    public boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));
    }

    public Optional<Cliente> currentCliente(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return Optional.empty();
        }
        return clienteRepository.findByEmail(authentication.getName());
    }

    public Cliente requireCliente(Authentication authentication) {
        return currentCliente(authentication)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Se requiere un cliente autenticado"));
    }

    public boolean canAccessCliente(Integer clienteId, Authentication authentication) {
        if (clienteId == null) {
            return false;
        }
        if (isAdmin(authentication)) {
            return true;
        }
        return currentCliente(authentication)
                .map(cliente -> clienteId.equals(cliente.getIdCliente()))
                .orElse(false);
    }

    public void requireClienteAccess(Integer clienteId, Authentication authentication) {
        if (!canAccessCliente(clienteId, authentication)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para este recurso");
        }
    }

    public boolean canModifyInmueble(Inmueble inmueble, Authentication authentication) {
        if (inmueble == null) {
            return false;
        }
        if (isAdmin(authentication)) {
            return true;
        }
        if (inmueble.getCliente() == null) {
            return false;
        }
        return currentCliente(authentication)
                .map(cliente -> cliente.getIdCliente().equals(inmueble.getCliente().getIdCliente()))
                .orElse(false);
    }

    public void requireInmuebleAccess(Inmueble inmueble, Authentication authentication) {
        if (!canModifyInmueble(inmueble, authentication)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para modificar este inmueble");
        }
    }
}
