package com.inmobiliaria.inmobiliariaspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inmobiliaria.inmobiliariaspring.model.Mensaje;

public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {
}