import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ isAuthenticated, onLogout, onConfigurarPerfil }) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <img
        className={styles.logo}
        src="/AprendaLogo.svg"
        alt="logo_header"
        draggable="false"
      />
      <nav className={styles.botoes}>
        {!isAuthenticated ? (
          <>
            <button className={styles.btnLogin} onClick={() => navigate('/login')}>
              Login
            </button>
            <button className={styles.btnCadastro} onClick={() => navigate('/cadastro')}>
              Cadastro
            </button>
          </>
        ) : (
          <>
            <button onClick={onLogout}>Sair</button>
            <button onClick={onConfigurarPerfil}>Configurar Perfil</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
