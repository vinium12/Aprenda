import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Perfil.module.css';
import defaultImg from '../../assets/images/Estudante.svg'; // imagem padrão

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
    <div className={styles.container}>
      <h1>Meu Perfil</h1>

      {usuario && (
        <>
          <input
            type="file"
            id="uploadImagem"
            accept="image/*"
            onChange={handleImagemSelecionada}
            style={{ display: 'none' }}
          />

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
            <div className={styles.overlay}>
              {usuario.usuario.imagem_url ? 'Trocar imagem' : 'Salvar imagem'}
            </div>
          </div>

          <div className={styles.dadosPerfil}>
            <p><strong>Nome de usuário:</strong> {usuario.usuario.nome_usuario}</p>
            <p><strong>Nome:</strong> {usuario.usuario.nome} {usuario.usuario.sobrenome}</p>
            <p><strong>Email:</strong> {usuario.usuario.email}</p>
            <p><strong>Celular:</strong> {usuario.usuario.celular}</p>
            <p><strong>Data de nascimento:</strong> {usuario.usuario.data_nascimento}</p>
          </div>

          <div className={styles.habilidades}>
            <h3>Habilidades para ensinar:</h3>
            {usuario.habilidades.length > 0 ? (
              <ul>
                {usuario.habilidades.map((hab, i) => (
                  <li key={i}>
                    {hab.categoria_nome} - {hab.subcategoria_nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Você ainda não adicionou habilidades.</p>
            )}
          </div>

          <div className={styles.objetivos}>
            <h3>Objetivos de aprendizagem:</h3>
            {usuario.objetivos.length > 0 ? (
              <ul>
                {usuario.objetivos.map((obj, i) => (
                  <li key={i}>
                    {obj.categoria_nome} - {obj.subcategoria_nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Você ainda não adicionou objetivos.</p>
            )}
          </div>

          <button onClick={handleConfigurarPerfil} className={styles.btnConfigurar}>
            Configurar habilidades e objetivos
          </button>
        </>
      )}
    </div>
  );
}

export default Perfil;
