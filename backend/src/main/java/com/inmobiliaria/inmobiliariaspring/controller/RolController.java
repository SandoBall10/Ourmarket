package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.inmobiliaria.inmobiliariaspring.model.Rol;
import com.inmobiliaria.inmobiliariaspring.service.RolService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    // Listar todos los roles
    @GetMapping
    @Operation(summary = "Listar todos los roles", description = "Obtiene una lista de todos los roles disponibles en el sistema. Solo accesible para usuarios con el rol MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de roles obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este recurso")
    })
    public List<Rol> listarRoles() {
        return rolService.listarRoles(); // Devuelve todos los roles
    }

    // Obtener un rol por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener rol por ID", description = "Obtiene los detalles de un rol específico por su ID. Solo accesible para usuarios con el rol MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Rol encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este recurso"),
        @ApiResponse(responseCode = "404", description = "Rol no encontrado")
    })
    public ResponseEntity<Rol> obtenerRolPorId(@PathVariable Integer id) {
        return rolService.obtenerRolPorId(id)
            .map(ResponseEntity::ok)  // Si existe, devuelve el rol
            .orElse(ResponseEntity.notFound().build()); // Si no se encuentra, responde con 404
    }
}
