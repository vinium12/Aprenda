import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
          const { token, perfil_configurado } = res.data;
          login(token, perfil_configurado);
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
          console.log(err);
        });
    },
  });

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <img src="./public/AprendaLogo.svg" alt="Logo" className={styles.logo} />
          <h2>Bem vindo de volta!</h2>
          <p>Ainda não tem uma conta? Crie uma agora mesmo e comece a aprender com a gente.</p>
          <button onClick={() => navigate("/cadastro")}>Cadastre-se</button>
          <img src="./src/assets/images/Wave.svg" alt="Wave" className={styles.wave} />
        </div>
  
        <div className={styles.rightPanel}>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
          <img src="./src/assets/icons/Logo_Reduzida.svg" alt="Logo_Reduzida" className={styles.logo} />
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
            {formik.errors.email && <div className={styles.error}>{formik.errors.email}</div>}
  
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Coloque sua senha"
              value={formik.values.senha}
              onChange={formik.handleChange}
            />
            {formik.errors.senha && <div className={styles.error}>{formik.errors.senha}</div>}
  
            <div className={styles.rememberContainer}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">&nbsp;Lembrar-me</label>
            </div>
  
            <button type="submit" className={styles.botaoQueConfirma}>Entrar</button>
  
            <button type="button" className={styles.BotaoDeEntrarPorGoogle}>
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" width="20" />
              Sign in with Google
            </button>
  
            <div className={styles.EsqueceuSenha}>Esqueceu sua senha?</div>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default Login;
