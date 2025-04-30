package com.inmobiliaria.inmobiliariaspring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.model.Favorito.FavoritoId;

public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {
    // Método para buscar un favorito por ID cliente y ID inmueble (ya que es una llave compuesta)
    // Se utiliza el nombre de la clase Favorito y no el nombre de la tabla favoritos
    Optional<Favorito> findByIdClienteAndIdInmueble(Integer idCliente, Integer idInmueble);
    void deleteByIdClienteAndIdInmueble(Integer idCliente, Integer idInmueble);
}