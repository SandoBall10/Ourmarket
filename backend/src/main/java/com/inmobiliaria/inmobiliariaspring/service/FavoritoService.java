package com.inmobiliaria.inmobiliariaspring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inmobiliaria.inmobiliariaspring.model.Favorito;
import com.inmobiliaria.inmobiliariaspring.repository.FavoritoRepository;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    //guardar un favorito
    public Favorito agregarFavorito(Favorito favorito) {
        return favoritoRepository.save(favorito);
    }

    //listar todos los favoritos
    public List<Favorito> listarFavoritos() {
        return favoritoRepository.findAll();
    }

    //buscar un favorito por ID cliente y ID inmueble (ya que es una llave compuesta)
    public Optional<Favorito> obtenerFavorito(Integer idCliente, Integer idInmueble) {
        return favoritoRepository.findByIdClienteAndIdInmueble(idCliente, idInmueble);
    }

    //eliminar un favorito
    public void eliminarFavorito(Integer idCliente, Integer idInmueble) {
        favoritoRepository.deleteByIdClienteAndIdInmueble(idCliente, idInmueble);
    }
}