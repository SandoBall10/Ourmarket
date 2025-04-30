package com.inmobiliaria.inmobiliariaspring.factory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble.Estado;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble.Tipo;

public class InmuebleFactory {
    public static Inmueble crearInmueble(String titulo, String descripcion, BigDecimal precio, Tipo tipo, String ubicacion, String imagenes, Cliente cliente) {
        return new Inmueble(titulo, descripcion, precio, tipo, Estado.disponible, ubicacion, LocalDateTime.now(), false, imagenes, cliente );
    }
}
