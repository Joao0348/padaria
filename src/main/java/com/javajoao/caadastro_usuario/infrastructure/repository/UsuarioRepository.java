package com.javajoao.caadastro_usuario.infrastructure.repository;

import com.javajoao.caadastro_usuario.infrastructure.entitys.Usuario;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    // Busca um usuário pelo CPF
    Optional<Usuario> findByCpf(String cpf);

    // Deleta um usuário pelo CPF

    void deleteByCpf(String cpf);

    Usuario save(Usuario usuario);

    List<Usuario> findAll();
}

