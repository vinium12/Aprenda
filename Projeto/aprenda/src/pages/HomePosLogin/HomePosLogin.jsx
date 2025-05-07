import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Importando Link para navegação
import axios from 'axios';
import styles from './HomePosLogin.module.css';

function HomePosLogin() {
  const [usuariosSimilares, setUsuariosSimilares] = useState([]);

  useEffect(() => {
    const fetchUsuariosSimilares = async () => {
      try {
        const response = await axios.get('http://localhost:3001/usuarios-similares', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsuariosSimilares(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários similares', error);
      }
    };

    fetchUsuariosSimilares();
  }, []);
  
  const usuariosSimilaresSemDuplicados = usuariosSimilares.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.id === value.id
    ))
  );

  return (
    <div className={styles.container}>
      <h2>Usuários com habilidades e objetivos semelhantes</h2>
      <div className={styles.usuariosList}>
        {usuariosSimilaresSemDuplicados.length > 0 ? (
          usuariosSimilaresSemDuplicados.map((usuario, index) => (
            <div key={usuario.id || index} className={styles.usuarioCard}>
              <img src={`http://localhost:3001/${usuario.imagem}`} alt={usuario.nome_usuario} className={styles.usuarioImage} />
              <h3>{usuario.nome} {usuario.sobrenome}</h3>
              <p>{usuario.nome_usuario}</p>
              <Link to={`/perfil-parceiro/${usuario.id}`} className={styles.verPerfilButton}>Ver Perfil</Link>  {/* Link para o perfil do parceiro */}
            </div>
          ))
        ) : (
          <p>Nenhum usuário semelhante encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default HomePosLogin;
