import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './PerfilParceiros.module.css';
import defaultImg from '../../assets/images/Estudante.svg';
import { useAuth } from '../../context/AuthContext';

function PerfilParceiros() {
  const { id } = useParams(); // ID do parceiro na URL
  const [parceiro, setParceiro] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState({ habilidades: [], objetivos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  const fazerParceria = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        alert('Usuário não autenticado.');
        return;
      }
  
      const userId = usuarioLogado.id; // ID do usuário logado
  
      console.log('ID do usuário logado:', userId);
      console.log('Habilidades do usuário:', usuarioLogado.habilidades);
      console.log('Objetivos do usuário:', usuarioLogado.objetivos);
      console.log('Habilidades do parceiro:', parceiro.habilidades);
      console.log('Objetivos do parceiro:', parceiro.objetivos);
  
      // Agora, a parceria pode ser feita sem as verificações de habilidades/objetivos em comum
      const payload = {
        parceiroId: id,
      };
  
      const res = await axios.post('http://localhost:3001/fazer-parceria', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      alert('Parceria registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar parceria:', error);
      alert('Erro ao registrar parceria.');
    }
  };

  useEffect(() => {
    const carregarPerfilParceiro = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/perfil-parceiro/${id}`);
        console.log("Parceiro:", res.data);
        setParceiro(res.data);
      } catch (erro) {
        console.error('Erro ao carregar perfil do parceiro:', erro);
        setError('Não foi possível carregar o perfil do parceiro.');
      } finally {
        setLoading(false);
      }
    };

    carregarPerfilParceiro();
  }, [id]);

  // Carregar usuário logado
  useEffect(() => {
    const carregarUsuarioLogado = async () => {
      if (!usuario?.id) return;

      try {
        const res = await axios.get(`http://localhost:3001/perfil-usuario/${usuario.id}`);
        console.log("Usuário logado:", res.data);
        setUsuarioLogado({ ...res.data, id: usuario.id });
      } catch (erro) {
        console.error('Erro ao carregar usuário logado:', erro);
      }
    };

    carregarUsuarioLogado();
  }, [usuario]);

  if (loading) return <p>Carregando perfil do parceiro...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Perfil do Parceiro</h1>

      {parceiro ? (
        <>
          <div className={styles.imagemContainer}>
            <img
              src={parceiro.usuario.imagem_url || defaultImg}
              alt="Imagem do parceiro"
              className={styles.imagemPerfil}
            />
          </div>

          <div className={styles.dadosPerfil}>
            <p><strong>Nome de usuário:</strong> {parceiro.usuario.nome_usuario}</p>
          </div>

          <div className={styles.habilidades}>
            <h3>Habilidades para ensinar:</h3>
            {parceiro.habilidades.length > 0 ? (
              <ul>
                {parceiro.habilidades.map((hab, i) => (
                  <li key={i}>
                    {hab.categoria_nome} - {hab.subcategoria_nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Este parceiro ainda não adicionou habilidades.</p>
            )}
          </div>

          <div className={styles.objetivos}>
            <h3>Objetivos de aprendizagem:</h3>
            {parceiro.objetivos.length > 0 ? (
              <ul>
                {parceiro.objetivos.map((obj, i) => (
                  <li key={i}>
                    {obj.categoria_nome} - {obj.subcategoria_nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Este parceiro ainda não adicionou objetivos.</p>
            )}
          </div>

          <button className={styles.btnParceria} onClick={fazerParceria}>
            Fazer Parceria
          </button>

        </>
      ) : (
        <p>Perfil do parceiro não encontrado.</p>
      )}
    </div>
  );
}

export default PerfilParceiros;
