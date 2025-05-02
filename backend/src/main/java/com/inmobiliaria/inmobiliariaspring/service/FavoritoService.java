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

    // Agregar un favorito
    public Favorito agregarFavorito(Favorito favorito) {
        // Guarda el favorito directamente
        return favoritoRepository.save(favorito);
    }

    // Listar todos los favoritos
    public List<Favorito> listarFavoritos() {
        return favoritoRepository.findAll();
    }

    // Obtener un favorito por cliente ID e inmueble ID
    public Optional<Favorito> obtenerFavorito(Integer idCliente, Integer idInmueble) {
        return favoritoRepository.findById(new Favorito.FavoritoId(idCliente, idInmueble));
    }

    // Eliminar un favorito por cliente ID e inmueble ID
    public void eliminarFavorito(Integer idCliente, Integer idInmueble) {
        favoritoRepository.deleteById(new Favorito.FavoritoId(idCliente, idInmueble));
    }
}