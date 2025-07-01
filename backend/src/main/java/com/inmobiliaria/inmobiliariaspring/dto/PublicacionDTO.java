package com.inmobiliaria.inmobiliariaspring.dto;

import java.time.LocalDateTime;

public class PublicacionDTO {
    private Integer idPublicacion;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaPublicacion;
    private Integer idInmueble;
    //private Integer idCliente;
    private String nombreCliente;
    private InmuebleDTO inmueble; // <-- agrega esto
    private ClienteDTO cliente; // <-- Añade esta línea

    public PublicacionDTO() {
    }

    // Getters y Setters
    public Integer getIdPublicacion() {
        return idPublicacion;
    }

    public void setIdPublicacion(Integer idPublicacion) {
        this.idPublicacion = idPublicacion;
    }

    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }

    public Integer getIdInmueble() {
        return idInmueble;
    }

    public void setIdInmueble(Integer idInmueble) {
        this.idInmueble = idInmueble;
    }

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public InmuebleDTO getInmueble() {
        return inmueble;
    }

    public void setInmueble(InmuebleDTO inmueble) {
        this.inmueble = inmueble;
    }

}
