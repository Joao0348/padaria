package com.javajoao.caadastro_usuario.business;
import com.javajoao.caadastro_usuario.exceptions.ResourceNotFoundException;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Padaria;
import com.javajoao.caadastro_usuario.infrastructure.repository.PadariaRepository;
import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class PadariaService {

    @Autowired
    private PadariaRepository repository;

    public void salvarPadaria(Padaria padaria) {
        repository.saveAndFlush(padaria);
    }
    public Padaria buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }
    public void deletarPorId(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        repository.deleteById(id);
    }
    public void atualizarPadaria(Long id, Padaria novaPadaria){
        Padaria existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item de padaria nao encontrado com id: " + id)) ;
        existente.setNome(novaPadaria.getNome());
        existente.setPreco(novaPadaria.getPreco());
        existente.setQuantidade(novaPadaria.getQuantidade());

        repository.save(existente);
    }



}
