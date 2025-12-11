package com.javajoao.caadastro_usuario.controller;

import com.javajoao.caadastro_usuario.business.UsuarioService;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario) {
        System.out.println("Recebendo POST /usuarios -> " + usuario.getNome());

        Usuario usuarioSalvo = usuarioService.salvarUsuario(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
    }

    @GetMapping("/cpf")
    public ResponseEntity<Usuario> buscarUsuarioPorCpf(@RequestParam String cpf) {
        Usuario usuario = usuarioService.buscarUsuarioPorCpf(cpf);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/cpf")
    public ResponseEntity<Void> deletarUsuarioPorCpf(@RequestParam String cpf) {
        usuarioService.deletarUsuarioPorCpf(cpf);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/cpf")
    public ResponseEntity<Usuario> atualizarUsuarioPorCpf(@RequestParam String cpf,
                                                          @RequestBody Usuario usuario) {

        usuarioService.atualizarUsuarioPorCpf(cpf, usuario);
        Usuario usuarioAtualizado = usuarioService.buscarUsuarioPorCpf(cpf);

        if (usuarioAtualizado == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(usuarioAtualizado);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }
}
