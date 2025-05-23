package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.model.Rol;
import com.inmobiliaria.inmobiliariaspring.repository.RolRepository;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    //listar todos los roles
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    //obtener un rol por ID
    public Optional<Rol> obtenerRolPorId(Integer id) {
        return rolRepository.findById(id);
    }

}