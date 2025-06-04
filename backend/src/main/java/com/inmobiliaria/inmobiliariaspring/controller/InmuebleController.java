package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

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