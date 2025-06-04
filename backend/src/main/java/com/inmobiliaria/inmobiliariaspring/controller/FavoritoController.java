package com.inmobiliaria.inmobiliariaspring.controller;

import com.inmobiliaria.inmobiliariaspring.dto.FavoritoDTO;
import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.service.FavoritoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {
    @Autowired
    private FavoritoService favoritoService;

    // Agregar un favorito
    @PostMapping("/agregar")
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

    // Listar todos los favoritos
    @GetMapping
    public List<FavoritoDTO> listarFavoritos() {
        return favoritoService.listarFavoritos();
    }

    // Obtener un favorito por cliente ID e inmueble ID
    @GetMapping("/{clienteId}/{inmuebleId}")
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

    // Eliminar un favorito por cliente ID e inmueble ID
    @DeleteMapping("/eliminar/{clienteId}/{inmuebleId}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Integer clienteId, @PathVariable Integer inmuebleId) {
        favoritoService.eliminarFavorito(clienteId, inmuebleId);
        return ResponseEntity.noContent().build();
    }
}