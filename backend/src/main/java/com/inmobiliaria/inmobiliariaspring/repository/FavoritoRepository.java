package com.inmobiliaria.inmobiliariaspring.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.model.Favorito.FavoritoId;

public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {
    // Método para buscar un favorito por ID cliente y ID inmueble
    Optional<Favorito> findByIdClienteAndIdInmueble(Integer idCliente, Integer idInmueble);
    
    // Método para eliminar un favorito por ID cliente y ID inmueble
    @Transactional
    void deleteByIdClienteAndIdInmueble(Integer idCliente, Integer idInmueble);
    
    // NUEVO: Método para obtener todos los favoritos de un cliente
    List<Favorito> findByIdCliente(Integer idCliente);
}