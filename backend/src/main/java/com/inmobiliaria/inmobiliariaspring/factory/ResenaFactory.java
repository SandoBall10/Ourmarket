package com.inmobiliaria.inmobiliariaspring.factory;

import java.time.LocalDateTime;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Resena;

public class ResenaFactory {
    public static Resena crearResena(String comentario, Integer estrellas, Cliente cliente, Inmueble inmueble) {
        return new Resena(comentario, estrellas, LocalDateTime.now(), cliente, inmueble);
    }
}
