package com.inmobiliaria.inmobiliariaspring.factory;

import java.time.LocalDateTime;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Publicacion;

public class PublicacionFactory {
    public static Publicacion crearPublicacion(
        Inmueble inmueble,
        String titulo,
        String descripcion,
        Cliente cliente
    ) {
        return new Publicacion(
            inmueble, 
            LocalDateTime.now(), 
            titulo, 
            descripcion, 
            cliente
    );
    }
}
