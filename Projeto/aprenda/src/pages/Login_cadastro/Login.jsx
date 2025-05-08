import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google"; // Use o componente diretamente

import styles from "./Login.module.css";

function Login({ onSwitch }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      senha: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email inválido").required("Campo obrigatório"),
      senha: Yup.string()
        .min(6, "Mínimo de 6 caracteres")
        .required("Campo obrigatório"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:3001/login", values)
        .then((res) => {
          const { token, perfil_configurado, usuario } = res.data;
          login(token, perfil_configurado, usuario);
          alert("Login feito com sucesso!");
          if (perfil_configurado) {
            navigate("/HomePosLogin");
          } else {
            navigate("/configurar-perfil");
          }
        })
        .catch((err) => {
          alert("Erro ao fazer login");
          console.error(err);
        });
    },
  });

  const googleLoginSuccess = async (tokenResponse) => {
    try {
      const res = await axios.post("http://localhost:3001/login-google", {
        access_token: tokenResponse.credential,
      });

      const { token, perfil_configurado, usuario } = res.data;
      login(token, perfil_configurado, usuario);
      alert("Login com Google feito com sucesso!");

      if (perfil_configurado) {
        navigate("/HomePosLogin");
      } else {
        navigate("/configurar-perfil");
      }
    } catch (err) {
      alert("Erro ao fazer login com Google");
      console.error(err);
    }
  };

  const googleLoginError = (err) => {
    alert("Erro na autenticação com o Google");
    console.error(err);
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
          <div className={styles.leftPanel}>
            <img
              src="./public/AprendaLogo.svg"
              alt="Logo"
              className={styles.logo}
            />
            <h2>Bem-vindo de volta!</h2>
            <p>
              Ainda não tem uma conta? Crie uma agora mesmo e comece a aprender
              com a gente.
            </p>
            <button onClick={onSwitch ? onSwitch : () => navigate("/cadastro")}>
              Cadastre-se
            </button>
            <img
              src="./src/assets/images/Wave.svg"
              alt="Wave"
              className={styles.wave}
            />
          </div>

          <div className={styles.rightPanel}>
            <form onSubmit={formik.handleSubmit} className={styles.form}>
              <img
                src="./src/assets/icons/Logo_Reduzida.svg"
                alt="Logo_Reduzida"
                className={styles.logo}
              />
              <h2>Login</h2>
              <p>Acesse sua conta para continuar aprendendo.</p>

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Coloque seu Email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && (
                <div className={styles.error}>{formik.errors.email}</div>
              )}

              <label>Senha</label>
              <div className={styles.senhaWrapper}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  placeholder="Coloque sua senha"
                  value={formik.values.senha}
                  onChange={formik.handleChange}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className={styles.toggleSenha}
                  aria-label="Mostrar ou ocultar senha"
                >
                  {mostrarSenha ? (
                    <img
                      src="./src/assets/icons/OlhoAberto.svg"
                      alt="OlhoAberto"
                    />
                  ) : (
                    <img
                      src="./src/assets/icons/olhofechado.svg"
                      alt="olhofechado"
                    />
                  )}
                </button>
              </div>
              {formik.errors.senha && (
                <div className={styles.error}>{formik.errors.senha}</div>
              )}

              {/* <div className={styles.rememberContainer}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">&nbsp;Lembrar-me</label>
              </div> */}

              <button type="submit" className={styles.botaoQueConfirma}>
                Entrar
              </button>

              {/* Componente GoogleLogin diretamente aqui */}
              <GoogleLogin
                onSuccess={googleLoginSuccess}
                onError={googleLoginError}
              />

              {/* <div className={styles.EsqueceuSenha}>Esqueceu sua senha?</div> */}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
