package com.inmobiliaria.inmobiliariaspring.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.service.InmuebleService;

@RestController
@RequestMapping("/api/inmuebles")
public class InmuebleController {

    @Autowired
    private InmuebleService inmuebleService;

    // Crear inmueble
    @PostMapping("/crear")
    public ResponseEntity<Inmueble> crearInmueble(@RequestBody Inmueble inmueble) {
        Inmueble nuevoInmueble = inmuebleService.crearInmueble(inmueble);
        return ResponseEntity.ok(nuevoInmueble);
    }

    // Listar todos los inmuebles
    @GetMapping
    public List<Inmueble> listarInmuebles() {
        return inmuebleService.listarInmuebles();
    }

    // Obtener inmueble por ID
    @GetMapping("/{id}")
    public ResponseEntity<Inmueble> obtenerInmueblePorId(@PathVariable Integer id) {
        return inmuebleService.obtenerInmueblePorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar inmueble
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Inmueble> actualizarInmueble(@PathVariable Integer id, @RequestBody Inmueble inmuebleActualizado) {
        Inmueble actualizado = inmuebleService.actualizarInmueble(id, inmuebleActualizado);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar inmueble
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarInmueble(@PathVariable Integer id) {
        inmuebleService.eliminarInmueble(id);
        return ResponseEntity.noContent().build();
    }

     // Marcar un inmueble como vendido (administrador)
     @PutMapping("/marcar-como-vendido/{id}")
     public ResponseEntity<Inmueble> marcarComoVendido(@PathVariable Integer id) {
         try {
             Inmueble inmuebleVendido = inmuebleService.marcarComoVendido(id); // Método en el Service
             return ResponseEntity.ok(inmuebleVendido);
         } catch (RuntimeException e) {
             return ResponseEntity.badRequest().body(null); // En caso de error (por ejemplo, si ya está vendido)
         }
     }
}



