package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.inmobiliaria.inmobiliariaspring.model.Rol;
import com.inmobiliaria.inmobiliariaspring.service.RolService;

@RestController
@RequestMapping("/api/roles")
public class RolController {
    @Autowired
    private RolService rolService;

    // Crear un nuevo rol
    @PostMapping("/crear")
    public ResponseEntity<Rol> crearRol(@RequestBody Rol rol) {
        Rol nuevoRol = rolService.crearRol(rol);
        return ResponseEntity.ok(nuevoRol); // Devuelve el rol creado
    }

    // Listar todos los roles
    @GetMapping
    public List<Rol> listarRoles() {
        return rolService.listarRoles(); // Devuelve todos los roles
    }

    // Obtener un rol por ID
    @GetMapping("/{id}")
    public ResponseEntity<Rol> obtenerRolPorId(@PathVariable Integer id) {
        return rolService.obtenerRolPorId(id)
            .map(ResponseEntity::ok)  // Si existe, devuelve el rol
            .orElse(ResponseEntity.notFound().build()); // Si no se encuentra, responde con 404
    }

    // Actualizar un rol
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Rol> actualizarRol(@PathVariable Integer id, @RequestBody Rol rolActualizado) {
        Rol rol = rolService.actualizarRol(id, rolActualizado);
        if (rol == null) {
            return ResponseEntity.notFound().build(); // Si no se encuentra el rol, responde con 404
        }
        return ResponseEntity.ok(rol); // Devuelve el rol actualizado
    }

    // Eliminar un rol
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Integer id) {
        rolService.eliminarRol(id);
        return ResponseEntity.noContent().build(); // Responde con 204 No Content (sin cuerpo)
    }

}
