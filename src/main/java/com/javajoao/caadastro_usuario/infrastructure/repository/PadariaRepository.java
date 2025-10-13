package com.javajoao.caadastro_usuario.infrastructure.repository;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Padaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PadariaRepository extends JpaRepository<Padaria, Long> {

}
