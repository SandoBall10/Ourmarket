package com.inmobiliaria.inmobiliariaspring.controller;

import com.inmobiliaria.inmobiliariaspring.dto.FavoritoDTO;
import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.service.FavoritoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @PostMapping("/crear")
    @Operation(summary = "Crear un favorito")
    public ResponseEntity<?> crearFavorito(@RequestBody FavoritoDTO favoritoDTO) {
        try {
            System.out.println("=== CREAR FAVORITO ===");
            System.out.println("ID Cliente: " + favoritoDTO.getId_cliente());
            System.out.println("ID Inmueble: " + favoritoDTO.getId_inmueble());
            
            if (favoritoDTO.getId_cliente() == null || favoritoDTO.getId_inmueble() == null) {
                System.out.println("ERROR: ID cliente o inmueble es null");
                return ResponseEntity.badRequest().body("ID cliente e inmueble son requeridos");
            }
            
            Favorito favorito = new Favorito();
            favorito.setIdCliente(favoritoDTO.getId_cliente());
            favorito.setIdInmueble(favoritoDTO.getId_inmueble());
            
            Favorito favoritoCreado = favoritoService.agregarFavorito(favorito);

            FavoritoDTO respuesta = new FavoritoDTO();
            respuesta.setId_cliente(favoritoCreado.getIdCliente());
            respuesta.setId_inmueble(favoritoCreado.getIdInmueble());

            System.out.println("Favorito creado exitosamente");
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            System.out.println("ERROR al crear favorito: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{userId}")
    @Operation(summary = "Obtener favoritos de un usuario")
    public ResponseEntity<?> obtenerFavoritosPorUsuario(@PathVariable Integer userId) {
        try {
            System.out.println("=== OBTENER FAVORITOS ===");
            System.out.println("Usuario ID: " + userId);
            
            List<FavoritoDTO> favoritos = favoritoService.obtenerFavoritosPorCliente(userId);
            System.out.println("Favoritos encontrados: " + favoritos.size());
            
            for (FavoritoDTO fav : favoritos) {
                System.out.println("- Cliente: " + fav.getId_cliente() + ", Inmueble: " + fav.getId_inmueble());
            }
            
            return ResponseEntity.ok(favoritos);
        } catch (Exception e) {
            System.out.println("ERROR al obtener favoritos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar")
    @Operation(summary = "Eliminar un favorito")
    public ResponseEntity<?> eliminarFavorito(@RequestBody FavoritoDTO favoritoDTO) {
        try {
            System.out.println("=== ELIMINAR FAVORITO ===");
            System.out.println("ID Cliente: " + favoritoDTO.getId_cliente());
            System.out.println("ID Inmueble: " + favoritoDTO.getId_inmueble());
            
            if (favoritoDTO.getId_cliente() == null || favoritoDTO.getId_inmueble() == null) {
                return ResponseEntity.badRequest().body("ID cliente e inmueble son requeridos");
            }
            
            favoritoService.eliminarFavorito(favoritoDTO.getId_cliente(), favoritoDTO.getId_inmueble());
            System.out.println("Favorito eliminado exitosamente");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("ERROR al eliminar favorito: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno del servidor: " + e.getMessage());
        }
    }

    @GetMapping
    public List<FavoritoDTO> listarFavoritos() {
        return favoritoService.listarFavoritos();
    }

    @GetMapping("/{clienteId}/{inmuebleId}")
    public ResponseEntity<FavoritoDTO> obtenerFavorito(@PathVariable Integer clienteId, 
                                                       @PathVariable Integer inmuebleId) {
        return favoritoService.obtenerFavorito(clienteId, inmuebleId)
            .map(favorito -> {
                FavoritoDTO dto = new FavoritoDTO();
                dto.setId_cliente(favorito.getIdCliente());
                dto.setId_inmueble(favorito.getIdInmueble());
                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}