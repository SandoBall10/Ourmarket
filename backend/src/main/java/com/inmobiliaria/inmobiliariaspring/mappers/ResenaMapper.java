package com.inmobiliaria.inmobiliariaspring.mappers;

import com.inmobiliaria.inmobiliariaspring.dto.ResenaDTO;
import com.inmobiliaria.inmobiliariaspring.model.Resena;

public class ResenaMapper {
    public static ResenaDTO toDTO(Resena resena) {
        if (resena == null) return null;
        ResenaDTO dto = new ResenaDTO();
        dto.setIdResena(resena.getIdResena());
        dto.setComentario(resena.getComentario());
        dto.setEstrellas(resena.getEstrellas());
        dto.setFecha(resena.getFecha());
        if (resena.getCliente() != null) {
            dto.setIdCliente(resena.getCliente().getIdCliente());
            dto.setNombreCliente(resena.getCliente().getNombreCompleto());
        }
        if (resena.getInmueble() != null) {
            dto.setIdInmueble(resena.getInmueble().getIdInmueble());
        }
        return dto;
    }
}
