package com.inmobiliaria.inmobiliariaspring.service;
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

    //crear una publicacion usando factory
    public Publicacion crearPublicacion(Integer idInmueble, String titulo, String descripcion, Integer idCliente) {
        // Verifica si el inmueble y cliente existe en la base de datos
        Optional<Inmueble> inmueble = inmuebleRepository.findById(idInmueble);
        Optional<Cliente> cliente = clienteRepository.findById(idCliente);

        // Valida ambos con un solo if
        if (inmueble.isEmpty() || cliente.isEmpty()) {
            throw new RuntimeException(
                inmueble.isEmpty() ? "Inmueble no encontrado." : "Cliente no encontrado."
            );
        }
    
        // Usamos el Factory para crear la publicacion
        Publicacion nuevaPublicacion = PublicacionFactory.crearPublicacion(
            inmueble.get(),
            titulo,
            descripcion,
            cliente.get()
        );

        return publicacionRepository.save(nuevaPublicacion);
    }

    // Listar todas las publicaciones
    public List<Publicacion> listarPublicaciones() {
        return publicacionRepository.findAll(); 
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
        publicacion.setAutorizado(true);
        // Asigna el admin que autorizó
        publicacion.setAdministrador(admin);
        // Guarda un log con el nombre del admin y la fecha
        publicacion.setLogAutorizado("Autorizado por: " + admin.getUsername() + " el " + LocalDateTime.now());
        // Guarda y retorna la publicación actualizada
        return publicacionRepository.save(publicacion);
    }

    // Actualizar publicación (editar)
    public Publicacion actualizarPublicacion(Integer id, Publicacion publicacionActualizada) {
        Publicacion publicacion = publicacionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Publicación no encontrada."));

        publicacion.setTitulo(publicacionActualizada.getTitulo());
        publicacion.setDescripcion(publicacionActualizada.getDescripcion());
        publicacion.setInmueble(publicacionActualizada.getInmueble());
        publicacion.setCliente(publicacionActualizada.getCliente());
        

        return publicacionRepository.save(publicacion);
    }

    // Eliminar publicacion por ID
    public void eliminarPublicacion(Integer id) {
        publicacionRepository.deleteById(id); 
    }
}
