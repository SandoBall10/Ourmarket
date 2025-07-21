package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.dto.FavoritoDTO;
import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.repository.FavoritoRepository;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    // Agregar un favorito
    public Favorito agregarFavorito(Favorito favorito) {
        try {
            // Verificar si ya existe para evitar duplicados
            Optional<Favorito> existente = favoritoRepository.findByIdClienteAndIdInmueble(
                favorito.getIdCliente(), favorito.getIdInmueble());
            
            if (existente.isPresent()) {
                System.out.println("Favorito ya existe, devolviendo existente");
                return existente.get();
            }
            
            System.out.println("Guardando nuevo favorito en BD");
            return favoritoRepository.save(favorito);
        } catch (Exception e) {
            System.out.println("Error en agregarFavorito: " + e.getMessage());
            throw e;
        }
    }

    // NUEVO: Obtener favoritos por cliente
    public List<FavoritoDTO> obtenerFavoritosPorCliente(Integer idCliente) {
        try {
            // Usar el método específico del repository
            List<Favorito> favoritos = favoritoRepository.findByIdCliente(idCliente);
            System.out.println("Favoritos encontrados en BD: " + favoritos.size());
            
            return favoritos.stream()
                .map(favorito -> {
                    FavoritoDTO dto = new FavoritoDTO();
                    dto.setId_cliente(favorito.getIdCliente());
                    dto.setId_inmueble(favorito.getIdInmueble());
                    
                    // Si tienes acceso a la entidad Inmueble, puedes setear más información
                    if (favorito.getInmueble() != null) {
                        dto.setDireccion(favorito.getInmueble().getDireccion());
                        dto.setPrecio(favorito.getInmueble().getPrecio() != null ? 
                            favorito.getInmueble().getPrecio().toString() : null);
                        dto.setImagenes(favorito.getInmueble().getImagenes());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error en obtenerFavoritosPorCliente: " + e.getMessage());
            throw e;
        }
    }

    // Listar todos los favoritos
    public List<FavoritoDTO> listarFavoritos() {
        return favoritoRepository.findAll().stream().map(favorito -> {
            FavoritoDTO dto = new FavoritoDTO();
            dto.setId_cliente(favorito.getIdCliente());
            dto.setId_inmueble(favorito.getIdInmueble());
            
            if (favorito.getInmueble() != null) {
                dto.setDireccion(favorito.getInmueble().getDireccion());
                dto.setPrecio(favorito.getInmueble().getPrecio() != null ? 
                    favorito.getInmueble().getPrecio().toString() : null);
                dto.setImagenes(favorito.getInmueble().getImagenes());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    // Obtener un favorito por cliente ID e inmueble ID
    public Optional<Favorito> obtenerFavorito(Integer idCliente, Integer idInmueble) {
        return favoritoRepository.findByIdClienteAndIdInmueble(idCliente, idInmueble);
    }

    // Eliminar un favorito por cliente ID e inmueble ID
    public void eliminarFavorito(Integer idCliente, Integer idInmueble) {
        try {
            System.out.println("Eliminando favorito de BD: cliente=" + idCliente + ", inmueble=" + idInmueble);
            favoritoRepository.deleteByIdClienteAndIdInmueble(idCliente, idInmueble);
            System.out.println("Favorito eliminado de BD");
        } catch (Exception e) {
            System.out.println("Error en eliminarFavorito: " + e.getMessage());
            throw e;
        }
    }
}