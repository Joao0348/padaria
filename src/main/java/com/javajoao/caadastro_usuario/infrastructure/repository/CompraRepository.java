package com.javajoao.caadastro_usuario.infrastructure.repository;

import com.javajoao.caadastro_usuario.infrastructure.entitys.Compra;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraRepository extends MongoRepository<Compra, String> {
    List<Compra> findByUsuarioId(String usuarioId);

    Compra save(Compra compra);

    // Você pode adicionar consultas personalizadas, por exemplo:
    // List<Compra> findByUsuarioId(String usuarioId);
}
