package com.inmobiliaria.inmobiliariaspring.dto;

public class FavoritoDTO {
    private Integer id_cliente;  // Cambiado para coincidir con el frontend
    private Integer id_inmueble; // Cambiado para coincidir con el frontend
    private String direccion;    // opcional
    private String precio;       // opcional
    private String imagenes;     // opcional

    public FavoritoDTO() {
    }

    // Getters y Setters actualizados
    public Integer getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(Integer id_cliente) {
        this.id_cliente = id_cliente;
    }

    public Integer getId_inmueble() {
        return id_inmueble;
    }

    public void setId_inmueble(Integer id_inmueble) {
        this.id_inmueble = id_inmueble;
    }

    // Métodos de compatibilidad
    public Integer getIdCliente() {
        return id_cliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.id_cliente = idCliente;
    }

    public Integer getIdInmueble() {
        return id_inmueble;
    }

    public void setIdInmueble(Integer idInmueble) {
        this.id_inmueble = idInmueble;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getPrecio() {
        return precio;
    }

    public void setPrecio(String precio) {
        this.precio = precio;
    }

    public String getImagenes() {
        return imagenes;
    }

    public void setImagenes(String imagenes) {
        this.imagenes = imagenes;
    }

}
