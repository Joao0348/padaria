package com.javajoao.caadastro_usuario.controller;

import com.javajoao.caadastro_usuario.business.PadariaService;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Padaria;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(originPatterns = "*")
@RestController
@RequestMapping("/padaria")
public class PadariaController {

    private final PadariaService padariaService;

    public PadariaController(PadariaService padariaService) {
        this.padariaService = padariaService;
    }

    @PostMapping
    public ResponseEntity<Padaria> salvarPadaria(@RequestBody Padaria padaria){
        Padaria salvo = padariaService.salvarPadaria(padaria);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Padaria> buscarPorId(@PathVariable String id){
        Padaria padaria = padariaService.buscarPorId(id);
        return ResponseEntity.ok(padaria);
    }

    @GetMapping
    public ResponseEntity<List<Padaria>> listarTodos(){
        List<Padaria> lista = padariaService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Padaria> atualizarPadaria(@PathVariable String id, @RequestBody Padaria padaria){
        Padaria atualizado = padariaService.atualizarPadaria(id, padaria);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePorId(@PathVariable String id){
        padariaService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }





    // GET /api/produtos/categoria/{categoria}
    @GetMapping("/produtos/categoria/{categoria}")
    public ResponseEntity<List<Padaria>> buscarPorCategoria(@PathVariable String categoria) {
        List<Padaria> produtos = padariaService.buscarPorCategoria(categoria);
        return ResponseEntity.ok(produtos);
    }
}