package com.inmobiliaria.inmobiliariaspring.factory;

import java.time.LocalDateTime;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Rol;

public class ClienteFactory {
    public static Cliente crearCliente(String nombreCompleto, String email, String contraseña, String telefono, Cliente.TipoDocumento tipoDocumento, String numeroDocumento, Rol rol) {
        return new Cliente(nombreCompleto, email, contraseña, telefono, tipoDocumento, numeroDocumento, rol, LocalDateTime.now());
    }
}
