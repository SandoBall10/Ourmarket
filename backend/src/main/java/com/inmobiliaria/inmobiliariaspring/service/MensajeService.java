package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.model.Mensaje;
import com.inmobiliaria.inmobiliariaspring.repository.MensajeRepository;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    //crear un nuevo mensaje
    public Mensaje crearMensaje(Mensaje mensaje) {
        return mensajeRepository.save(mensaje);
    }

    //listar todos los mensajes
    public List<Mensaje> listarMensajes() {
        return mensajeRepository.findAll();
    }

    //obtener un mensaje por ID
    public Optional<Mensaje> obtenerMensajePorId(Integer id) {
        return mensajeRepository.findById(id);
    }

    //actualizar un mensaje
    public Mensaje actualizarMensaje(Integer id, Mensaje mensajeActualizado) {
        Optional<Mensaje> mensajeExistente = mensajeRepository.findById(id);
        if (mensajeExistente.isPresent()) {
            Mensaje mensaje = mensajeExistente.get();
            mensaje.setContenido(mensajeActualizado.getContenido());
            mensaje.setTipoMensaje(mensajeActualizado.getTipoMensaje());
            mensaje.setCliente(mensajeActualizado.getCliente());
            mensaje.setInmueble(mensajeActualizado.getInmueble());
            return mensajeRepository.save(mensaje);
        } else {
            return null;
        }
    }

    //eliminar un mensaje
    public void eliminarMensaje(Integer id) {
        mensajeRepository.deleteById(id);
    }
}