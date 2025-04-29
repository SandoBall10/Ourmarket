package com.inmobiliaria.inmobiliariaspring.factory;

import java.time.LocalDateTime;

import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.model.Rol;

public class ClienteFactory {
    public static Cliente crearCliente(String nombre, String apellido, String email, String contraseña, Rol rol) {
        return new Cliente(nombre, apellido, email, contraseña, rol, LocalDateTime.now());
    }
}
