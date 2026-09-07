package com.inmobiliaria.inmobiliariaspring.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Publicacion;

public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {
	Optional<Publicacion> findByInmueble_IdInmueble(Integer idInmueble);

	@Query("""
			SELECT p FROM Publicacion p JOIN p.inmueble i
			WHERE p.autorizado = 2
			AND (:tipo IS NULL OR i.tipo = :tipo)
			AND (:precioMin IS NULL OR i.precio >= :precioMin)
			AND (:precioMax IS NULL OR i.precio <= :precioMax)
			AND (:region IS NULL OR LOWER(i.region) = LOWER(:region))
			AND (:distrito IS NULL OR LOWER(i.distrito) = LOWER(:distrito))
			AND (:habitaciones IS NULL OR i.num_habitaciones = :habitaciones)
			AND (
				:q IS NULL OR LOWER(p.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
				OR LOWER(COALESCE(i.direccion, '')) LIKE LOWER(CONCAT('%', :q, '%'))
				OR LOWER(COALESCE(i.distrito, '')) LIKE LOWER(CONCAT('%', :q, '%'))
			)
			""")
	List<Publicacion> buscarCatalogo(
			@Param("tipo") Inmueble.Tipo tipo,
			@Param("precioMin") BigDecimal precioMin,
			@Param("precioMax") BigDecimal precioMax,
			@Param("region") String region,
			@Param("distrito") String distrito,
			@Param("habitaciones") Integer habitaciones,
			@Param("q") String q);
}
