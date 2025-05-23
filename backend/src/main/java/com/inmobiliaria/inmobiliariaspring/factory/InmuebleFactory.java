package com.inmobiliaria.inmobiliariaspring.factory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble.Estado;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble.Tipo;

public class InmuebleFactory {
    public static Inmueble crearInmueble(
        Cliente cliente, Integer num_habitaciones, 
        String servicios, Tipo tipo, BigDecimal area, 
        BigDecimal precio, Estado estado, String region, 
        String provincia, String distrito, String direccion, 
        String imagenes
    ) {
        //si se vende terreno, por defecto en habitaciones y servicios es null
        if(tipo == Tipo.terreno){
            num_habitaciones = null;
            servicios = null;
        }
        return new Inmueble(
            cliente, num_habitaciones, servicios, tipo,
            area, precio, estado, region, provincia,
            distrito, direccion, imagenes,
            LocalDateTime.now()
        );
    }
}
