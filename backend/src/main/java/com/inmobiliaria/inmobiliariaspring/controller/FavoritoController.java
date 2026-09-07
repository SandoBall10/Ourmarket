package com.inmobiliaria.inmobiliariaspring.controller;

import com.inmobiliaria.inmobiliariaspring.dto.FavoritoDTO;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.security.AuthAccess;
import com.inmobiliaria.inmobiliariaspring.service.FavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private AuthAccess authAccess;

    @PostMapping("/crear")
    @Operation(summary = "Crear un favorito")
    public ResponseEntity<?> crearFavorito(@RequestBody FavoritoDTO favoritoDTO, Authentication authentication) {
        try {
            if (favoritoDTO.getId_inmueble() == null) {
                return ResponseEntity.badRequest().body("ID inmueble es requerido");
            }

            Integer clienteId = resolverClienteId(favoritoDTO.getId_cliente(), authentication);
            Favorito favorito = new Favorito();
            favorito.setIdCliente(clienteId);
            favorito.setIdInmueble(favoritoDTO.getId_inmueble());

            Favorito favoritoCreado = favoritoService.agregarFavorito(favorito);

            FavoritoDTO respuesta = new FavoritoDTO();
            respuesta.setId_cliente(favoritoCreado.getIdCliente());
            respuesta.setId_inmueble(favoritoCreado.getIdInmueble());
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{userId}")
    @Operation(summary = "Obtener favoritos de un usuario")
    public ResponseEntity<?> obtenerFavoritosPorUsuario(@PathVariable Integer userId, Authentication authentication) {
        authAccess.requireClienteAccess(userId, authentication);
        return ResponseEntity.ok(favoritoService.obtenerFavoritosPorCliente(userId));
    }

    @DeleteMapping("/eliminar")
    @Operation(summary = "Eliminar un favorito")
    public ResponseEntity<?> eliminarFavorito(@RequestBody FavoritoDTO favoritoDTO, Authentication authentication) {
        if (favoritoDTO.getId_inmueble() == null) {
            return ResponseEntity.badRequest().body("ID inmueble es requerido");
        }
        Integer clienteId = resolverClienteId(favoritoDTO.getId_cliente(), authentication);
        favoritoService.eliminarFavorito(clienteId, favoritoDTO.getId_inmueble());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> listarFavoritos(Authentication authentication) {
        if (!authAccess.isAdmin(authentication)) {
            return ResponseEntity.status(403).body("Solo un administrador puede listar todos los favoritos");
        }
        return ResponseEntity.ok(favoritoService.listarFavoritos());
    }

    @GetMapping("/{clienteId}/{inmuebleId}")
    public ResponseEntity<FavoritoDTO> obtenerFavorito(@PathVariable Integer clienteId,
                                                       @PathVariable Integer inmuebleId,
                                                       Authentication authentication) {
        authAccess.requireClienteAccess(clienteId, authentication);
        return favoritoService.obtenerFavorito(clienteId, inmuebleId)
            .map(favorito -> {
                FavoritoDTO dto = new FavoritoDTO();
                dto.setId_cliente(favorito.getIdCliente());
                dto.setId_inmueble(favorito.getIdInmueble());
                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private Integer resolverClienteId(Integer solicitado, Authentication authentication) {
        if (authAccess.isAdmin(authentication) && solicitado != null) {
            return solicitado;
        }
        Cliente cliente = authAccess.requireCliente(authentication);
        if (solicitado != null && !solicitado.equals(cliente.getIdCliente())) {
            authAccess.requireClienteAccess(solicitado, authentication);
        }
        return cliente.getIdCliente();
    }
}
