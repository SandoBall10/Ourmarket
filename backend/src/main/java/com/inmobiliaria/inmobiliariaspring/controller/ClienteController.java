package com.inmobiliaria.inmobiliariaspring.controller;

import com.inmobiliaria.inmobiliariaspring.dto.ClienteDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.ClienteMapper;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.service.ClienteService;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/registrar")
    public ResponseEntity<ClienteDTO> crearCliente(@RequestBody Cliente cliente) {
        Cliente nuevoCliente = clienteService.crearCliente(cliente);
        return ResponseEntity.ok(ClienteMapper.toDTO(nuevoCliente));
    }

    // Solo ADMIN/MASTER: Listar todos los clientes
    @GetMapping
    public List<ClienteDTO> listarClientes() {
        return clienteService.listarClientes()
            .stream()
            .map(ClienteMapper::toDTO)
            .collect(Collectors.toList());
    }

    // CLIENTE: Ver su propio perfil
    @GetMapping("/me")
    public ResponseEntity<ClienteDTO> verMiPerfil(Authentication authentication) {
        String email = authentication.getName();
        return clienteService.obtenerClientePorEmail(email)
                .map(ClienteMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CLIENTE: Actualizar solo su información (no email ni rol)
    @PutMapping("/me")
    public ResponseEntity<ClienteDTO> actualizarMiPerfil(Authentication authentication, @RequestBody Cliente clienteActualizado) {
        String email = authentication.getName();
        Cliente actualizado = clienteService.actualizarSoloDatosPersonalesPorEmail(email, clienteActualizado);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ClienteMapper.toDTO(actualizado));
    }

    // Obtener cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> obtenerClientePorId(@PathVariable Integer id) {
        return clienteService.obtenerClientePorId(id)
                .map(ClienteMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar cliente (ADMIN/MASTER)
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<ClienteDTO> actualizarCliente(@PathVariable Integer id, @RequestBody Cliente clienteActualizado) {
        Cliente actualizado = clienteService.actualizarCliente(id, clienteActualizado);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ClienteMapper.toDTO(actualizado));
    }

    // Eliminar cliente (ADMIN/MASTER)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Integer id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }
}
