package com.inmobiliaria.inmobiliariaspring.controller;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inmobiliaria.inmobiliariaspring.dto.PublicacionDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.PublicacionMapper;
import com.inmobiliaria.inmobiliariaspring.model.Publicacion;
import com.inmobiliaria.inmobiliariaspring.service.PublicacionService;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {

    @Autowired
    private PublicacionService publicacionService;

    //crear publicacion
    @PostMapping("/publicar")
    public ResponseEntity<PublicacionDTO> crearPublicacion(@RequestBody Publicacion publicacion, Authentication authentication) {
        Publicacion nuevaPublicacion = publicacionService.crearPublicacion(
            publicacion.getInmueble().getIdInmueble(), 
            publicacion.getTitulo(), 
            publicacion.getDescripcion(), 
            authentication.getName()
        );
        return ResponseEntity.ok(PublicacionMapper.toDTO(nuevaPublicacion));
    }
    
    // Listar todas las publicaciones
    @GetMapping
    public ResponseEntity<List<PublicacionDTO>> listarPublicaciones() {
        List<PublicacionDTO> dtos= publicacionService.listarPublicaciones()
            .stream()
            .map(PublicacionMapper::toDTO)
            .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
    }

    // Buscar publicación por ID
    @GetMapping("/{id}")
    public ResponseEntity<PublicacionDTO> obtenerPublicacionPorId(@PathVariable Integer id) {
        return publicacionService.obtenerPublicacionPorId(id)
            .map(PublicacionMapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Autorizar publicación (por un admin)
    @PutMapping("/{idPublicacion}/autorizar")
    public ResponseEntity<PublicacionDTO> autorizarPublicacion(@PathVariable Integer idPublicacion,
                                                            @RequestParam Integer idAdmin) {
        try {
            Publicacion autorizada = publicacionService.autorizarPublicacion(idPublicacion, idAdmin);
            return ResponseEntity.ok(PublicacionMapper.toDTO(autorizada));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Actualizar publicación (solo dueño o admin/master)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPublicacion(@PathVariable Integer id,
                                                  @RequestBody Publicacion publicacionActualizada,
                                                  Authentication authentication) {
        String emailUsuario = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        Publicacion publicacion = publicacionService.obtenerPublicacionPorId(id).orElse(null);
        if (publicacion == null) return ResponseEntity.notFound().build();

        if (!publicacion.getCliente().getEmail().equals(emailUsuario) && !esAdmin) {
            return ResponseEntity.status(403).body("No tienes permiso para actualizar esta publicación.");
        }
        Publicacion actualizada = publicacionService.actualizarPublicacion(id, publicacionActualizada);
        return ResponseEntity.ok(PublicacionMapper.toDTO(actualizada));
    }

    // Eliminar publicación (solo dueño o admin/master)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPublicacion(@PathVariable Integer id, Authentication authentication) {
        String emailUsuario = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        Publicacion publicacion = publicacionService.obtenerPublicacionPorId(id).orElse(null);
        if (publicacion == null) return ResponseEntity.notFound().build();

        if (!publicacion.getCliente().getEmail().equals(emailUsuario) && !esAdmin) {
            return ResponseEntity.status(403).body("No tienes permiso para eliminar esta publicación.");
        }
        publicacionService.eliminarPublicacion(id);
        return ResponseEntity.noContent().build();
    }
}




