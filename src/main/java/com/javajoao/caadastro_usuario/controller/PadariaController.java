package com.javajoao.caadastro_usuario.controller;
import com.javajoao.caadastro_usuario.business.PadariaService;
import  com.javajoao.caadastro_usuario.infrastructure.entitys.Padaria;
import  lombok.RequiredArgsConstructor;
import  org.springframework.http.HttpStatus;
import  org.springframework.http.ResponseEntity;
import  org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/padaria")

public class PadariaController {

    private final PadariaService padariaService;

    public PadariaController(PadariaService padariaService) {
        this.padariaService = padariaService;
    }

    @PostMapping
    public ResponseEntity<Void> salvarPadaria(@RequestBody Padaria padaria) {
        padariaService.salvarPadaria(padaria);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Padaria> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(padariaService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        padariaService.deletarPorId(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}")
    public ResponseEntity<Void> atualizarPadaria(@PathVariable Long id, @RequestBody Padaria padaria) {
        padariaService.atualizarPadaria(id, padaria);
        return ResponseEntity.ok().build();
    }
}
