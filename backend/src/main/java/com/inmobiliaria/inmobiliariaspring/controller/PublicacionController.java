package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inmobiliaria.inmobiliariaspring.model.Publicacion;
import com.inmobiliaria.inmobiliariaspring.service.PublicacionService;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {

    @Autowired
    private PublicacionService publicacionService;

    //crear publicacion
    @PostMapping("/publicar")
    public ResponseEntity<Publicacion> crearPublicacion(@RequestBody Publicacion publicacion) {
        Publicacion nuevaPublicacion = publicacionService.crearPublicacion(
            publicacion.getInmueble().getIdInmueble(), 
            publicacion.getTitulo(), 
            publicacion.getDescripcion(), 
            publicacion.getCliente().getIdCliente()
        );
        return ResponseEntity.ok(nuevaPublicacion);
    }


    // Listar todas las publicaciones
    @GetMapping
    public ResponseEntity<List<Publicacion>> listarPublicaciones() {
        return ResponseEntity.ok(publicacionService.listarPublicaciones());
    }

    // Buscar publicación por ID
    @GetMapping("/{id}")
    public ResponseEntity<Publicacion> obtenerPublicacionPorId(@PathVariable Integer id) {
        return publicacionService.obtenerPublicacionPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Autorizar publicación (por un admin)
    @PutMapping("/{idPublicacion}/autorizar")
    public ResponseEntity<Publicacion> autorizarPublicacion(@PathVariable Integer idPublicacion,
                                                            @RequestParam Integer idAdmin) {
        try {
            Publicacion autorizada = publicacionService.autorizarPublicacion(idPublicacion, idAdmin);
            return ResponseEntity.ok(autorizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Actualizar publicación (editar)
    @PutMapping("/{id}")
    public ResponseEntity<Publicacion> actualizarPublicacion(@PathVariable Integer id,
                                                            @RequestBody Publicacion publicacionActualizada) {
        try {
            Publicacion actualizada = publicacionService.actualizarPublicacion(id, publicacionActualizada);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar publicación
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPublicacion(@PathVariable Integer id) {
        publicacionService.eliminarPublicacion(id);
        return ResponseEntity.noContent().build();
    }
}




