package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

import com.inmobiliaria.inmobiliariaspring.dto.ResenaDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.ResenaMapper;
import com.inmobiliaria.inmobiliariaspring.model.Resena;
import com.inmobiliaria.inmobiliariaspring.security.AuthAccess;
import com.inmobiliaria.inmobiliariaspring.service.ResenaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {
    
    @Autowired
    private ResenaService resenaService;

    @Autowired
    private AuthAccess authAccess;

    // Crear una nueva reseña
    @PostMapping("/crear")
    @Operation(summary = "Crear una reseña", description = "Crea una nueva reseña asociada a un cliente e inmueble.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Reseña creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente autenticado puede crear una reseña")
    })
    public ResponseEntity<ResenaDTO> crearResena(@RequestBody Resena resena, Authentication authentication) {
        try {
            Integer clienteId = authAccess.requireCliente(authentication).getIdCliente();
            Integer inmuebleId = resena.getInmueble() != null ? resena.getInmueble().getIdInmueble() : null;
            Resena nuevaResena = resenaService.crearResena(
                resena.getComentario(),
                resena.getEstrellas(),
                clienteId,
                inmuebleId
            );
            return ResponseEntity.ok(ResenaMapper.toDTO(nuevaResena));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Listar todas las reseñas
    @GetMapping
    @Operation(summary = "Listar todas las reseñas", description = "Obtiene una lista de todas las reseñas registradas.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de reseñas obtenida exitosamente")
    })
    public List<ResenaDTO> listarResenas() {
        return resenaService.listarResenas()
            .stream()
            .map(ResenaMapper::toDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    // Obtener una reseña por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener reseña por ID", description = "Obtiene los detalles de una reseña específica por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Reseña encontrada"),
        @ApiResponse(responseCode = "404", description = "Reseña no encontrada")
    })
    public ResponseEntity<ResenaDTO> obtenerResenaPorId(@PathVariable Integer id) {
        return resenaService.obtenerResenaPorId(id)
            .map(ResenaMapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar una reseña
    @PutMapping("/actualizar/{id}")
    @Operation(summary = "Actualizar una reseña", description = "Actualiza el comentario y las estrellas de una reseña específica.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Reseña actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Reseña no encontrada"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente que creó la reseña puede actualizarla")
    })
    public ResponseEntity<ResenaDTO> actualizarResena(@PathVariable Integer id, @RequestBody Resena resena, Authentication authentication) {
        try {
            resenaService.assertPuedeEditar(id, authentication);
            Resena resenaActualizada = resenaService.actualizarResena(
                id,
                resena.getComentario(),
                resena.getEstrellas()
            );
            return ResponseEntity.ok(ResenaMapper.toDTO(resenaActualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar una reseña
    @DeleteMapping("/eliminar/{id}")
    @Operation(summary = "Eliminar una reseña", description = "Elimina una reseña específica por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Reseña eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Reseña no encontrada"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente que creó la reseña puede eliminarla")
    })
    public ResponseEntity<Void> eliminarResena(@PathVariable Integer id, Authentication authentication) {
        resenaService.assertPuedeEditar(id, authentication);
        resenaService.eliminarResena(id);
        return ResponseEntity.noContent().build();
    }
}
