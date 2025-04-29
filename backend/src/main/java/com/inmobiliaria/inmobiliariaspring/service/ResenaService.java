package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.model.Resena;
import com.inmobiliaria.inmobiliariaspring.repository.ResenaRepository;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    //crear una nueva reseña
    public Resena crearResena(Resena resena) {
        return resenaRepository.save(resena);
    }

    //listar todas las reseñas
    public List<Resena> listarResenas() {
        return resenaRepository.findAll();
    }

    //obtener una reseña por ID
    public Optional<Resena> obtenerResenaPorId(Integer id) {
        return resenaRepository.findById(id);
    }

    //actualizar una reseña
    public Resena actualizarResena(Integer id, Resena resenaActualizada) {
        Optional<Resena> resenaExistente = resenaRepository.findById(id);
        if (resenaExistente.isPresent()) {
            Resena resena = resenaExistente.get();
            resena.setComentario(resenaActualizada.getComentario());
            resena.setEstrellas(resenaActualizada.getEstrellas());
            resena.setCliente(resenaActualizada.getCliente());
            resena.setInmueble(resenaActualizada.getInmueble());
            return resenaRepository.save(resena);
        } else {
            return null;
        }
    }

    //eliminar una reseña
    public void eliminarResena(Integer id) {
        resenaRepository.deleteById(id);
    }
}