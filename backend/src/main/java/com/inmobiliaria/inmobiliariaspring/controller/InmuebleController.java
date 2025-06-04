package com.inmobiliaria.inmobiliariaspring.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.inmobiliaria.inmobiliariaspring.dto.InmuebleDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.InmuebleMapper;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.service.InmuebleService;

@RestController
@RequestMapping("/api/inmuebles")
public class InmuebleController {

    @Autowired
    private InmuebleService inmuebleService;

    // Crear inmueble (asocia al usuario autenticado)
    @PostMapping("/crear")
    public ResponseEntity<InmuebleDTO> crearInmueble(@RequestBody Inmueble inmueble, Authentication authentication) {
        Inmueble nuevoInmueble = inmuebleService.crearInmueble(inmueble, authentication.getName());
        return ResponseEntity.ok(InmuebleMapper.toDTO(nuevoInmueble));
    }

    // Listar todos los inmuebles
    @GetMapping
    public List<InmuebleDTO> listarInmuebles() {
        return inmuebleService.listarInmuebles()
                .stream()
                .map(InmuebleMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Obtener inmueble por ID
    @GetMapping("/{id}")
    public ResponseEntity<InmuebleDTO> obtenerInmueblePorId(@PathVariable Integer id) {
        return inmuebleService.obtenerInmueblePorId(id)
                .map(InmuebleMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar inmueble (solo dueño o admin/master)
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<InmuebleDTO> actualizarInmueble(@PathVariable Integer id, @RequestBody Inmueble inmuebleActualizado, Authentication authentication) {
        String emailUsuario = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        Inmueble inmueble = inmuebleService.obtenerInmueblePorId(id).orElse(null);
        if (inmueble == null) return ResponseEntity.notFound().build();

        if (!inmueble.getCliente().getEmail().equals(emailUsuario) && !esAdmin) {
            return ResponseEntity.status(403).body(null);
        }
        Inmueble actualizado = inmuebleService.actualizarInmueble(id, inmuebleActualizado);
        return ResponseEntity.ok(InmuebleMapper.toDTO(actualizado));
    }

    // Eliminar inmueble (solo dueño o admin/master)
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarInmueble(@PathVariable Integer id, Authentication authentication) {
        String emailUsuario = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        Inmueble inmueble = inmuebleService.obtenerInmueblePorId(id).orElse(null);
        if (inmueble == null) return ResponseEntity.notFound().build();

        if (!inmueble.getCliente().getEmail().equals(emailUsuario) && !esAdmin) {
            return ResponseEntity.status(403).body("No tienes permiso para eliminar este inmueble.");
        }
        inmuebleService.eliminarInmueble(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/imagenes")
    public ResponseEntity<?> subirImagenes(
            @PathVariable Integer id,
            @RequestParam("imagenes") List<MultipartFile> imagenes,
            Authentication authentication) {
        try {
            // Validar dueño o admin/master
            String emailUsuario = authentication.getName();
            boolean esAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

            Inmueble inmueble = inmuebleService.obtenerInmueblePorId(id).orElse(null);
            if (inmueble == null) return ResponseEntity.notFound().build();

            if (!inmueble.getCliente().getEmail().equals(emailUsuario) && !esAdmin) {
                return ResponseEntity.status(403).body("No tienes permiso para modificar este inmueble.");
            }
            
            List<String> nombresArchivos = new ArrayList<>();
            String carpetaDestino = "uploads/inmuebles"; // Cambia la ruta si lo necesitas

            // Crear carpeta si no existe
            Path carpetaPath = Paths.get(carpetaDestino);
            if (!Files.exists(carpetaPath)) {
                Files.createDirectories(carpetaPath);
            }

            for (MultipartFile imagen : imagenes) {
                String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                Path ruta = carpetaPath.resolve(nombreArchivo);
                Files.copy(imagen.getInputStream(), ruta);
                nombresArchivos.add(nombreArchivo);
            }

            // Guarda los nombres separados por coma en el campo 'imagenes'
            String nombresConcatenados = String.join(",", nombresArchivos);
            inmuebleService.actualizarImagenesInmueble(id, nombresConcatenados);

            return ResponseEntity.ok("Imágenes subidas y campo actualizado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al subir imágenes: " + e.getMessage());
        }
    }

    // Marcar un inmueble como vendido (solo admin/master)
    @PutMapping("/marcar-como-vendido/{id}")
    public ResponseEntity<InmuebleDTO> marcarComoVendido(@PathVariable Integer id, Authentication authentication) {
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));
        if (!esAdmin) {
            return ResponseEntity.status(403).body(null);
        }
        try {
            Inmueble inmuebleVendido = inmuebleService.marcarComoVendido(id);
            return ResponseEntity.ok(InmuebleMapper.toDTO(inmuebleVendido));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}