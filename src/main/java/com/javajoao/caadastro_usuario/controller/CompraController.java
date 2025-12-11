package com.javajoao.caadastro_usuario.controller;

import com.javajoao.caadastro_usuario.business.CompraService;
import com.javajoao.caadastro_usuario.dto.CompraRequestDTO;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Compra;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/compras")
@RequiredArgsConstructor
public class CompraController {

    private final CompraService compraService;

    @PostMapping
    public ResponseEntity<?> criarCompra(@RequestBody CompraRequestDTO dto) {

        // ✅ Validações básicas pra evitar erro no sistema
        if (dto.getUsuarioId() == null || dto.getUsuarioId().isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não informado.");
        }

        if (dto.getProdutosIds() == null || dto.getProdutosIds().isEmpty()) {
            return ResponseEntity.badRequest().body("Lista de produtos vazia.");
        }

        if (dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
            return ResponseEntity.badRequest().body("Quantidade inválida.");
        }

        if (dto.getValorTotal() == null || dto.getValorTotal().doubleValue() <= 0) {
            return ResponseEntity.badRequest().body("Valor total inválido.");
        }

        Compra novaCompra = compraService.criarCompraComDTO(dto);

        return ResponseEntity.ok(novaCompra);
    }
}