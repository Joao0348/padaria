package com.javajoao.caadastro_usuario.business;
import com.javajoao.caadastro_usuario.exceptions.ResourceNotFoundException;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Padaria;
import com.javajoao.caadastro_usuario.infrastructure.repository.PadariaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PadariaService {

    private final PadariaRepository padariaRepository;

    public PadariaService(PadariaRepository padariaRepository) {
        this.padariaRepository = padariaRepository;
    }

    public Padaria salvarPadaria(Padaria padaria){
        return padariaRepository.save(padaria);
    }

    public Padaria buscarPorId(String id){
        return (Padaria) padariaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado com ID: " + id));
    }

    public List<Padaria> listarTodos(){
        return padariaRepository.findAll();
    }

    public Padaria atualizarPadaria(String id, Padaria novaPadaria){
        Padaria existente = (Padaria) padariaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item de padaria não encontrado com ID: " + id));
        if (novaPadaria.getImagem() != null) existente.setImagem(novaPadaria.getImagem());
        if (novaPadaria.getNome() != null) existente.setNome(novaPadaria.getNome());
        if (novaPadaria.getPreco() != null) existente.setPreco(novaPadaria.getPreco());
        if (novaPadaria.getQuantidade() != null) existente.setQuantidade(novaPadaria.getQuantidade());


        return padariaRepository.save(existente);
    }

    public void deletarPorId(String id){
        padariaRepository.deleteById(id);
    }

    public List<Padaria> buscarPorCategoria(String categoria) {
        return null;
    }
}


