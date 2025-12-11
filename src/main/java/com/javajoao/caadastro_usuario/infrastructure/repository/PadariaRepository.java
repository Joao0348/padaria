package com.javajoao.caadastro_usuario.infrastructure.repository;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Padaria;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PadariaRepository extends MongoRepository<Padaria, String> {
    Optional<Padaria> findByNome(String nome);



    List<Padaria> findAll();

    void deleteById(String id);

    Padaria save(Padaria existente);

    List<Padaria> findAllById(List<String> produtosIds);

    // Você pode adicionar consultas personalizadas aqui se precisar
}
