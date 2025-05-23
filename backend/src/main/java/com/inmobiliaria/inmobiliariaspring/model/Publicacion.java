package com.inmobiliaria.inmobiliariaspring.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "publicacion")
public class Publicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_publicacion")
    private Integer idPublicacion;

    @ManyToOne
    @JoinColumn(name = "id_inmueble")
    private Inmueble inmueble;

    @Column(name = "fecha_publicacion")
    private LocalDateTime fechaPublicacion;

    @Column(name = "titulo", length = 100)
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "autorizado", nullable = false)
    private Boolean autorizado = false; //falso por defecto

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_admin")
    private Administrador administrador;

    @Column(name = "log_autorizado", columnDefinition = "TEXT")
    private String logAutorizado;

    public Publicacion() {}

    public Publicacion(Inmueble inmueble, LocalDateTime fechaPublicacion, String titulo,
            String descripcion, Cliente cliente) {
        this.inmueble = inmueble;
        this.fechaPublicacion = fechaPublicacion;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.autorizado = false;
        this.cliente = cliente;
        this.administrador = null;
        this.logAutorizado = null; 
    }
    //Getters y Setters
    public Integer getIdPublicacion() {
        return idPublicacion;
    }

    public void setIdPublicacion(Integer idPublicacion) {
        this.idPublicacion = idPublicacion;
    }

    public Inmueble getInmueble() {
        return inmueble;
    }

    public void setInmueble(Inmueble inmueble) {
        this.inmueble = inmueble;
    }

    public LocalDateTime getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
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

    public Boolean getAutorizado() {
        return autorizado;
    }

    public void setAutorizado(Boolean autorizado) {
        this.autorizado = autorizado;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Administrador getAdministrador() {
        return administrador;
    }

    public void setAdministrador(Administrador administrador) {
        this.administrador = administrador;
    }

    public String getLogAutorizado() {
        return logAutorizado;
    }

    public void setLogAutorizado(String logAutorizado) {
        this.logAutorizado = logAutorizado;
    }

}
