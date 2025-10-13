package com.javajoao.caadastro_usuario.dto;

import lombok.Data;

import java.util.List;

@Data
public class CompraRequestDTO {
    private Integer usuarioId;
    private List<Long> produtosIds;
}
