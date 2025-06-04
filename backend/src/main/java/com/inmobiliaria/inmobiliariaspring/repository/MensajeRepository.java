package com.inmobiliaria.inmobiliariaspring.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje;

public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {
    List<Mensaje> findByInmueble(Inmueble inmueble);
    List<Mensaje> findByInmuebleAndCliente(Inmueble inmueble, Cliente cliente);
    List<Mensaje> findByInmueble_IdInmueble(Integer idInmueble);
}