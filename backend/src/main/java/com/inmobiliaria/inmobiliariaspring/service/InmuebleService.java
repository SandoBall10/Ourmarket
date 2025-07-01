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
    public Inmueble crearInmueble(Inmueble inmueble, String emailCliente) {

        // Busca el cliente por email
        Cliente cliente = clienteRepository.findByEmail(emailCliente)
        .orElseThrow(() -> new RuntimeException("Cliente no encontrado."));

        // Fuerza el cliente, por si viene null en el JSON
        inmueble.setCliente(cliente);

        // Asignar valores predeterminados si no se proporcionan
        if (inmueble.getTipo() == null) {
            inmueble.setTipo(Tipo.casa); // Valor predeterminado: "casa"
        }
        if (inmueble.getEstado() == null) {
            inmueble.setEstado(Estado.disponible); // Valor predeterminado: "disponible"
        }

        // Siempre dejar imágenes en null al crear
        //inmueble.setImagenes(null);
        
        // Usamos el Factory para crear el inmueble
        Inmueble nuevoInmueble = InmuebleFactory.crearInmueble(
                cliente,
                inmueble.getNum_habitaciones(),
                inmueble.getServicios(),
                inmueble.getTipo(),
                inmueble.getArea(),
                inmueble.getPrecio(),
                inmueble.getEstado(),
                inmueble.getRegion(),
                inmueble.getProvincia(),
                inmueble.getDistrito(),
                inmueble.getDireccion(),
                inmueble.getImagenes()               
        );

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
            
            inmueble.setNum_habitaciones(inmuebleActualizado.getNum_habitaciones());
            inmueble.setServicios(inmuebleActualizado.getServicios());
            inmueble.setTipo(inmuebleActualizado.getTipo());
            inmueble.setArea(inmuebleActualizado.getArea());
            inmueble.setPrecio(inmuebleActualizado.getPrecio());   
            inmueble.setEstado(inmuebleActualizado.getEstado());
            inmueble.setRegion(inmuebleActualizado.getRegion());
            inmueble.setProvincia(inmuebleActualizado.getProvincia());
            inmueble.setDistrito(inmuebleActualizado.getDistrito());
            inmueble.setDireccion(inmuebleActualizado.getDireccion());
            
            // Si es terreno, habitaciones y servicios deben ser null
            if (inmuebleActualizado.getTipo() == Inmueble.Tipo.terreno) {
                inmueble.setNum_habitaciones(null);
                inmueble.setServicios(null);
            } else {
                inmueble.setNum_habitaciones(inmuebleActualizado.getNum_habitaciones());
                inmueble.setServicios(inmuebleActualizado.getServicios());
            }
            
            return inmuebleRepository.save(inmueble);
        } else {
            return null;
        }
    }

    public void actualizarImagenesInmueble(Integer id, String nombresImagenes) {
        Inmueble inmueble = inmuebleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));
        inmueble.setImagenes(nombresImagenes);
        inmuebleRepository.save(inmueble);
    }

    //eliminar un inmueble
    public void eliminarInmueble(Integer id) {
        inmuebleRepository.deleteById(id);
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