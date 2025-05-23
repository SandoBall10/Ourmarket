package com.inmobiliaria.inmobiliariaspring.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "inmueble")
public class Inmueble {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inmueble")
    private Integer idInmueble;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @Column(name = "numero_habitaciones", nullable = true)
    private Integer num_habitaciones;

    @Column(name = "servicios", columnDefinition = "TEXT", nullable = true)
    private String servicios;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    @Column(name = "area", precision = 10, scale = 2)   
    private BigDecimal area; //area en m2


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

   
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    @Column(name = "region", length = 50)
    private String region;

    @Column(name = "provincia", length = 50)
    private String provincia;

    @Column(name = "distrito", length = 50)
    private String distrito;

    @Column(name = "direccion", length = 50)
    private String direccion;

    @Column(columnDefinition = "TEXT")
    private String imagenes;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    public Inmueble() {}

    public Inmueble(Cliente cliente, Integer num_habitaciones, String servicios, Tipo tipo, 
                    BigDecimal area, BigDecimal precio, Estado estado, 
                    String region, String provincia, String distrito, String direccion, 
                    String imagenes, LocalDateTime fechaRegistro) {
        this.cliente = cliente;
        this.num_habitaciones = num_habitaciones;
        this.servicios = servicios;
        this.tipo = tipo;
        this.area = area;
        this.precio = precio;
        this.estado = estado != null ? estado : Estado.disponible;
        this.region = region;
        this.provincia = provincia;
        this.distrito = distrito;
        this.direccion = direccion;
        this.imagenes = imagenes;
        this.fechaRegistro = fechaRegistro;

    }

    public enum Tipo {
        casa, departamento, terreno
    }

    public enum Estado {
        disponible, vendido
    }

    // Getters y Setters
    public Integer getIdInmueble() {
        return idInmueble;
    }

    public void setIdInmueble(Integer idInmueble) {
        this.idInmueble = idInmueble;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Integer getNum_habitaciones() {
        return num_habitaciones;
    }

    public void setNum_habitaciones(Integer num_habitaciones) {
        this.num_habitaciones = num_habitaciones;
    }

    public String getServicios() {
        return servicios;
    }

    public void setServicios(String servicios) {
        this.servicios = servicios;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getDistrito() {
        return distrito;
    }

    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getImagenes() {
        return imagenes;
    }

    public void setImagenes(String imagenes) {
        this.imagenes = imagenes;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}