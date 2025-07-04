package com.inmobiliaria.inmobiliariaspring.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.inmobiliaria.inmobiliariaspring.dto.InmuebleDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.InmuebleMapper;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.service.InmuebleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/inmuebles")
public class InmuebleController implements WebMvcConfigurer {

    @Autowired
    private InmuebleService inmuebleService;

    @PostMapping("/crear")
    @Operation(summary = "Crear un inmueble", description = "Crea un nuevo inmueble asociado al usuario autenticado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inmueble creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    public ResponseEntity<InmuebleDTO> crearInmueble(@RequestBody Inmueble inmueble, Authentication authentication) {
        Inmueble nuevoInmueble = inmuebleService.crearInmueble(inmueble, authentication.getName());
        return ResponseEntity.ok(InmuebleMapper.toDTO(nuevoInmueble));
    }

    

    @GetMapping
    @Operation(summary = "Listar todos los inmuebles", description = "Obtiene una lista de todos los inmuebles registrados.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de inmuebles obtenida exitosamente")
    })
    public List<InmuebleDTO> listarInmuebles() {
        return inmuebleService.listarInmuebles()
                .stream()
                .map(InmuebleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener inmueble por ID", description = "Obtiene los datos de un inmueble específico por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inmueble encontrado"),
        @ApiResponse(responseCode = "404", description = "Inmueble no encontrado")
    })
    public ResponseEntity<InmuebleDTO> obtenerInmueblePorId(@PathVariable Integer id) {
        return inmuebleService.obtenerInmueblePorId(id)
                .map(InmuebleMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
    @Operation(summary = "Actualizar inmueble", description = "Actualiza los datos de un inmueble específico. Solo el dueño o un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inmueble actualizado exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para actualizar este inmueble"),
        @ApiResponse(responseCode = "404", description = "Inmueble no encontrado")
    })
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

    @DeleteMapping("/eliminar/{id}")
    @Operation(summary = "Eliminar inmueble", description = "Elimina un inmueble específico. Solo el dueño o un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Inmueble eliminado exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para eliminar este inmueble"),
        @ApiResponse(responseCode = "404", description = "Inmueble no encontrado")
    })
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
    @Operation(summary = "Subir imágenes a un inmueble", description = "Sube imágenes a un inmueble específico. Solo el dueño o un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Imágenes subidas exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para modificar este inmueble"),
        @ApiResponse(responseCode = "404", description = "Inmueble no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error al subir imágenes")
    })
    public ResponseEntity<?> subirImagenes(
            @PathVariable Integer id,
            @RequestParam("imagenes") List<MultipartFile> imagenes) {

        Optional<Inmueble> inmuebleOpt = inmuebleService.obtenerInmueblePorId(id);
        if (inmuebleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Inmueble inmueble = inmuebleOpt.get();

        String uploadDir = System.getProperty("user.dir") + "/assets/inmuebles/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        StringBuilder nombres = new StringBuilder();
        for (MultipartFile imagen : imagenes) {
            if (!imagen.isEmpty()) {
                String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                File destino = new File(uploadDir + nombreArchivo);
                try {
                    imagen.transferTo(destino);
                    nombres.append(nombreArchivo).append(";");
                } catch (Exception e) {
                    return ResponseEntity.status(500).body("Error guardando imagen: " + nombreArchivo);
                }
            }
        }

        // Quitar el último punto y coma si hay imágenes
        if (nombres.length() > 0) {
            nombres.setLength(nombres.length() - 1);
            inmueble.setImagenes(nombres.toString());
            inmuebleService.actualizarImagenesInmueble(id, nombres.toString());
        }

        return ResponseEntity.ok("Imágenes subidas correctamente");
    }

    @PutMapping("/marcar-como-vendido/{id}")
    @Operation(summary = "Marcar inmueble como vendido", description = "Marca un inmueble como vendido. Solo un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inmueble marcado como vendido exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para realizar esta acción"),
        @ApiResponse(responseCode = "400", description = "Error al marcar como vendido")
    })
    public ResponseEntity<InmuebleDTO> marcarComoVendido(@PathVariable Integer id, Authentication authentication) {
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_CLIENTE"));
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

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/assets/inmuebles/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/assets/inmuebles/");
    }
}