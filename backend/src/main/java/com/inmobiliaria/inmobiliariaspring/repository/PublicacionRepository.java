package com.inmobiliaria.inmobiliariaspring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inmobiliaria.inmobiliariaspring.model.Publicacion;

public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {
	Optional<Publicacion> findByInmueble_IdInmueble(Integer idInmueble);
}
