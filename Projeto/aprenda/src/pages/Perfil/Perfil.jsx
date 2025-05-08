import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Perfil.module.css';
import defaultImg from '../../assets/images/Estudante.svg';
import CardHabilidade from "../../components/CardHabilidade";

function Perfil() {
  const navigate = useNavigate();
  const { perfilConfigurado, token } = useAuth();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    carregarPerfil();
  }, [token]);

  const carregarPerfil = async () => {
    try {
      const res = await axios.get('http://localhost:3001/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuario(res.data);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  };

  const handleImagemSelecionada = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagem', file);

    try {
      await axios.post('http://localhost:3001/upload-imagem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      carregarPerfil(); // Recarrega os dados após o upload
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
    }
  };

  const handleConfigurarPerfil = () => {
    navigate('/configurar-perfil');
  };

  return (
    <div className={styles.perfilContainer}>
      <div className={styles.topo}>
        <h2 className={styles.titulo}>Meu Perfil</h2>
      </div>

      {usuario && (
        <>
          <div className={styles.cardPerfil}>
            <div className={styles.imagemENome}>
              <div
                className={styles.imagemContainer}
                onClick={() => document.getElementById('uploadImagem').click()}
                title="Clique para trocar a imagem"
              >
                <img
                  src={usuario.usuario.imagem_url || defaultImg}
                  alt="Imagem do usuário"
                  className={styles.imagemPerfil}
                />
              </div>

              <input
                type="file"
                id="uploadImagem"
                accept="image/*"
                onChange={handleImagemSelecionada}
                style={{ display: 'none' }}
              />

              <div className={styles.infoUsuario}>
                <h3 className={styles.nome}>
                  {usuario.usuario.nome} {usuario.usuario.sobrenome}
                </h3>
                <p className={styles.username}>@{usuario.usuario.nome_usuario}</p>
                <p><strong>Email:</strong> {usuario.usuario.email}</p>
                <p><strong>Celular:</strong> {usuario.usuario.celular}</p>
                <p><strong>Data de nascimento:</strong> {usuario.usuario.data_nascimento}</p>
              </div>
            </div>

            <button onClick={handleConfigurarPerfil} className={styles.botaoEditar}>
              Adicionar Objetivos e habilidades
            </button>
          </div>

          <div className={styles.secaoCards}>
            <h3 className={styles.subtitulo}>Habilidades que pode ensinar:</h3>
            <CardHabilidade
              dados={usuario.habilidades}
              tipo="ensinar"
              categorias={usuario.categorias}
              subcategorias={usuario.subcategorias}
            />
          </div>

          <div className={styles.secaoCards}>
            <h3 className={styles.subtitulo}>Objetivos de aprendizado:</h3>
            <CardHabilidade
              dados={usuario.objetivos}
              tipo="aprender"
              categorias={usuario.categorias}
              subcategorias={usuario.subcategorias}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Perfil;
