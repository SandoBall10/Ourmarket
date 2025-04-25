package com.inmobiliaria.inmobiliariaspring.model;
import jakarta.persistence.*;

@Entity
public class Rol {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer idRol;
    private String nombre;

    public Integer getIdRol(){
        return idRol;
    }

    public void setIdRol(Integer idRol){
        this.idRol = idRol;
    }

    public String getNombre(){
        return nombre;
    }

    public void setNombre(String nombre){
        this.nombre = nombre;
    }
    

}