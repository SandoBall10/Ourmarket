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

    //crear un nuevo rol
    public Rol crearRol(Rol rol) {
        return rolRepository.save(rol);
    }

    //listar todos los roles
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    //obtener un rol por ID
    public Optional<Rol> obtenerRolPorId(Integer id) {
        return rolRepository.findById(id);
    }

    //actualizar un rol
    public Rol actualizarRol(Integer id, Rol rolActualizado) {
        Optional<Rol> rolExistente = rolRepository.findById(id);
        if (rolExistente.isPresent()) {
            Rol rol = rolExistente.get();
            rol.setNombre(rolActualizado.getNombre());
            return rolRepository.save(rol);
        } else {
            return null;
        }
    }

    //eliminar un rol
    public void eliminarRol(Integer id) {
        rolRepository.deleteById(id);
    }
}