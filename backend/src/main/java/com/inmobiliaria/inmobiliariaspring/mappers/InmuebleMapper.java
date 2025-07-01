package com.inmobiliaria.inmobiliariaspring.mappers;

import com.inmobiliaria.inmobiliariaspring.dto.InmuebleDTO;
import com.inmobiliaria.inmobiliariaspring.model.Inmueble;

public class InmuebleMapper {
    public static InmuebleDTO toDTO(Inmueble inmueble) {
        if (inmueble == null) return null;
        InmuebleDTO dto = new InmuebleDTO();
        dto.setIdInmueble(inmueble.getIdInmueble());
        dto.setNumHabitaciones(inmueble.getNum_habitaciones());
        dto.setServicios(inmueble.getServicios());
        dto.setTipo(inmueble.getTipo() != null ? inmueble.getTipo().name() : null);
        dto.setArea(inmueble.getArea());
        dto.setPrecio(inmueble.getPrecio());
        dto.setEstado(inmueble.getEstado() != null ? inmueble.getEstado().name() : null);
        dto.setRegion(inmueble.getRegion());
        dto.setProvincia(inmueble.getProvincia());
        dto.setDistrito(inmueble.getDistrito());
        dto.setDireccion(inmueble.getDireccion());
        dto.setImagenes(inmueble.getImagenes());
        dto.setCliente(inmueble.getCliente() != null ? ClienteMapper.toDTO(inmueble.getCliente()) : null); // opcional
        return dto;
    }
}
