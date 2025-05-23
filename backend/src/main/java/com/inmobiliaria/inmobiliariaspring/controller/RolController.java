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

}
