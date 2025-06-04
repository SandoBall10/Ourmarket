package com.inmobiliaria.inmobiliariaspring.mappers;

import com.inmobiliaria.inmobiliariaspring.dto.ClienteDTO;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;

public class ClienteMapper {
    public static ClienteDTO toDTO(Cliente cliente) {
        if (cliente == null) return null;
        ClienteDTO dto = new ClienteDTO();
        dto.setIdCliente(cliente.getIdCliente());
        dto.setNombreCompleto(cliente.getNombreCompleto());
        dto.setEmail(cliente.getEmail());
        dto.setTelefono(cliente.getTelefono());
        return dto;
    }
}
