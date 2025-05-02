package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.factory.InmuebleFactory;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble.Estado;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble.Tipo;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.repository.InmuebleRepository;

@Service
public class InmuebleService {

    @Autowired
    private InmuebleRepository inmuebleRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // Crear un nuevo inmueble usando el Factory
    public Inmueble crearInmueble(Inmueble inmueble) {

        //Verifica si el cliente existe en la base de datos
        Optional<Cliente> cliente = clienteRepository.findById(inmueble.getCliente().getIdCliente());
        if (!cliente.isPresent()) {
            throw new RuntimeException("Cliente no encontrado.");
        }

        // Asignar valores predeterminados si no se proporcionan
        if (inmueble.getTipo() == null) {
            inmueble.setTipo(Tipo.casa); // Valor predeterminado: "casa"
        }
        if (inmueble.getEstado() == null) {
            inmueble.setEstado(Estado.disponible); // Valor predeterminado: "disponible"
        }
        if (inmueble.getAutorizado() == null) {
            inmueble.setAutorizado(false); // Valor predeterminado: "false"
        }
        // Usamos el Factory para crear el inmueble
        Inmueble nuevoInmueble = InmuebleFactory.crearInmueble(
                inmueble.getTitulo(),
                inmueble.getDescripcion(),
                inmueble.getPrecio(),
                Tipo.valueOf(inmueble.getTipo().name()),  // Aseguramos que el tipo esté bien
                inmueble.getUbicacion(),
                inmueble.getImagenes(),
                cliente.get()
        );

        // Aquí puedes llamar al observer para notificar
        // NotificadorInmueble.notificarObservadores("Nuevo inmueble publicado: " + nuevoInmueble.getTitulo());

        return inmuebleRepository.save(nuevoInmueble);
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

    public Inmueble autorizarInmueble(Integer idInmueble) {
        Inmueble inmueble = inmuebleRepository.findById(idInmueble)
                .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));
    
                if (inmueble.getEstado().equals(Inmueble.Estado.valueOf("disponible"))) {
                    inmueble.setEstado(Inmueble.Estado.valueOf("vendido")); // Cambia el estado a "vendido"
        } else {
            throw new RuntimeException("El inmueble ya ha sido procesado.");
        }
    
        return inmuebleRepository.save(inmueble);
    }

    public Inmueble marcarComoVendido(Integer idInmueble) {
        Inmueble inmueble = inmuebleRepository.findById(idInmueble)
                .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));
    
        if (inmueble.getEstado().equals(Inmueble.Estado.valueOf("disponible"))) {
            inmueble.setEstado(Inmueble.Estado.valueOf("vendido")); // Cambia el estado a "vendido"
        } else {
            throw new RuntimeException("El inmueble ya ha sido vendido o no está disponible.");
        }
    
        return inmuebleRepository.save(inmueble);
    }
}