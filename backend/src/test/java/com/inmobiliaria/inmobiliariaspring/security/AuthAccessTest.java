package com.inmobiliaria.inmobiliariaspring.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;

@ExtendWith(MockitoExtension.class)
class AuthAccessTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private AuthAccess authAccess;

    private Cliente cliente;

    @BeforeEach
    void setUp() {
        cliente = new Cliente();
        cliente.setIdCliente(7);
        cliente.setEmail("ana@mail.com");
    }

    @Test
    void clienteSoloAccedeASusRecursos() {
        Authentication auth = token("ana@mail.com", "ROLE_CLIENTE");
        when(clienteRepository.findByEmail("ana@mail.com")).thenReturn(Optional.of(cliente));

        assertTrue(authAccess.canAccessCliente(7, auth));
        assertFalse(authAccess.canAccessCliente(99, auth));
    }

    @Test
    void adminPuedeAccederACualquierCliente() {
        Authentication auth = token("master", "ROLE_MASTER");
        assertTrue(authAccess.canAccessCliente(99, auth));
    }

    @Test
    void soloDuenoOAdminModificaInmueble() {
        Inmueble inmueble = new Inmueble();
        inmueble.setCliente(cliente);

        Authentication dueno = token("ana@mail.com", "ROLE_CLIENTE");
        when(clienteRepository.findByEmail("ana@mail.com")).thenReturn(Optional.of(cliente));
        assertTrue(authAccess.canModifyInmueble(inmueble, dueno));

        Authentication otro = token("otro@mail.com", "ROLE_CLIENTE");
        Cliente otroCliente = new Cliente();
        otroCliente.setIdCliente(2);
        otroCliente.setEmail("otro@mail.com");
        when(clienteRepository.findByEmail("otro@mail.com")).thenReturn(Optional.of(otroCliente));
        assertFalse(authAccess.canModifyInmueble(inmueble, otro));
    }

    private Authentication token(String name, String role) {
        return new UsernamePasswordAuthenticationToken(
                name,
                "n/a",
                List.of(new SimpleGrantedAuthority(role)));
    }
}
