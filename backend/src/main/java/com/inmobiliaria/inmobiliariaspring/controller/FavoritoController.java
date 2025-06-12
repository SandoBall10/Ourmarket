package com.inmobiliaria.inmobiliariaspring.controller;

import com.inmobiliaria.inmobiliariaspring.dto.FavoritoDTO;
import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.service.FavoritoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @PostMapping("/agregar")
    @Operation(summary = "Agregar un favorito", description = "Agrega un inmueble a la lista de favoritos de un cliente.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Favorito agregado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente autenticado puede agregar un favorito")
    })
    public ResponseEntity<FavoritoDTO> agregarFavorito(@RequestBody FavoritoDTO favoritoDTO) {
        Favorito favorito = new Favorito();
        favorito.setIdCliente(favoritoDTO.getIdCliente());
        favorito.setIdInmueble(favoritoDTO.getIdInmueble());
        Favorito favoritoCreado = favoritoService.agregarFavorito(favorito);

        // Construir DTO de respuesta (puedes agregar más campos si tienes acceso a inmueble)
        FavoritoDTO respuesta = new FavoritoDTO();
        respuesta.setIdCliente(favoritoCreado.getIdCliente());
        respuesta.setIdInmueble(favoritoCreado.getIdInmueble());
        // Si tienes acceso a inmueble, puedes setear dirección, precio, imágenes, etc.

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping
    @Operation(summary = "Listar todos los favoritos", description = "Obtiene una lista de todos los favoritos registrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de favoritos obtenida exitosamente")
    })
    public List<FavoritoDTO> listarFavoritos() {
        return favoritoService.listarFavoritos();
    }

    @GetMapping("/{clienteId}/{inmuebleId}")
    @Operation(summary = "Obtener un favorito", description = "Obtiene un favorito específico por cliente ID e inmueble ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Favorito encontrado"),
        @ApiResponse(responseCode = "404", description = "Favorito no encontrado")
    })
    public ResponseEntity<FavoritoDTO> obtenerFavorito(@PathVariable Integer clienteId, 
                                                       @PathVariable Integer inmuebleId) {
        return favoritoService.obtenerFavorito(clienteId, inmuebleId)
            .map(favorito -> {
                FavoritoDTO dto = new FavoritoDTO();
                dto.setIdCliente(favorito.getIdCliente());
                dto.setIdInmueble(favorito.getIdInmueble());
                // Si tienes acceso a inmueble, puedes setear dirección, precio, imágenes, etc.
                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/eliminar/{clienteId}/{inmuebleId}")
    @Operation(summary = "Eliminar un favorito", description = "Elimina un favorito específico por cliente ID e inmueble ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Favorito eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Favorito no encontrado"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente que agregó el favorito puede eliminarlo")
    })
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Integer clienteId, @PathVariable Integer inmuebleId) {
        favoritoService.eliminarFavorito(clienteId, inmuebleId);
        return ResponseEntity.noContent().build();
    }
}