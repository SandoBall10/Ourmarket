package com.inmobiliaria.inmobiliariaspring.observer;

public class NotificacionGeneralObservador implements Observer {
    
    @Override
    public void actualizar(String mensaje) {
        ServicioNotificacion.agregarNotificacion(mensaje);
    }

}
