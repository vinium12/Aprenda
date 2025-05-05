import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    
    
    
     // codigo abaixo mudado

     console.log("Enviando payload:", payload);

     axios.post('http://localhost:3001/cadastro', payload)
     navigate('/login');
  }

  // codigo acima mudado

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.rightPanel}>
          <form className={styles.form}>
            {etapa === 1 && (
              <>
                <img src="./src/assets/icons/Logo_Reduzida.svg" alt="Logo" className={styles.logo} />
                <h2>Cadastro</h2>
                <p>Seja bem-vindo! Comece agora sua jornada de aprendizado.</p>
  
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Coloque seu Email"
                  value={dados.email}
                  onChange={handleChange}
                />
                {erros.email && <div className={styles.error}>{erros.email}</div>}
  
                <button type="button" className={styles.BotaoDeContinuar} onClick={handleNext}>Próxima Etapa</button>
              </>
            )}
  
            {etapa === 2 && (
              <>
                <h2>Vamos lá!</h2>
                <p>Crie sua conta e comece sua jornada de aprendizado.</p>
  
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Coloque seu Nome"
                  value={dados.nome}
                  onChange={handleChange}
                />
                {erros.nome && <div className={styles.error}>{erros.nome}</div>}
  
                <label>Sobrenome:</label>
                <input
                  type="text"
                  name="sobrenome"
                  placeholder="Coloque seu Sobrenome"
                  value={dados.sobrenome}
                  onChange={handleChange}
                />
                {erros.sobrenome && <div className={styles.error}>{erros.sobrenome}</div>}
  
                <button type="button" className={styles.BotaoDeContinuar} onClick={handleNext}>Próxima Etapa</button>
              </>
            )}
  
            {etapa === 3 && (
              <>
                <h2>Falta pouco</h2>
                <p>Crie sua conta e comece sua jornada de aprendizado.</p>
  
                <label>Celular:</label>
                <input
                  type="text"
                  name="celular"
                  placeholder="Coloque seu Telefone"
                  value={dados.celular}
                  onChange={handleChange}
                />
                {erros.celular && <div className={styles.error}>{erros.celular}</div>}
  
                <label>Data de Nascimento:</label>
                <input
                  type="date"
                  name="nascimento"
                  value={dados.nascimento}
                  onChange={handleChange}
                />
                {erros.nascimento && <div className={styles.error}>{erros.nascimento}</div>}
  
                <button type="button" className={styles.BotaoDeContinuar} onClick={handleNext}>Próxima Etapa</button>
              </>
            )}
  
            {etapa === 4 && (
              <>
                <h2>Quase lá!</h2>
                <label>Senha:</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="Coloque sua Senha"
                  value={dados.senha}
                  onChange={handleChange}
                />
                {erros.senha && <div className={styles.error}>{erros.senha}</div>}
  
                <label>Confirmar Senha:</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Confirme sua Senha"
                  value={dados.confirmarSenha}
                  onChange={handleChange}
                />
                {erros.confirmarSenha && <div className={styles.error}>{erros.BotaoDeContinuar}</div>}
  
                <p>A senha deve conter:</p>
                <ul>
                  <li>8+ caracteres</li>
                  <li>1 letra maiúscula</li>
                  <li>1 letra minúscula</li>
                </ul>
  
                <button type="button" className={styles.BotaoDeContinuar} onClick={handleNext}>Próxima Etapa</button>
              </>
            )}
  
            {etapa === 5 && (
              <>
                <h2>Finalizando</h2>
                <p>Escolha Como deseja ser chamado!</p>
  
                <label>Nome de Usuário:</label>
                <input
                  type="text"
                  name="usuario"
                  placeholder="Coloque Seu Nome de Usuário"
                  value={dados.usuario}
                  onChange={handleChange}
                />
                {erros.usuario && <div className={styles.error}>{erros.usuario}</div>}
  
                <button type="button" className={styles.BotaoDeContinuar} onClick={handleNext}>Finalizar</button>
              </>
            )}
          </form>
        </div>

        <div className={styles.leftPanel}>
          <img src="./public/AprendaLogo.svg" alt="Logo" className={styles.logo} />
          <h2>Bem-vindo!</h2>
          <p>Já tem uma conta? Faça o login e continue sua jornada de aprendizado.</p>
          <button onClick={() => navigate("/login")}>Entrar</button>
          <img src="./src/assets/images/Wave.svg" alt="Wave" className={styles.wave} />
        </div>
      </div>
    </div>
  );  
}

export default Cadastro;
