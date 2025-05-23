package com.inmobiliaria.inmobiliariaspring.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    @Column(name = "nombre_completo", length = 100)
    private String nombreCompleto;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "contrasena", length = 100)
    private String contrasena;

    @Column(name = "telefono", length = 15, nullable = false)
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false, length = 20)  // Cambiado a tipo de documento (DNI o Carnet de Extranjería)
    private TipoDocumento tipoDocumento;  // 'DNI' o 'Carnet de Extranjería'

    @Column(name="numero_documento", length = 20, nullable = false)
    private String numeroDocumento;  // Número de documento (DNI o Carnet de Extranjería) 

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "cliente")
    private List<Inmueble> inmuebles;

    @OneToMany(mappedBy = "cliente")
    private List<Resena> resenas;

    @OneToMany(mappedBy = "cliente")
    private List<Mensaje> mensajes;

    @OneToMany(mappedBy = "cliente")
    private List<Favorito> favoritos;

    //constructor vacio
    public Cliente() {
    } 
    
    // Constructor personalizado para usar en Factory
    public Cliente(String nombreCompleto, String email, String contrasena, String telefono, TipoDocumento tipoDocumento, String numeroDocumento, Rol rol, LocalDateTime fechaRegistro) {
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.contrasena = contrasena;
        this.telefono = telefono;
        this.tipoDocumento = tipoDocumento;  // 'DNI' o 'Carnet de Extranjería'
        this.numeroDocumento = numeroDocumento;  // Número de documento (DNI o Carnet de Extranjería)
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
    }

    // Getters and Setters
    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }
    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public List<Inmueble> getInmuebles() {
        return inmuebles;
    }

    public void setInmuebles(List<Inmueble> inmuebles) {
        this.inmuebles = inmuebles;
    }

    public List<Resena> getResenas() {
        return resenas;
    }

    public void setResenas(List<Resena> resenas) {
        this.resenas = resenas;
    }

    public List<Mensaje> getMensajes() {
        return mensajes;
    }

    public void setMensajes(List<Mensaje> mensajes) {
        this.mensajes = mensajes;
    }

    public List<Favorito> getFavoritos() {
        return favoritos;
    }

    public void setFavoritos(List<Favorito> favoritos) {
        this.favoritos = favoritos;
    }

    // Enum TipoDocumento
    public enum TipoDocumento {
        DNI,
        CARNET_EXTRANJERIA
    }
}
