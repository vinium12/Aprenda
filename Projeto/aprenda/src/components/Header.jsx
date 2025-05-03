import styles from "./Header.module.css";

const Header = () => {
  return (
    <header>
      {/* <div className={styles.esquerda}> */}
        <img
          className={styles.logo}
          src="/AprendaLogo.svg"
          alt="logo_header"
          draggable="false"
        />
      {/* </div> */}
      {/* <div className={styles.direita}> */}
        <nav className={styles.botoes}>
          <button className={styles.btnLogin}>Login</button>
          <button className={styles.btnCadastro}>Cadastro</button>
        </nav>
      {/* </div> */}
    </header>
  );
};

export default Header;
