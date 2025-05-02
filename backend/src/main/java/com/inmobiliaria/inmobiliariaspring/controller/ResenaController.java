package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inmobiliaria.inmobiliariaspring.model.Resena;
import com.inmobiliaria.inmobiliariaspring.service.ResenaService;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {
    
    @Autowired
    private ResenaService resenaService;

    // Crear una nueva reseña
    @PostMapping("/crear")
    public ResponseEntity<Resena> crearResena(@RequestBody Resena resena) {
        try {
            // Llamamos al servicio para crear la reseña
            Resena nuevaResena = resenaService.crearResena(
                resena.getComentario(),
                resena.getEstrellas(),
                resena.getCliente().getIdCliente(),
                resena.getInmueble().getIdInmueble()
            );
            return ResponseEntity.ok(nuevaResena);
        } catch (RuntimeException e) {
            // Si ocurre un error en el servicio
            return ResponseEntity.badRequest().body(null);
        }
    }
    // Listar todas las reseñas
    @GetMapping
    public List<Resena> listarResenas() {
        return resenaService.listarResenas();
    }

    // Obtener una reseña por ID
    @GetMapping("/{id}")
    public ResponseEntity<Resena> obtenerResenaPorId(@PathVariable Integer id) {
        return resenaService.obtenerResenaPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
public ResponseEntity<Resena> actualizarResena(@PathVariable Integer id, @RequestBody Resena resena) {
    try {
        // Llamamos al servicio para actualizar la reseña
        Resena resenaActualizada = resenaService.actualizarResena(
            id,
            resena.getComentario(),
            resena.getEstrellas()
        );
        return ResponseEntity.ok(resenaActualizada); // Devuelve la reseña actualizada
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build(); // Si no se encuentra la reseña, respondemos con 404
    }
}
    // Eliminar una reseña
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarResena(@PathVariable Integer id) {
        resenaService.eliminarResena(id);
        return ResponseEntity.noContent().build(); // Responde con 204 No Content (sin cuerpo)
    }
}
