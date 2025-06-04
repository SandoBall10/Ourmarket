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
import org.springframework.web.bind.annotation.RestController;

import com.inmobiliaria.inmobiliariaspring.dto.ActualizarMensajeDTO;
import com.inmobiliaria.inmobiliariaspring.dto.MensajeDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.MensajeMapper;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje.TipoMensaje;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.service.MensajeService;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {
    @Autowired
    private MensajeService mensajeService;

    @Autowired
    private ClienteRepository clienteRepository;

    // Crear mensaje (solo CLIENTE)
    @PostMapping("/crear")
    public ResponseEntity<MensajeDTO> crearMensaje(@RequestBody Map<String, Object> payload, Authentication authentication) {
        String username = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        if (esAdmin) {
            return ResponseEntity.status(403).build(); // Solo clientes pueden crear mensajes
        }

        Cliente cliente = clienteRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        try {
            String contenido = (String) payload.get("contenido");
            Integer inmuebleId = (Integer) payload.get("inmuebleId");
            String tipo = (String) payload.get("tipoMensaje");
            TipoMensaje tipoMensaje = TipoMensaje.valueOf(tipo);

            Mensaje nuevoMensaje = mensajeService.crearMensaje(
                contenido,
                inmuebleId,
                cliente,
                tipoMensaje
            );
            return ResponseEntity.ok(MensajeMapper.toDTO(nuevoMensaje));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Listar mensajes de un inmueble
    @GetMapping("/inmueble/{idInmueble}")
    public ResponseEntity<List<MensajeDTO>> listarMensajesPorInmueble(
            @PathVariable Integer idInmueble,
            Authentication authentication) {
        String username = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        List<Mensaje> mensajes;
        if (esAdmin) {
            // Admin/Master: ven todos los mensajes del inmueble
            mensajes = mensajeService.listarMensajesPorInmueble(idInmueble);
        } else {
            // Cliente: solo sus mensajes (como remitente o dueño del inmueble)
            Cliente cliente = clienteRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            mensajes = mensajeService.listarMensajesPorInmuebleParaUsuario(idInmueble, cliente);
        }
        List<MensajeDTO> mensajeDTOs = mensajes.stream()
            .map(MensajeMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(mensajeDTOs);
    }

    // Obtener mensaje por ID
    @GetMapping("/{id}")
    public ResponseEntity<MensajeDTO> obtenerMensajePorId(@PathVariable Integer id, Authentication authentication) {
        String username = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        Mensaje mensaje = mensajeService.obtenerMensajePorId(id).orElse(null);
        if (mensaje == null) return ResponseEntity.notFound().build();

        if (esAdmin) {
            return ResponseEntity.ok(MensajeMapper.toDTO(mensaje));
        }

        Cliente cliente = clienteRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Solo si es remitente o dueño del inmueble
        if (mensaje.getCliente().getIdCliente().equals(cliente.getIdCliente()) ||
            mensaje.getInmueble().getCliente().getIdCliente().equals(cliente.getIdCliente())) {
            return ResponseEntity.ok(MensajeMapper.toDTO(mensaje));
        }
        return ResponseEntity.status(403).build();
    }

    // Actualizar mensaje
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<MensajeDTO> actualizarMensaje(@PathVariable Integer id, @RequestBody ActualizarMensajeDTO dto, Authentication authentication) {
        System.out.println("DTO recibido: contenido=" + dto.getContenido() + ", tipoMensaje=" + dto.getTipoMensaje());
        String username = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        Mensaje mensajeExistente = mensajeService.obtenerMensajePorId(id).orElse(null);
        if (mensajeExistente == null) return ResponseEntity.notFound().build();

        if (!esAdmin) {
            // Solo el remitente puede actualizar su mensaje
            if (!mensajeExistente.getCliente().getEmail().equals(username)) {
                return ResponseEntity.status(403).build();
            }
        }

        try {
            Mensaje.TipoMensaje tipo = Mensaje.TipoMensaje.valueOf(
                dto.getTipoMensaje().toLowerCase()
            );
            Mensaje mensajeActualizado = mensajeService.actualizarMensaje(id, dto.getContenido(), tipo);
            return ResponseEntity.ok(MensajeMapper.toDTO(mensajeActualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar mensaje
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable Integer id, Authentication authentication) {
        String username = authentication.getName();
        boolean esAdmin = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MASTER"));

        Mensaje mensajeExistente = mensajeService.obtenerMensajePorId(id).orElse(null);
        if (mensajeExistente == null) return ResponseEntity.notFound().build();

        if (!esAdmin) {
            // Solo el remitente puede eliminar su mensaje
            if (!mensajeExistente.getCliente().getEmail().equals(username)) {
                return ResponseEntity.status(403).build();
            }
        }

        try {
            mensajeService.eliminarMensaje(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}