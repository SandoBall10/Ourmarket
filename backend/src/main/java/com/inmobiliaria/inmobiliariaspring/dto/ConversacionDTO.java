package com.inmobiliaria.inmobiliariaspring.dto;

import java.time.LocalDateTime;

public class ConversacionDTO {
    private Integer idInmueble;
    private String tituloPublicacion;
    private String propietarioNombre;
    private String clienteNombre;
    private MensajeDTO ultimoMensaje;
    private Integer totalMensajes;
    private LocalDateTime fechaUltimoMensaje;
    
    // Constructor vacío
    public ConversacionDTO() {
    }
    
    // Getters y Setters
    public Integer getIdInmueble() {
        return idInmueble;
    }
    
    public void setIdInmueble(Integer idInmueble) {
        this.idInmueble = idInmueble;
    }
    
    public String getTituloPublicacion() {
        return tituloPublicacion;
    }
    
    public void setTituloPublicacion(String tituloPublicacion) {
        this.tituloPublicacion = tituloPublicacion;
    }
    
    public String getPropietarioNombre() {
        return propietarioNombre;
    }
    
    public void setPropietarioNombre(String propietarioNombre) {
        this.propietarioNombre = propietarioNombre;
    }
    
    public String getClienteNombre() {
        return clienteNombre;
    }
    
    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }
    
    public MensajeDTO getUltimoMensaje() {
        return ultimoMensaje;
    }
    
    public void setUltimoMensaje(MensajeDTO ultimoMensaje) {
        this.ultimoMensaje = ultimoMensaje;
    }
    
    public Integer getTotalMensajes() {
        return totalMensajes;
    }
    
    public void setTotalMensajes(Integer totalMensajes) {
        this.totalMensajes = totalMensajes;
    }
    
    public LocalDateTime getFechaUltimoMensaje() {
        return fechaUltimoMensaje;
    }
    
    public void setFechaUltimoMensaje(LocalDateTime fechaUltimoMensaje) {
        this.fechaUltimoMensaje = fechaUltimoMensaje;
    }
}