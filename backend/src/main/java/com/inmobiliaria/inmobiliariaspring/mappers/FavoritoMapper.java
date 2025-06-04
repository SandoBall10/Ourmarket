package com.inmobiliaria.inmobiliariaspring.mappers;

import com.inmobiliaria.inmobiliariaspring.dto.FavoritoDTO;
import com.inmobiliaria.inmobiliariaspring.model.Favorito;

public class FavoritoMapper {
    public static FavoritoDTO toDTO(Favorito favorito) {
        if (favorito == null) return null;
        FavoritoDTO dto = new FavoritoDTO();
        dto.setIdCliente(favorito.getIdCliente());
        dto.setIdInmueble(favorito.getIdInmueble());
        if (favorito.getInmueble() != null) {
            dto.setDireccion(favorito.getInmueble().getDireccion());
            dto.setPrecio(favorito.getInmueble().getPrecio() != null ? favorito.getInmueble().getPrecio().toString() : null);
            dto.setImagenes(favorito.getInmueble().getImagenes());
        }
        return dto;
    }
}
