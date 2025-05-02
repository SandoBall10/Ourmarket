package com.inmobiliaria.inmobiliariaspring.service;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.inmobiliaria.inmobiliariaspring.factory.ResenaFactory;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Resena;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;
import com.inmobiliaria.inmobiliariaspring.repository.InmuebleRepository;
import com.inmobiliaria.inmobiliariaspring.repository.ResenaRepository;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private InmuebleRepository inmuebleRepository;

    // Crear una nueva reseña
    public Resena crearResena(String comentario, Integer estrellas, Integer clienteId, Integer inmuebleId) {
        // Buscar el cliente y el inmueble asociados
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Inmueble inmueble = inmuebleRepository.findById(inmuebleId)
            .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));

        // Crear la reseña usando el Factory
        Resena nuevaResena = ResenaFactory.crearResena(comentario, estrellas, cliente, inmueble);

        // Guardar la reseña en la base de datos
        return resenaRepository.save(nuevaResena);
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
    public Resena actualizarResena(Integer id, String comentario, Integer estrellas) {
        Optional<Resena> resenaExistente = resenaRepository.findById(id);
        if (resenaExistente.isPresent()) {
            Resena resena = resenaExistente.get();
            resena.setComentario(comentario);
            resena.setEstrellas(estrellas);
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