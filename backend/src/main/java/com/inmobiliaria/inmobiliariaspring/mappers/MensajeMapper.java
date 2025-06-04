package com.inmobiliaria.inmobiliariaspring.mappers;

import com.inmobiliaria.inmobiliariaspring.dto.MensajeDTO;
import com.inmobiliaria.inmobiliariaspring.model.Mensaje;

public class MensajeMapper {
    public static MensajeDTO toDTO(Mensaje mensaje) {
        if (mensaje == null) return null;
        MensajeDTO dto = new MensajeDTO();
        dto.setIdMensaje(mensaje.getIdMensaje());
        dto.setContenido(mensaje.getContenido());
        dto.setFechaEnvio(mensaje.getFechaEnvio());
        dto.setTipoMensaje(mensaje.getTipoMensaje() != null ? mensaje.getTipoMensaje().name() : null);
        dto.setIdCliente(mensaje.getCliente() != null ? mensaje.getCliente().getIdCliente() : null);
        dto.setNombreCliente(mensaje.getCliente() != null ? mensaje.getCliente().getNombreCompleto() : null);
        dto.setIdInmueble(mensaje.getInmueble() != null ? mensaje.getInmueble().getIdInmueble() : null);
        return dto;
    }
}
