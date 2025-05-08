import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import defaultImg from "../assets/images/Estudante.svg";



const Header = () => {
  const navigate = useNavigate();
  const { usuario, logout, token } = useAuth();

  const isAuthenticated = !!token;

  return (
    <header className={styles.header}>
      <img
        className={styles.logo}
        src="/AprendaLogo.svg"
        alt="logo_header"
        draggable="false"
        onClick={() => navigate("/")}
      />
      <nav className={styles.botoes}>
        {!isAuthenticated ? (
          <>
            <button className={styles.btnLogin} onClick={() => navigate("/login")}>
              Login
            </button>
            <button className={styles.btnCadastro} onClick={() => navigate("/cadastro")}>
              Cadastro
            </button>
          </>
        ) : (
          <>
            <button className={styles.BotaoHeader} onClick={() => navigate("/home-logado")}>
              Home
            </button>
            <button className={styles.BotaoHeader} onClick={() => navigate("/sessao")}>
              Sessão
            </button>

            <div className={styles.usuarioContainer}>
              <span className={styles.olaUsuario}>
                Olá, {usuario?.nome?.split(" ")[0]}!
              </span>
              <img
                src={usuario.imagem_url || defaultImg} 
                alt="Perfil"
                className={styles.fotoPerfilMini}
                onClick={() => navigate("/perfil")}
              />
            </div>

            <button className={styles.sair} onClick={logout}>
              Sair
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
