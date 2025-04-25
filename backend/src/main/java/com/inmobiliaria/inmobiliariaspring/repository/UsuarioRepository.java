package com.inmobiliaria.inmobiliariaspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;

@Repository
public interface UsuarioRepository extends JpaRepository<Cliente, Integer> {
    
}
