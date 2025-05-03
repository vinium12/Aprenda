import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';

import styles from './Cadastro.module.css'

function Cadastro() {
  const [etapa, setEtapa] = useState(1);
  const [dados, setDados] = useState({
    email: '',
    nome: '',
    sobrenome: '',
    celular: '',
    nascimento: '',
    senha: '',
    confirmarSenha: '',
    usuario: ''
  });
  const [erros, setErros] = useState({});

  // Validação por campo
  const schema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Campo obrigatório'),
    nome: Yup.string().required('Campo obrigatório'),
    sobrenome: Yup.string().required('Campo obrigatório'),
    celular: Yup.string().required('Campo obrigatório'),
    nascimento: Yup.date().required('Campo obrigatório'),
    senha: Yup.string().min(6, 'Mínimo de 6 caracteres').required('Campo obrigatório'),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref('senha')], 'As senhas não coincidem')
      .required('Confirme sua senha'),
    usuario: Yup.string().required('Campo obrigatório'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const validarCamposDaEtapa = async () => {
    const camposPorEtapa = {
      1: ['email'],
      2: ['nome', 'sobrenome'],
      3: ['celular', 'nascimento'],
      4: ['senha', 'confirmarSenha'],
      5: ['usuario'],
    };

    const campos = camposPorEtapa[etapa];

    try {
      await schema.validateAt(campos[0], dados); 
      if (campos.length > 1) {
        await schema.validateAt(campos[1], dados);
      }
      setErros({});
      return true;
    } catch (err) {
      setErros({ [err.path]: err.message });
      return false;
    }
  };

  const handleNext = async () => {
    const valido = await validarCamposDaEtapa();
    if (valido) {
      if (etapa < 5) {
        setEtapa(etapa + 1);
      } else {
        enviarCadastro();
      }
    }
  };

  const enviarCadastro = () => {
    const payload = {
      nome: dados.nome.trim(),
      sobrenome: dados.sobrenome.trim(),
      email: dados.email.trim(),
      senha: dados.senha,
      confirmacaoSenha: dados.confirmarSenha,
      celular: dados.celular.trim(),
      data_nascimento: dados.nascimento,
      nome_usuario: dados.usuario.trim()
    };
    
    

    axios.post('http://localhost:3001/cadastro', payload)
      .then(() => {
        alert('Cadastro realizado com sucesso!');
        window.location.href = '/login';
      })
      .catch(err => {
        alert('Erro ao cadastrar usuário');
        console.error(err);
        console.logo(err);
      });
  };

  
  return (
    <div>
      <h2>Cadastro</h2>

      {etapa === 1 && (
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={dados.email} onChange={handleChange} />
          {erros.email && <div style={{ color: 'red' }}>{erros.email}</div>}
          <button onClick={handleNext}>Próximo</button>
        </div>
      )}

      {etapa === 2 && (
        <div>
          <label>Nome:</label>
          <input type="text" name="nome" value={dados.nome} onChange={handleChange} />
          {erros.nome && <div style={{ color: 'red' }}>{erros.nome}</div>}

          <label>Sobrenome:</label>
          <input type="text" name="sobrenome" value={dados.sobrenome} onChange={handleChange} />
          {erros.sobrenome && <div style={{ color: 'red' }}>{erros.sobrenome}</div>}

          <button onClick={handleNext}>Próximo</button>
        </div>
      )}

      {etapa === 3 && (
        <div>
          <label>Celular:</label>
          <input type="text" name="celular" value={dados.celular} onChange={handleChange} />
          {erros.celular && <div style={{ color: 'red' }}>{erros.celular}</div>}

          <label>Data de Nascimento:</label>
          <input type="date" name="nascimento" value={dados.nascimento} onChange={handleChange} />
          {erros.nascimento && <div style={{ color: 'red' }}>{erros.nascimento}</div>}

          <button onClick={handleNext}>Próximo</button>
        </div>
      )}

      {etapa === 4 && (
        <div>
          <label>Senha:</label>
          <input type="password" name="senha" value={dados.senha} onChange={handleChange} />
          {erros.senha && <div style={{ color: 'red' }}>{erros.senha}</div>}

          <label>Confirmar Senha:</label>
          <input type="password" name="confirmarSenha" value={dados.confirmarSenha} onChange={handleChange} />
          {erros.confirmarSenha && <div style={{ color: 'red' }}>{erros.confirmarSenha}</div>}

          <button onClick={handleNext}>Próximo</button>
        </div>
      )}

      {etapa === 5 && (
        <div>
          <label>Nome de Usuário:</label>
          <input type="text" name="usuario" value={dados.usuario} onChange={handleChange} />
          {erros.usuario && <div style={{ color: 'red' }}>{erros.usuario}</div>}
          <button onClick={handleNext}>Cadastrar</button>
        </div>
      )}
    </div>
  );
}

export default Cadastro;
