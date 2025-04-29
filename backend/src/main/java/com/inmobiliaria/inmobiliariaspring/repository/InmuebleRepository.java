package com.inmobiliaria.inmobiliariaspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inmobiliaria.inmobiliariaspring.model.Inmueble;

public interface InmuebleRepository extends JpaRepository<Inmueble, Integer> {
}