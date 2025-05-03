import styles from "./Footer.module.css";

import Facebook from "../assets/icons/facebook.svg";
import Instagram from "../assets/icons/instagram.svg";
import X from "../assets/icons/x.svg";

const Footer = () => {
  return (
    <footer>
      <div className={styles.conteudo}>
        <img className={styles.logo} src="/AprendaLogo.svg" alt="logo_footer" draggable="false"/>
        <div className={styles.icones}>
          <img className={styles.icone} src={Facebook} alt="Facebook" draggable="false" />
          <img className={styles.icone} src={Instagram} alt="Instagram" draggable="false"/>
          <img className={styles.icone} src={X} alt="X" draggable="false"/>
        </div>
        <p>©Copyright - Todos os Direitos Reservados - Aprenda</p>
      </div>
    </footer>
  );
};

export default Footer;
