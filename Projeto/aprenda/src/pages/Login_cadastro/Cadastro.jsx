import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Cadastro.module.css';

function Cadastro({ onSwitch }) {
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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

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

    console.log("Enviando payload:", payload);
    axios.post('http://localhost:3001/cadastro', payload);
    navigate('/login');
  };

  const transicao = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4 }
  };

  return (
    <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.rightPanel}>
          <form className={styles.form}>
            <AnimatePresence mode="wait">
              {etapa === 1 && (
                <motion.div key="etapa1" {...transicao}>
                  <img src="./src/assets/icons/Logo_Reduzida.svg" alt="Logo" className={styles.logo} />
                  <h2>Cadastre-se</h2>
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
                </motion.div>
              )}

              {etapa === 2 && (
                <motion.div key="etapa2" {...transicao}>
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
                </motion.div>
              )}

              {etapa === 3 && (
                <motion.div key="etapa3" {...transicao}>
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
                </motion.div>
              )}

              {etapa === 4 && (
                <motion.div key="etapa4" {...transicao}>
                  <h2>Quase lá!</h2>
                  <label>Senha:</label>
                    <div className={styles.senhaWrapper}>
                      <input
                        type={mostrarSenha ? "text" : "password"}
                        name="senha"
                        placeholder="Coloque sua Senha"
                        value={dados.senha}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className={styles.toggleSenha}
                        aria-label="Mostrar ou ocultar senha"
                      >
                        <img
                          src={
                            mostrarSenha
                              ? "./src/assets/icons/OlhoAberto.svg"
                              : "./src/assets/icons/olhofechado.svg"
                          }
                          alt="Mostrar/Ocultar"
                        />
                      </button>
                    </div>
                    {erros.senha && <div className={styles.error}>{erros.senha}</div>}


                    <label>Confirmar Senha:</label>
                      <div className={styles.senhaWrapper}>
                        <input
                          type={mostrarConfirmarSenha ? "text" : "password"}
                          name="confirmarSenha"
                          placeholder="Confirme sua Senha"
                          value={dados.confirmarSenha}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                          className={styles.toggleSenha}
                          aria-label="Mostrar ou ocultar senha"
                        >
                          <img
                            src={
                              mostrarConfirmarSenha
                                ? "./src/assets/icons/OlhoAberto.svg"
                                : "./src/assets/icons/olhofechado.svg"
                            }
                            alt="Mostrar/Ocultar"
                          />
                        </button>
                      </div>
                        {erros.confirmarSenha && (
                      <div className={styles.error}>{erros.confirmarSenha}</div>
                    )}
                     <button type="button" className={styles.BotaoDeContinuar} onClick={handleNext}>Próxima Etapa</button>
                </motion.div>
              )}

              {etapa === 5 && (
                <motion.div key="etapa5" {...transicao}>
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
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        <div className={styles.leftPanel}>
          <img src="./public/AprendaLogo.svg" alt="Logo" className={styles.logo} />
          <h2>Seja <br /> Bem-vindo!</h2>
          <p>Já tem uma conta? Faça o login e continue sua jornada de aprendizado.</p>
          <button onClick={() => navigate("/login")}>Entrar</button>
          <img src="./src/assets/images/Wave.svg" alt="Wave" className={styles.wave} />
        </div>
      </div>
    </div>
    </motion.div>
  );
}

export default Cadastro;
