package com.javajoao.caadastro_usuario.dto;

import lombok.*;

import java.util.List;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompraRequestDTO {

    private String usuarioId;

    private List<String> produtosIds;

    private Integer quantidade;

    // ✅ NOVO CAMPO PARA RECEBER O TOTAL DA COMPRA
    private BigDecimal valorTotal;
}