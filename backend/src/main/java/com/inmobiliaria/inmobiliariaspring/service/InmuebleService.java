package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.repository.InmuebleRepository;

@Service
public class InmuebleService {

    @Autowired
    private InmuebleRepository inmuebleRepository;

    //crear un nuevo inmueble
    public Inmueble crearInmueble(Inmueble inmueble) {
        return inmuebleRepository.save(inmueble);
    }

    //listar todos los inmuebles
    public List<Inmueble> listarInmuebles() {
        return inmuebleRepository.findAll();
    }

    //obtener un inmueble por ID
    public Optional<Inmueble> obtenerInmueblePorId(Integer id) {
        return inmuebleRepository.findById(id);
    }

    //actualizar un inmueble
    public Inmueble actualizarInmueble(Integer id, Inmueble inmuebleActualizado) {
        Optional<Inmueble> inmuebleExistente = inmuebleRepository.findById(id);
        if (inmuebleExistente.isPresent()) {
            Inmueble inmueble = inmuebleExistente.get();
            inmueble.setTitulo(inmuebleActualizado.getTitulo());
            inmueble.setDescripcion(inmuebleActualizado.getDescripcion());
            inmueble.setPrecio(inmuebleActualizado.getPrecio());
            inmueble.setTipo(inmuebleActualizado.getTipo());
            inmueble.setEstado(inmuebleActualizado.getEstado());
            inmueble.setUbicacion(inmuebleActualizado.getUbicacion());
            inmueble.setAutorizado(inmuebleActualizado.getAutorizado());
            inmueble.setCliente(inmuebleActualizado.getCliente());
            inmueble.setImagenes(inmuebleActualizado.getImagenes());
            return inmuebleRepository.save(inmueble);
        } else {
            return null;
        }
    }

    //eliminar un inmueble
    public void eliminarInmueble(Integer id) {
        inmuebleRepository.deleteById(id);
    }
}