import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Perfil.module.css';

function Perfil() {
  const navigate = useNavigate();
  const { perfilConfigurado } = useAuth();

  const handleConfigurarPerfil = () => {  
    navigate('/configurar-perfil');
  };

  return (
    <div className={styles.container}>
      <h1>Meu Perfil</h1>

      {/* Dados do perfil aqui futuramente */}

      <button onClick={handleConfigurarPerfil} className={styles.btnConfigurar}>
        Configurar Perfil
      </button>
    </div>
  );
}

export default Perfil;
