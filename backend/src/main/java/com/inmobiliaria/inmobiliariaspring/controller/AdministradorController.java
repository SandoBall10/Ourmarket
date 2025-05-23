package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;
import java.util.Optional;

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

import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.service.AdministradorService;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Administrador administrador) {
        if (administrador.getUsername() == null || administrador.getContrasena() == null) {
            return ResponseEntity.badRequest().body("Username y contraseña son obligatorios");
        }
        Administrador nuevoAdmin = administradorService.registrarAdministrador(administrador);
        return ResponseEntity.ok(nuevoAdmin);
    }


    @PostMapping("/login")
    public ResponseEntity<Administrador> login(@RequestBody Administrador loginRequest) {
        Optional<Administrador> adminOpt = administradorService.login(loginRequest.getUsername(), loginRequest.getContrasena());
        return adminOpt.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.status(401).build());
    }

    
    @GetMapping
    public List<Administrador> getAll() {
        return administradorService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Administrador> getById(@PathVariable Integer id) {
        Optional<Administrador> admin = administradorService.findById(id);
        return admin.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    
    @PutMapping("/{id}")
    public ResponseEntity<Administrador> update(@PathVariable Integer id, @RequestBody Administrador administrador) {
        Optional<Administrador> existing = administradorService.findById(id);
        if (existing.isPresent()) {
            administrador.setIdAdmin(id);
            return ResponseEntity.ok(administradorService.registrarAdministrador(administrador));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (administradorService.findById(id).isPresent()) {
            administradorService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
