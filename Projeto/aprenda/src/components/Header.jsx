import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <img
        className={styles.logo}
        src="/AprendaLogo.svg"
        alt="logo_header"
        draggable="false"
        onClick={() => navigate('/')}
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
           
            <button className={styles.BotaoHeader} onClick={() => navigate('/home-logado')}>Home</button>
            <button className={styles.BotaoHeader}onClick={() => navigate('/parcerias')}>Parcerias</button>
            <button className={styles.BotaoHeader}onClick={() => navigate('/sessao')}>Sessão</button>
            <button className={styles.sair} onClick={onLogout}>Sair</button>
            <button className={styles.config} onClick={() => navigate('/perfil')}>
              Meu Perfil
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
