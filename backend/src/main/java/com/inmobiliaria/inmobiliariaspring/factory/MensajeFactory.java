package com.inmobiliaria.inmobiliariaspring.factory;

import java.time.LocalDateTime;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje.TipoMensaje;

public class MensajeFactory {
    public static Mensaje crearMensaje(String contenido, TipoMensaje tipoMensaje, Cliente cliente, Inmueble inmueble) {
        return new Mensaje(contenido, LocalDateTime.now(), cliente, inmueble, tipoMensaje);
    }
}
