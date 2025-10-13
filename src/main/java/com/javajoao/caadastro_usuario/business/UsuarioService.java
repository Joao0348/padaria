package com.javajoao.caadastro_usuario.business;
import com.javajoao.caadastro_usuario.infrastructure.entitys.Usuario;
import com.javajoao.caadastro_usuario.infrastructure.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;


    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public void salvarUsuario(Usuario usuario) {
        repository.saveAndFlush(usuario);
    }

    public Usuario buscarUsuarioPorCpf(String cpf) {
        return repository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("CPF nao encontrado"));
    }

    public void deletarUsuarioPorCpf(String cpf) {
        repository.deleteByCpf(cpf);
    }
    public void atualizarUsuarioPorCpf(String cpf, Usuario usuario){

        Usuario usuarioEntity = repository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza apenas os campos que foram enviados (não nulos)
        if (usuario.getNome() != null) {
            usuarioEntity.setNome(usuario.getNome());
        }

        if (usuario.getEmail() != null) {
            usuarioEntity.setEmail(usuario.getEmail());
        }

        if (usuario.getTelefone() != null) {
            usuarioEntity.setTelefone(usuario.getTelefone());
        }

        if (usuario.getDataNascimento() != null) {
            usuarioEntity.setDataNascimento(usuario.getDataNascimento());
        }

        // Salva as alterações
        repository.saveAndFlush(usuarioEntity);
    }

    public List<Usuario> ListarTodos() {
        return  repository.findAll();
    }
}
