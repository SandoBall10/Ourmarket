package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.service.FavoritoService;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    // Agregar un favorito
    @PostMapping("/agregar")
    public ResponseEntity<Favorito> agregarFavorito(@RequestBody Favorito favorito) {
        Favorito favoritoCreado = favoritoService.agregarFavorito(favorito);
        return ResponseEntity.ok(favoritoCreado);
    }

    // Listar todos los favoritos
    @GetMapping
    public List<Favorito> listarFavoritos() {
        return favoritoService.listarFavoritos();
    }

    // Obtener un favorito por cliente ID e inmueble ID
    @GetMapping("/{clienteId}/{inmuebleId}")
    public ResponseEntity<Favorito> obtenerFavorito(@PathVariable Integer clienteId, 
                                                    @PathVariable Integer inmuebleId) {
        return favoritoService.obtenerFavorito(clienteId, inmuebleId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar un favorito por cliente ID e inmueble ID
    @DeleteMapping("/eliminar/{clienteId}/{inmuebleId}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Integer clienteId, 
                                                 @PathVariable Integer inmuebleId) {
        favoritoService.eliminarFavorito(clienteId, inmuebleId);
        return ResponseEntity.noContent().build();
    }
}