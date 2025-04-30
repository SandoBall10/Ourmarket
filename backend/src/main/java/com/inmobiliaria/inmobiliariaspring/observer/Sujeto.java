package com.inmobiliaria.inmobiliariaspring.observer;

public interface Sujeto {
    void agregarObservador(Observer observador);
    void eliminarObservador(Observer observador);
    void notificarObservadores(String mensaje);
}
