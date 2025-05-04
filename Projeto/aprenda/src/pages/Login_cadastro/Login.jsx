import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import styles from './Login.module.css'

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
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.errors.email && <div>{formik.errors.email}</div>}
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          name="senha"
          value={formik.values.senha}
          onChange={formik.handleChange}
        />
        {formik.errors.senha && <div>{formik.errors.senha}</div>}
      </div>
      <button type="submit">Entrar</button>
      <button type="button" onClick={() => navigate("/cadastro")}>
        Não tem conta? Cadastre-se
      </button>
    </form>
  );
}

export default Login;
