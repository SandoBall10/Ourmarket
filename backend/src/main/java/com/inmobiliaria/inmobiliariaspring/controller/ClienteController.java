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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Registrar un cliente
    @PostMapping("/registrar")
    @Operation(summary = "Registrar un nuevo cliente", description = "Crea un nuevo cliente en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<ClienteDTO> crearCliente(@RequestBody Cliente cliente) {
        Cliente nuevoCliente = clienteService.crearCliente(cliente);
        return ResponseEntity.ok(ClienteMapper.toDTO(nuevoCliente));
    }

    // Listar todos los clientes (ADMIN/MASTER)
    @GetMapping
    @Operation(summary = "Listar todos los clientes", description = "Obtiene una lista de todos los clientes registrados. Solo accesible para usuarios con los roles ADMIN o MASTER. Los clientes no tienen acceso a este recurso.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo usuarios con los roles ADMIN o MASTER pueden acceder a este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public List<ClienteDTO> listarClientes() {
        return clienteService.listarClientes()
            .stream()
            .map(ClienteMapper::toDTO)
            .collect(Collectors.toList());
    }

    // Ver perfil del cliente (CLIENTE)
    @GetMapping("/me")
    @Operation(summary = "Ver perfil del cliente", description = "Obtiene los datos del cliente autenticado. Solo accesible para el cliente autenticado. Los administradores y otros clientes no tienen acceso a este recurso.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Perfil obtenido exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente autenticado puede acceder a este recurso")
    })
    public ResponseEntity<ClienteDTO> verMiPerfil(Authentication authentication) {
        String email = authentication.getName();
        return clienteService.obtenerClientePorEmail(email)
                .map(ClienteMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar perfil del cliente (CLIENTE)
    @PutMapping("/me")
    @Operation(summary = "Actualizar perfil del cliente", description = "Actualiza los datos personales del cliente autenticado. Solo accesible para el cliente autenticado. Los administradores y otros clientes no tienen acceso a este recurso.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente autenticado puede acceder a este recurso")
    })
    public ResponseEntity<ClienteDTO> actualizarMiPerfil(Authentication authentication, @RequestBody Cliente clienteActualizado) {
        String email = authentication.getName();
        Cliente actualizado = clienteService.actualizarSoloDatosPersonalesPorEmail(email, clienteActualizado);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ClienteMapper.toDTO(actualizado));
    }

    // Obtener cliente por ID (ADMIN/MASTER)
    @GetMapping("/{id}")
    @Operation(summary = "Obtener cliente por ID", description = "Obtiene los datos de un cliente específico por su ID. Solo accesible para usuarios con los roles ADMIN o MASTER. Los clientes no tienen acceso a este recurso.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo usuarios con los roles ADMIN o MASTER pueden acceder a este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public ResponseEntity<ClienteDTO> obtenerClientePorId(@PathVariable Integer id) {
        return clienteService.obtenerClientePorId(id)
                .map(ClienteMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar cliente por ID (ADMIN/MASTER)
    @PutMapping("/actualizar/{id}")
    @Operation(summary = "Actualizar cliente por ID", description = "Actualiza los datos de un cliente específico por su ID. Solo accesible para usuarios con los roles ADMIN o MASTER. Los clientes no tienen acceso a este recurso.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo usuarios con los roles ADMIN o MASTER pueden acceder a este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public ResponseEntity<ClienteDTO> actualizarCliente(@PathVariable Integer id, @RequestBody Cliente clienteActualizado) {
        Cliente actualizado = clienteService.actualizarCliente(id, clienteActualizado);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ClienteMapper.toDTO(actualizado));
    }

    // Eliminar cliente por ID (ADMIN/MASTER)
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar cliente por ID", description = "Elimina un cliente específico por su ID. Solo accesible para usuarios con los roles ADMIN o MASTER. Los clientes no tienen acceso a este recurso.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Cliente eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo usuarios con los roles ADMIN o MASTER pueden acceder a este recurso")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Integer id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }
}
