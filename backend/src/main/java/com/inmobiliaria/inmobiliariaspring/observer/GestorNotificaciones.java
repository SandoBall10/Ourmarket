package com.inmobiliaria.inmobiliariaspring.observer;
import java.util.ArrayList;
import java.util.List;

public class GestorNotificaciones implements Sujeto {
    private List<Observer> observadores = new ArrayList<>();

    @Override
    public void agregarObservador(Observer observador) {
        observadores.add(observador);
    }

    @Override
    public void eliminarObservador(Observer observador) {
        observadores.remove(observador);
    }

    @Override
    public void notificarObservadores(String mensaje) {
        for (Observer observador : observadores) {
            observador.actualizar(mensaje);
        }
    }

}
