package com.inmobiliaria.inmobiliariaspring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByEmail(String email);
}