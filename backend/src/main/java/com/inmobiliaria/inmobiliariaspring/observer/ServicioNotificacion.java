package com.inmobiliaria.inmobiliariaspring.observer;
import java.util.ArrayList;
import java.util.List;

public class ServicioNotificacion {
    private static final List<String> notificaciones = new ArrayList<>();

    public static void agregarNotificacion(String mensaje) {
        notificaciones.add(mensaje);
    }

    public static List<String> obtenerNotificaciones() {
        return new ArrayList<>(notificaciones);
    }

    public static void limpiarNotificaciones() {
        notificaciones.clear();
    }
}
