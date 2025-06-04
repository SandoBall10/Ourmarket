package com.inmobiliaria.inmobiliariaspring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inmobiliaria.inmobiliariaspring.model.Administrador;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    Optional<Administrador> findByUsername(String username);
}
