package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.inmobiliaria.inmobiliariaspring.dto.ActualizarMensajeDTO;
import com.inmobiliaria.inmobiliariaspring.dto.MensajeDTO;
import com.inmobiliaria.inmobiliariaspring.mappers.MensajeMapper;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje.TipoMensaje;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.service.MensajeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {

    @Autowired
    private MensajeService mensajeService;

    @Autowired
    private ClienteRepository clienteRepository;

    // Crear mensaje (solo CLIENTE)
    @PostMapping("/crear")
    @Operation(summary = "Crear mensaje", description = "Crea un nuevo mensaje asociado a un inmueble. Solo clientes pueden realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Mensaje creado exitosamente"),
        @ApiResponse(responseCode = "403", description = "Solo clientes pueden crear mensajes"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
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
    @Operation(summary = "Listar mensajes de un inmueble", description = "Obtiene todos los mensajes asociados a un inmueble. Los administradores/master ven todos los mensajes, mientras que los clientes solo ven los suyos.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Mensajes obtenidos exitosamente"),
        @ApiResponse(responseCode = "404", description = "Inmueble no encontrado")
    })
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
    @Operation(summary = "Obtener mensaje por ID", description = "Obtiene un mensaje específico por su ID. Los administradores/master tienen acceso completo, mientras que los clientes solo pueden acceder si son remitentes o dueños del inmueble.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Mensaje obtenido exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para acceder a este mensaje"),
        @ApiResponse(responseCode = "404", description = "Mensaje no encontrado")
    })
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
    @Operation(summary = "Actualizar mensaje", description = "Actualiza el contenido y tipo de un mensaje. Solo el remitente o un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Mensaje actualizado exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para actualizar este mensaje"),
        @ApiResponse(responseCode = "404", description = "Mensaje no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
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
    @Operation(summary = "Eliminar mensaje", description = "Elimina un mensaje específico. Solo el remitente o un administrador/master puede realizar esta acción.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Mensaje eliminado exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para eliminar este mensaje"),
        @ApiResponse(responseCode = "404", description = "Mensaje no encontrado")
    })
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