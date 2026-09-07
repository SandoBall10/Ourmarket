package com.inmobiliaria.inmobiliariaspring.service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.inmobiliaria.inmobiliariaspring.factory.PublicacionFactory;
import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Publicacion;
import com.inmobiliaria.inmobiliariaspring.repository.AdministradorRepository;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.repository.InmuebleRepository;
import com.inmobiliaria.inmobiliariaspring.repository.PublicacionRepository;

@Service
public class PublicacionService {

    @Autowired
    private PublicacionRepository publicacionRepository;
    
    @Autowired
    private InmuebleRepository inmuebleRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    // Crear una publicación usando factory y email del cliente autenticado
    public Publicacion crearPublicacion(Integer idInmueble, String titulo, String descripcion, String emailCliente) {
        Optional<Inmueble> inmueble = inmuebleRepository.findById(idInmueble);
        Cliente cliente = clienteRepository.findByEmail(emailCliente)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado."));

        if (inmueble.isEmpty()) {
            throw new RuntimeException("Inmueble no encontrado.");
        }

        Publicacion nuevaPublicacion = PublicacionFactory.crearPublicacion(
            inmueble.get(),
            titulo,
            descripcion,
            cliente
        );

        return publicacionRepository.save(nuevaPublicacion);
    }

    // Listar todas las publicaciones
    public List<Publicacion> listarPublicaciones() {
        return publicacionRepository.findAll(); 
    }

    public List<Publicacion> buscarCatalogo(String tipo, BigDecimal precioMin, BigDecimal precioMax,
            String region, String distrito, Integer habitaciones, String q) {
        Inmueble.Tipo tipoEnum = null;
        if (tipo != null && !tipo.isBlank()) {
            try {
                tipoEnum = Inmueble.Tipo.valueOf(tipo.trim().toLowerCase());
            } catch (IllegalArgumentException ignored) {
                tipoEnum = null;
            }
        }
        String query = (q == null || q.isBlank()) ? null : q.trim();
        String regionFiltro = (region == null || region.isBlank()) ? null : region.trim();
        String distritoFiltro = (distrito == null || distrito.isBlank()) ? null : distrito.trim();
        return publicacionRepository.buscarCatalogo(
                tipoEnum, precioMin, precioMax, regionFiltro, distritoFiltro, habitaciones, query);
    }

    // Buscar publicación por ID
    public Optional<Publicacion> obtenerPublicacionPorId(Integer id) {
        return publicacionRepository.findById(id); 
    }

    // Autorizar publicación (por un admin)
    public Publicacion autorizarPublicacion(Integer idPublicacion, Integer idAdmin) {
        // Busca la publicación por su ID
        Publicacion publicacion = publicacionRepository.findById(idPublicacion)
            .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
        // Busca el admin por su ID
        Administrador admin = administradorRepository.findById(idAdmin)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        // Marca como autorizada
        publicacion.setAutorizado(2);
        // Asigna el admin que autorizó
        publicacion.setAdministrador(admin);
        // Guarda un log con el nombre del admin y la fecha
        publicacion.setLogAutorizado("Autorizado por: " + admin.getUsername() + " el " + LocalDateTime.now());
        // Guarda y retorna la publicación actualizada
        return publicacionRepository.save(publicacion);
    }

    // Rechazar publicación (por un admin)
    public Publicacion rechazarPublicacion(Integer idPublicacion, Integer idAdmin, String motivoRechazo) {
        Publicacion publicacion = publicacionRepository.findById(idPublicacion)
            .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
        Administrador admin = administradorRepository.findById(idAdmin)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        publicacion.setAutorizado(3);
        publicacion.setAdministrador(admin);
        publicacion.setMotivoRechazo(motivoRechazo);
        publicacion.setLogAutorizado("Rechazado por: " + admin.getUsername() + " el " + java.time.LocalDateTime.now() + ". Motivo: " + motivoRechazo);
        return publicacionRepository.save(publicacion);
    }

    // Actualizar publicación (editar)
    public Publicacion actualizarPublicacion(Integer id, Publicacion publicacionActualizada) {
        Publicacion publicacion = publicacionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Publicación no encontrada."));

        publicacion.setTitulo(publicacionActualizada.getTitulo());
        publicacion.setDescripcion(publicacionActualizada.getDescripcion());
        return publicacionRepository.save(publicacion);
    }

    // Eliminar publicacion por ID
    public void eliminarPublicacion(Integer id) {
        publicacionRepository.deleteById(id); 
    }
}
