package com.inmobiliaria.inmobiliariaspring.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "favorito")
@IdClass(Favorito.FavoritoId.class)
public class Favorito {

    @Id
    @Column(name = "id_cliente")
    private Integer idCliente;

    @Id
    @Column(name = "id_inmueble")
    private Integer idInmueble;

    @ManyToOne
    @JoinColumn(name = "id_cliente", insertable = false, updatable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_inmueble", insertable = false, updatable = false)
    private Inmueble inmueble;

    public Favorito() {}

    public Favorito(Integer idCliente, Integer idInmueble) {
        this.idCliente = idCliente;
        this.idInmueble = idInmueble;
    }

    // Clase interna para unir las dos claves foráneas
    public static class FavoritoId implements java.io.Serializable {
        private Integer idCliente;
        private Integer idInmueble;

        public FavoritoId() {}

        public FavoritoId(Integer idCliente, Integer idInmueble) {
            this.idCliente = idCliente;
            this.idInmueble = idInmueble;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof FavoritoId)) return false;
            FavoritoId that = (FavoritoId) o;
            return idCliente.equals(that.idCliente) && idInmueble.equals(that.idInmueble);
        }

        @Override
        public int hashCode() {
            return idCliente.hashCode() + idInmueble.hashCode();
        }

        // Getters y setters de la clase interna
        public Integer getIdCliente() {
            return idCliente;
        }

        public void setIdCliente(Integer idCliente) {
            this.idCliente = idCliente;
        }

        public Integer getIdInmueble() {
            return idInmueble;
        }

        public void setIdInmueble(Integer idInmueble) {
            this.idInmueble = idInmueble;
        }
    }

    // Getters y setters
    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

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

    public Inmueble getInmueble() {
        return inmueble;
    }

    public void setInmueble(Inmueble inmueble) {
        this.inmueble = inmueble;
    }
}