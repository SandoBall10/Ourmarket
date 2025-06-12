package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.service.AdministradorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    // Registrar un administrador
    @PostMapping
    @Operation(summary = "Registrar un administrador", description = "Crea un nuevo administrador en el sistema. Solo accesible para usuarios con el rol MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Administrador registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este recurso")
    })
    public ResponseEntity<?> create(@RequestBody Administrador administrador) {
        if (administrador.getUsername() == null || administrador.getContrasena() == null) {
            return ResponseEntity.badRequest().body("Username y contraseña son obligatorios");
        }
        Administrador nuevoAdmin = administradorService.registrarAdministrador(administrador);
        return ResponseEntity.ok(nuevoAdmin);
    }

    // Listar administradores
    @GetMapping
    @Operation(summary = "Listar administradores", description = "Obtiene una lista de todos los administradores registrados. Solo accesible para usuarios con el rol MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de administradores obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este recurso, SOLO MASTER")
    })
    public List<Administrador> getAll() {
        return administradorService.findAll();
    }

    // Obtener administrador por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener administrador por ID", description = "Obtiene los datos de un administrador específico por su ID. Solo accesible para usuarios con el rol MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Administrador encontrado"),
        @ApiResponse(responseCode = "404", description = "Administrador no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este recurso, SOLO MASTER")
    })
    public ResponseEntity<Administrador> getById(@PathVariable Integer id) {
        Optional<Administrador> admin = administradorService.findById(id);
        return admin.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Actualizar administrador por ID
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar administrador por ID", description = "Actualiza los datos de un administrador específico por su ID. Solo accesible para usuarios con el rol MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Administrador actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Administrador no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este recurso. SOLO MASTER")
    })
    public ResponseEntity<Administrador> update(@PathVariable Integer id, @RequestBody Administrador administrador) {
        Optional<Administrador> existing = administradorService.findById(id);
        if (existing.isPresent()) {
            administrador.setIdAdmin(id);
            return ResponseEntity.ok(administradorService.registrarAdministrador(administrador));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar administrador por ID
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar administrador por ID", description = "Elimina un administrador específico por su ID. Solo accesible para usuarios con el rol MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Administrador eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Administrador no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este recurso, solo MASTER")
    })
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (administradorService.findById(id).isPresent()) {
            administradorService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
