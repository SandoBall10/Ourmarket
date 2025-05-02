package com.inmobiliaria.inmobiliariaspring.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inmobiliaria.inmobiliariaspring.model.Mensaje;
import com.inmobiliaria.inmobiliariaspring.service.MensajeService;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {
    @Autowired
    private MensajeService mensajeService;

    // Crear mensaje
    @PostMapping("/crear")
    public ResponseEntity<Mensaje> crearMensaje(@RequestBody Mensaje mensaje) {
        try {
            // Convertir el tipo de mensaje (String) a TipoMensaje (enum)
            Mensaje.TipoMensaje tipo = Mensaje.TipoMensaje.valueOf(mensaje.getTipoMensaje().toString().toLowerCase());

            // Llamamos al servicio para crear el mensaje
            Mensaje nuevoMensaje = mensajeService.crearMensaje(
                mensaje.getContenido(),
                mensaje.getCliente().getIdCliente(),
                mensaje.getInmueble().getIdInmueble(),
                tipo
            );
            return ResponseEntity.ok(nuevoMensaje);
        } catch (IllegalArgumentException e) {
            // Si el String no corresponde a un valor de TipoMensaje
            return ResponseEntity.badRequest().body(null); // Responde con 400 (Bad Request)
        } catch (RuntimeException e) {
            // Si ocurre un error en el servicio
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Listar todos los mensajes
    @GetMapping
    public List<Mensaje> listarMensajes() {
        return mensajeService.listarMensajes();
    }

    // Obtener mensaje por ID
    @GetMapping("/{id}")
    public ResponseEntity<Mensaje> obtenerMensajePorId(@PathVariable Integer id) {
        return mensajeService.obtenerMensajePorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
public ResponseEntity<Mensaje> actualizarMensaje(@PathVariable Integer id, @RequestBody Mensaje mensaje) {
    try {
        // Convertir el tipo de mensaje (String) a TipoMensaje (enum)
        Mensaje.TipoMensaje tipo = Mensaje.TipoMensaje.valueOf(mensaje.getTipoMensaje().toString().toLowerCase());

        // Llamamos al servicio para actualizar el mensaje
        Mensaje mensajeActualizado = mensajeService.actualizarMensaje(id, mensaje.getContenido(), tipo);
        return ResponseEntity.ok(mensajeActualizado); // Devuelve el mensaje actualizado
    } catch (IllegalArgumentException e) {
        // Si el String no corresponde a un valor de TipoMensaje
        return ResponseEntity.badRequest().body(null); // Responde con 400 (Bad Request)
    } catch (RuntimeException e) {
        // Si ocurre un error en el servicio
        return ResponseEntity.notFound().build(); // Responde con 404 si no se encuentra el mensaje
    }
}

    // Eliminar un mensaje
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable Integer id) {
        try {
            mensajeService.eliminarMensaje(id);
            return ResponseEntity.noContent().build(); // Responde con 204 (sin contenido)
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Si no se encuentra el mensaje, responde con 404
        }
    }
}
