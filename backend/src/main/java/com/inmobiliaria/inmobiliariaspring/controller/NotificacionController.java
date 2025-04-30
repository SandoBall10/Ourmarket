package com.inmobiliaria.inmobiliariaspring.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inmobiliaria.inmobiliariaspring.observer.ServicioNotificacion;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @GetMapping
    public List<String> obtenerNotificaciones() {
        return ServicioNotificacion.obtenerNotificaciones();
    }
}
