package com.javajoao.caadastro_usuario.infrastructure.entitys;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.*;


@Document(collection = "produtos")
public class Padaria {

    @Id
    private String id;
    private String imagem;
    private String nome;
    private Double preco;
    private Integer quantidade;

    // ✅ Novo campo
    private String categoria;

    // ===== Getters e Setters =====
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}