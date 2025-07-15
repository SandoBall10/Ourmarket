package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;
import java.util.Map;
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
import com.inmobiliaria.inmobiliariaspring.mappers.InmuebleMapper;
import com.inmobiliaria.inmobiliariaspring.mappers.PublicacionMapper;
import com.inmobiliaria.inmobiliariaspring.model.Publicacion;
import com.inmobiliaria.inmobiliariaspring.service.PublicacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {

    @Autowired
    private PublicacionService publicacionService;

    @Autowired
    private com.inmobiliaria.inmobiliariaspring.repository.InmuebleRepository inmuebleRepository;

    // Crear publicación
    @PostMapping("/publicar")
    @Operation(summary = "Crear publicación", description = "Crea una nueva publicación asociada a un inmueble.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicación creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado: Solo el cliente autenticado puede crear una publicación")
    })
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
    @Operation(summary = "Listar publicaciones", description = "Obtiene una lista de todas las publicaciones disponibles.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de publicaciones obtenida exitosamente")
    })
    public ResponseEntity<List<PublicacionDTO>> listarPublicaciones() {
        List<PublicacionDTO> dtos = publicacionService.listarPublicaciones()
            .stream()
        .map(pub -> {
            PublicacionDTO dto = PublicacionMapper.toDTO(pub);
            // Aquí obtienes el inmueble y lo asignas al DTO
            if (pub.getInmueble() != null && pub.getInmueble().getIdInmueble() != null) {
                inmuebleRepository.findById(pub.getInmueble().getIdInmueble()).ifPresent(
                    inmueble -> dto.setInmueble(InmuebleMapper.toDTO(inmueble))
                );
            }
            return dto;
        })
        .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    

    // Buscar publicación por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener publicación por ID", description = "Obtiene los detalles de una publicación específica por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicación encontrada"),
        @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    public ResponseEntity<PublicacionDTO> obtenerPublicacionPorId(@PathVariable Integer id) {
        return publicacionService.obtenerPublicacionPorId(id)
            .map(PublicacionMapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Listar publicaciones por estado (solo para admins)
    @GetMapping("/pendientes")
    @Operation(summary = "Listar publicaciones pendientes de aprobación", description = "Obtiene todas las publicaciones en estado 'Pendiente de aprobación'. Solo accesible para ADMIN/MASTER.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<List<PublicacionDTO>> listarPublicacionesPendientes() {
        List<PublicacionDTO> dtos = publicacionService.listarPublicaciones()
            .stream()
            .filter(pub -> pub.getAutorizado() == 1) // Solo las pendientes
            .map(pub -> {
            PublicacionDTO dto = PublicacionMapper.toDTO(pub);
            // Aquí obtienes el inmueble y lo asignas al DTO
            if (pub.getInmueble() != null && pub.getInmueble().getIdInmueble() != null) {
                inmuebleRepository.findById(pub.getInmueble().getIdInmueble()).ifPresent(
                    inmueble -> dto.setInmueble(InmuebleMapper.toDTO(inmueble))
                );
            }
            return dto;
        })
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);

        


    }

    // Autorizar publicación (por un admin)
    @PutMapping("/{idPublicacion}/autorizar")
    @Operation(summary = "Autorizar publicación", description = "Autoriza una publicación específica. Solo un administrador puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicación autorizada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Error al autorizar publicación")
    })
    public ResponseEntity<PublicacionDTO> autorizarPublicacion(@PathVariable Integer idPublicacion,
                                                               @RequestParam Integer idAdmin) {
        try {
            Publicacion autorizada = publicacionService.autorizarPublicacion(idPublicacion, idAdmin);
            return ResponseEntity.ok(PublicacionMapper.toDTO(autorizada));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Rechazar publicación (por un admin)
    @PutMapping("/{idPublicacion}/rechazar")
    @Operation(summary = "Rechazar publicación", description = "Rechaza una publicación específica. Solo un administrador puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicación rechazada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Error al rechazar publicación")
    })
    public ResponseEntity<PublicacionDTO> rechazarPublicacion(
            @PathVariable Integer idPublicacion,
            @RequestParam Integer idAdmin,
            @RequestBody Map<String, String> body) {
        try {
            String motivoRechazo = body.get("motivoRechazo");
            Publicacion rechazada = publicacionService.rechazarPublicacion(idPublicacion, idAdmin, motivoRechazo);
            return ResponseEntity.ok(PublicacionMapper.toDTO(rechazada));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Actualizar publicación (solo dueño o admin/master)
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar publicación", description = "Actualiza los detalles de una publicación específica. Solo el dueño o un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicación actualizada exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para actualizar esta publicación"),
        @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
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
    @Operation(summary = "Eliminar publicación", description = "Elimina una publicación específica. Solo el dueño o un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Publicación eliminada exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para eliminar esta publicación"),
        @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
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




