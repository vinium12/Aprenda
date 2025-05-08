import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './HomePosLogin.module.css';

function HomePosLogin() {
  const [usuariosSimilares, setUsuariosSimilares] = useState([]);
  const [parcerias, setParcerias] = useState([]);
  const [sessoesPostadas, setSessoesPostadas] = useState([]); // Novo estado para sessões
  const [parceriaSelecionada, setParceriaSelecionada] = useState(null); // Para armazenar a parceria selecionada para exibir as sessões

  // Buscar usuários similares
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

  // Buscar parcerias realizadas
  useEffect(() => {
    const fetchParcerias = async () => {
      try {
        const response = await axios.get('http://localhost:3001/parcerias', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setParcerias(response.data);
      } catch (error) {
        console.error('Erro ao buscar parcerias', error);
      }
    };

    fetchParcerias();
  }, []);

  // Buscar sessões postadas do parceiro
  const fetchSessoesPostadas = async (parceriaId) => {
    try {
      const response = await axios.get(`http://localhost:3001/sessoes/${parceriaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSessoesPostadas(response.data);
      setParceriaSelecionada(parceriaId); // Definir a parceria selecionada
    } catch (error) {
      console.error('Erro ao buscar sessões postadas', error);
    }
  };

  const usuariosSimilaresSemDuplicados = usuariosSimilares.filter((value, index, self) =>
    index === self.findIndex((t) => t.id === value.id)
  );

  return (
    <div className={styles.container}>
      <h2>Parcerias Realizadas</h2>
      <div className={styles.usuariosList}>
        {parcerias.length > 0 ? (
          parcerias.map((parceria, index) => (
            <div key={parceria.id || index} className={styles.usuarioCard}>
              <h3>{parceria.nome_usuario}</h3>
              <p><strong>Habilidade:</strong> {parceria.habilidade}</p>
              <p><strong>Objetivo:</strong> {parceria.objetivo}</p>
              <Link to={`/perfil-parceiro/${parceria.usuario_id}`} className={styles.verPerfilButton}>Ver Perfil</Link>
              <button
                className={styles.sessoesPostadasButton}
                onClick={() => fetchSessoesPostadas(parceria.id)}
              >
                Sessões Postadas
              </button>
            </div>
          ))
        ) : (
          <p>Nenhuma parceria realizada até o momento.</p>
        )}
      </div>

      {parceriaSelecionada && (
        <div className={styles.sessoesPostadasList}>
          <h3>Sessões Postadas por este parceiro</h3>
          {sessoesPostadas.length > 0 ? (
            sessoesPostadas.map((sessao, index) => (
              <div key={sessao.id || index} className={styles.sessaoCard}>
                <p><strong>Tema:</strong> {sessao.tema}</p>
                <p><strong>Descrição:</strong> {sessao.descricao}</p>
                <a href={`http://localhost:3001/arquivos/${sessao.arquivo}`} download className={styles.downloadButton}>
                  Baixar Arquivo
                </a>
              </div>
            ))
          ) : (
            <p>Este parceiro não postou nenhuma sessão ainda.</p>
          )}
        </div>
      )}

      <h2>Usuários com habilidades e objetivos semelhantes</h2>
      <div className={styles.usuariosList}>
        {usuariosSimilaresSemDuplicados.length > 0 ? (
          usuariosSimilaresSemDuplicados.map((usuario, index) => (
            <div key={usuario.id || index} className={styles.usuarioCard}>
              <img src={`http://localhost:3001/${usuario.imagem}`} alt={usuario.nome_usuario} className={styles.usuarioImage} />
              <h3>{usuario.nome} {usuario.sobrenome}</h3>
              <p>{usuario.nome_usuario}</p>
              <Link to={`/perfil-parceiro/${usuario.id}`} className={styles.verPerfilButton}>Ver Perfil</Link>
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
