package com.inmobiliaria.inmobiliariaspring.controller;

import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @GetMapping
    public List<Administrador> getAll() {
        return administradorService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Administrador> getById(@PathVariable Integer id) {
        Optional<Administrador> admin = administradorService.findById(id);
        return admin.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Administrador> getByUsername(@PathVariable String username) {
        Optional<Administrador> admin = administradorService.findByUsername(username);
        return admin.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Administrador create(@RequestBody Administrador administrador) {
        return administradorService.save(administrador);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Administrador> update(@PathVariable Integer id, @RequestBody Administrador administrador) {
        Optional<Administrador> existing = administradorService.findById(id);
        if (existing.isPresent()) {
            administrador.setIdAdmin(id);
            return ResponseEntity.ok(administradorService.save(administrador));
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
