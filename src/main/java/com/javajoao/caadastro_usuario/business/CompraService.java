package com.javajoao.caadastro_usuario.business;

import com.javajoao.caadastro_usuario.dto.CompraRequestDTO;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Compra;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Padaria;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Usuario;
import com.javajoao.caadastro_usuario.infrastructure.repository.CompraRepository;
import com.javajoao.caadastro_usuario.infrastructure.repository.PadariaRepository;
import com.javajoao.caadastro_usuario.infrastructure.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;
    private final UsuarioRepository usuarioRepository;
    private final PadariaRepository padariaRepository;

    public Compra criarCompraComDTO(CompraRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByCpf(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        List<Padaria> produtos = padariaRepository.findAllById(dto.getProdutosIds());
        Compra compra = Compra.builder()
                .usuario(usuario)
                .produtos(produtos)
                .dataCompra(LocalDateTime.now())
                .valorTotal(calcularValorTotal(produtos))
                .build();

        return compraRepository.save(compra);
    }

    private Double calcularValorTotal(List<Padaria> produtos) {
        return produtos.stream()
                .mapToDouble(p -> p.getPreco() != null ? p.getPreco() : 0.0)
                .sum();
    }
}

