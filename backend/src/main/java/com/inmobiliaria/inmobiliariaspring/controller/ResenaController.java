package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inmobiliaria.inmobiliariaspring.dto.ResenaDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.ResenaMapper;
import com.inmobiliaria.inmobiliariaspring.model.Resena;
import com.inmobiliaria.inmobiliariaspring.service.ResenaService;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {
    
    @Autowired
    private ResenaService resenaService;

    // Crear una nueva reseña
    @PostMapping("/crear")
    public ResponseEntity<ResenaDTO> crearResena(@RequestBody Resena resena) {
        try {
            // Llamamos al servicio para crear la reseña
            Resena nuevaResena = resenaService.crearResena(
                resena.getComentario(),
                resena.getEstrellas(),
                resena.getCliente().getIdCliente(),
                resena.getInmueble().getIdInmueble()
            );
            return ResponseEntity.ok(ResenaMapper.toDTO(nuevaResena));
        } catch (RuntimeException e) {
            // Si ocurre un error en el servicio
            return ResponseEntity.badRequest().body(null);
        }
    }
    /// Listar todas las reseñas
    @GetMapping
    public List<ResenaDTO> listarResenas() {
        return resenaService.listarResenas()
            .stream()
            .map(ResenaMapper::toDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    // Obtener una reseña por ID
    @GetMapping("/{id}")
    public ResponseEntity<ResenaDTO> obtenerResenaPorId(@PathVariable Integer id) {
        return resenaService.obtenerResenaPorId(id)
            .map(ResenaMapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<ResenaDTO> actualizarResena(@PathVariable Integer id, @RequestBody Resena resena) {
    try {
        // Llamamos al servicio para actualizar la reseña
        Resena resenaActualizada = resenaService.actualizarResena(
            id,
            resena.getComentario(),
            resena.getEstrellas()
        );
        return ResponseEntity.ok(ResenaMapper.toDTO(resenaActualizada)); // Devuelve la reseña actualizada
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
