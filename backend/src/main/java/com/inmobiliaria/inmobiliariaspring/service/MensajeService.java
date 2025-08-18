package com.inmobiliaria.inmobiliariaspring.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.dto.ConversacionDTO;
import com.inmobiliaria.inmobiliariaspring.dto.MensajeDTO;
import com.inmobiliaria.inmobiliariaspring.factory.MensajeFactory;
import com.inmobiliaria.inmobiliariaspring.mappers.MensajeMapper; // AGREGAR: Import para uso estático
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje;
import com.inmobiliaria.inmobiliariaspring.model.Publicacion;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje.TipoMensaje;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.repository.InmuebleRepository;
import com.inmobiliaria.inmobiliariaspring.repository.MensajeRepository;
import com.inmobiliaria.inmobiliariaspring.repository.PublicacionRepository;

@Service
public class MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private InmuebleRepository inmuebleRepository;

    @Autowired
    private PublicacionRepository publicacionRepository;

    // ELIMINAR esta línea - no inyectar mapper estático
    // @Autowired
    // private MensajeMapper mensajeMapper;

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

    // CORREGIR el método obtenerConversacionesUsuario
    public List<ConversacionDTO> obtenerConversacionesUsuario(Integer idUsuario) {
        try {
            // Obtener mensajes donde el usuario es remitente o destinatario
            List<Mensaje> mensajesRemitente = mensajeRepository.findByCliente_IdCliente(idUsuario);
            List<Mensaje> mensajesDestinatario = mensajeRepository.findByInmueble_Cliente_IdCliente(idUsuario);
            
            // Combinar ambas listas y agrupar por inmueble
            Map<Integer, List<Mensaje>> mensajesPorInmueble = mensajesRemitente.stream()
                .collect(Collectors.groupingBy(mensaje -> mensaje.getInmueble().getIdInmueble()));
            
            // Agregar mensajes donde es destinatario
            mensajesDestinatario.forEach(mensaje -> {
                Integer idInmueble = mensaje.getInmueble().getIdInmueble();
                mensajesPorInmueble.computeIfAbsent(idInmueble, k -> new java.util.ArrayList<>()).add(mensaje);
            });
            
            return mensajesPorInmueble.entrySet().stream()
                .map(entry -> crearConversacionDTO(entry.getKey(), entry.getValue(), idUsuario))
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            System.err.println("Error al obtener conversaciones: " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    // CORREGIR el método crearConversacionDTO
    private ConversacionDTO crearConversacionDTO(Integer idInmueble, List<Mensaje> mensajes, Integer idUsuarioActual) {
        ConversacionDTO conversacion = new ConversacionDTO();
        conversacion.setIdInmueble(idInmueble);
        conversacion.setTotalMensajes(mensajes.size());
        
        // Encontrar el último mensaje
        Mensaje ultimoMensaje = mensajes.stream()
            .max((m1, m2) -> m1.getFechaEnvio().compareTo(m2.getFechaEnvio()))
            .orElse(null);
        
        if (ultimoMensaje != null) {
            conversacion.setUltimoMensaje(MensajeMapper.toDTO(ultimoMensaje)); // CORREGIR: usar método estático
            conversacion.setFechaUltimoMensaje(ultimoMensaje.getFechaEnvio());
        }
        
        // Obtener información del inmueble y publicación
        try {
            Optional<Inmueble> inmuebleOpt = inmuebleRepository.findById(idInmueble);
            if (inmuebleOpt.isPresent()) {
                Inmueble inmueble = inmuebleOpt.get();
                conversacion.setPropietarioNombre(inmueble.getCliente().getNombreCompleto());
                
                // Buscar la publicación asociada al inmueble
                Optional<Publicacion> publicacionOpt = publicacionRepository.findByInmueble_IdInmueble(idInmueble);
                if (publicacionOpt.isPresent()) {
                    conversacion.setTituloPublicacion(publicacionOpt.get().getTitulo());
                } else {
                    conversacion.setTituloPublicacion("Propiedad en " + 
                        (inmueble.getDireccion() != null ? inmueble.getDireccion() : "ubicación no especificada"));
                }
            }
        } catch (Exception e) {
            System.err.println("Error al obtener información del inmueble: " + e.getMessage());
            conversacion.setTituloPublicacion("Conversación sobre propiedad");
            conversacion.setPropietarioNombre("Propietario");
        }
        
        // Determinar el nombre del cliente (el otro participante)
        try {
            Optional<Cliente> clienteOpt = clienteRepository.findById(idUsuarioActual);
            if (clienteOpt.isPresent()) {
                conversacion.setClienteNombre(clienteOpt.get().getNombreCompleto());
            }
        } catch (Exception e) {
            conversacion.setClienteNombre("Cliente");
        }
        
        return conversacion;
    }

    // CORREGIR cualquier otro método que use mensajeMapper
    // Por ejemplo, si tienes algún método que retorne MensajeDTO:
    
    // Ejemplo de método corregido:
    public List<MensajeDTO> obtenerMensajesDTO(Integer inmuebleId) {
        List<Mensaje> mensajes = mensajeRepository.findByInmueble_IdInmueble(inmuebleId);
        return mensajes.stream()
            .map(MensajeMapper::toDTO) // CORREGIR: usar método estático
            .collect(Collectors.toList());
    }

    // ...existing code... (mantén el resto de métodos)
}