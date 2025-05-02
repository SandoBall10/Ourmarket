package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.factory.MensajeFactory;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje.TipoMensaje;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.repository.InmuebleRepository;
import com.inmobiliaria.inmobiliariaspring.repository.MensajeRepository;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private InmuebleRepository inmuebleRepository;

    // Crear mensaje usando el Factory
    public Mensaje crearMensaje(String contenido, Integer clienteId, Integer inmuebleId, TipoMensaje tipoMensaje) {
        // Validar que el contenido no sea nulo o vacío
        if (contenido == null || contenido.trim().isEmpty()) {
            throw new IllegalArgumentException("El contenido del mensaje no puede estar vacío.");
        }

        // Verificar si el cliente existe
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Verificar si el inmueble existe
        Inmueble inmueble = inmuebleRepository.findById(inmuebleId)
            .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));

        // Crear el mensaje usando el Factory
        Mensaje nuevoMensaje = MensajeFactory.crearMensaje(contenido, cliente, inmueble, tipoMensaje);

        // Guardar el mensaje en la base de datos
        return mensajeRepository.save(nuevoMensaje);
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
    public Mensaje actualizarMensaje(Integer id, String contenido, TipoMensaje tipoMensaje) {
        Optional<Mensaje> mensajeExistente = mensajeRepository.findById(id);
        if (mensajeExistente.isPresent()) {
            Mensaje mensaje = mensajeExistente.get();
            mensaje.setContenido(contenido);
            mensaje.setTipoMensaje(tipoMensaje);
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