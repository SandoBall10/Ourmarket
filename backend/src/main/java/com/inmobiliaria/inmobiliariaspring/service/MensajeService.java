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
    public Mensaje crearMensaje(String contenido,  Integer inmuebleId, Cliente cliente, TipoMensaje tipoMensaje) {
        // Validar que el contenido no sea nulo o vacío
        if (contenido == null || contenido.trim().isEmpty()) {
            throw new IllegalArgumentException("El contenido del mensaje no puede estar vacío.");
        }
        // Verificar si el inmueble existe
        Inmueble inmueble = inmuebleRepository.findById(inmuebleId)
            .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));

        // Crear el mensaje usando el Factory
        Mensaje nuevoMensaje = MensajeFactory.crearMensaje(contenido, cliente, inmueble, tipoMensaje);

        // Guardar el mensaje en la base de datos
        return mensajeRepository.save(nuevoMensaje);
    }

    // Listar mensajes de un inmueble según el usuario autenticado
    public List<Mensaje> listarMensajesPorInmuebleParaUsuario(Integer inmuebleId, Cliente usuario) {
        Inmueble inmueble = inmuebleRepository.findById(inmuebleId)
            .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));

        // Si el usuario es dueño del inmueble, ve todos los mensajes
        if (inmueble.getCliente().getIdCliente().equals(usuario.getIdCliente())) {
            return mensajeRepository.findByInmueble(inmueble);
        }
        // Si no, solo ve los mensajes que él envió sobre ese inmueble
        return mensajeRepository.findByInmuebleAndCliente(inmueble, usuario);
    }

    public Optional<Mensaje> obtenerMensajePorId(Integer id) {
        return mensajeRepository.findById(id);
    }

    public List<Mensaje> listarMensajesPorInmueble(Integer idInmueble) {
    // Suponiendo que tienes un MensajeRepository con este método:
    return mensajeRepository.findByInmueble_IdInmueble(idInmueble);
}

    public Optional<Mensaje> obtenerMensajePorIdParaCliente(Integer id, Cliente cliente) {
        Optional<Mensaje> mensajeOpt = mensajeRepository.findById(id);
        if (mensajeOpt.isPresent()) {
            Mensaje mensaje = mensajeOpt.get();
            boolean esRemitente = mensaje.getCliente().getIdCliente().equals(cliente.getIdCliente());
            boolean esDueno = mensaje.getInmueble().getCliente().getIdCliente().equals(cliente.getIdCliente());
            if (esRemitente || esDueno) {
                return Optional.of(mensaje);
            }
        }
        return Optional.empty();
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