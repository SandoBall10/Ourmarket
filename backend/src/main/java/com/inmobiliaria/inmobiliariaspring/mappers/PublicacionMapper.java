package com.inmobiliaria.inmobiliariaspring.mappers;

import com.inmobiliaria.inmobiliariaspring.dto.PublicacionDTO;
import com.inmobiliaria.inmobiliariaspring.model.Publicacion;

public class PublicacionMapper {
    public static PublicacionDTO toDTO(Publicacion publicacion) {
        if (publicacion == null) return null;
        PublicacionDTO dto = new PublicacionDTO();
        dto.setIdPublicacion(publicacion.getIdPublicacion());
        dto.setTitulo(publicacion.getTitulo());
        dto.setDescripcion(publicacion.getDescripcion());
        dto.setFechaPublicacion(publicacion.getFechaPublicacion());
        dto.setIdInmueble(publicacion.getInmueble() != null ? publicacion.getInmueble().getIdInmueble() : null);
        //dto.setIdCliente(publicacion.getCliente() != null ? publicacion.getCliente().getIdCliente() : null);
        dto.setCliente(publicacion.getCliente() != null ? ClienteMapper.toDTO(publicacion.getCliente()) : null); // opcional
        dto.setNombreCliente(publicacion.getCliente() != null ? publicacion.getCliente().getNombreCompleto() : null);
        dto.setAutorizado(publicacion.getAutorizado()); // <-- Agrega esta línea
        return dto;
    }
}
