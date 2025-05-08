import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './PerfilParceiros.module.css';
import defaultImg from '../../assets/images/Estudante.svg';
import { useAuth } from '../../context/AuthContext';
import CardHabilidade from "../../components/CardHabilidade";

function PerfilParceiros() {
  const { id } = useParams();
  const [parceiro, setParceiro] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState({ habilidades: [], objetivos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();
  const [habilidadeSelecionada, setHabilidadeSelecionada] = useState('');
  const [objetivoSelecionado, setObjetivoSelecionado] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || !usuario.id) return;

    const carregarUsuarioLogado = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/me/${usuario.id}`);
        const { usuario: dadosUsuario, habilidades, objetivos } = res.data;
        setUsuarioLogado({ ...dadosUsuario, habilidades, objetivos });
      } catch (erro) {
        console.error('Erro ao carregar usuário logado:', erro);
      }
    };

    carregarUsuarioLogado();
  }, [usuario]);

  useEffect(() => {
    const carregarPerfilParceiro = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/perfil-parceiro/${id}`);
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

  const fazerParceria = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Usuário não autenticado.');
        return;
      }

      if (!habilidadeSelecionada || !objetivoSelecionado) {
        alert('Selecione uma habilidade e um objetivo.');
        return;
      }

      const payload = {
        parceiroId: id,
        habilidadeId: habilidadeSelecionada,
        objetivoId: objetivoSelecionado,
      };

      await axios.post('http://localhost:3001/fazer-parceria', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Parceria registrada com sucesso!');
      navigate('/homePosLogin');
    } catch (error) {
      console.error('Erro ao criar parceria:', error.message, error.stack);
      alert('Erro ao registrar parceria.');
    }
  };

  if (loading) return <p>Carregando perfil do parceiro...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.perfilContainer}>
      <div className={styles.topo}>
        <h2 className={styles.titulo}>Perfil do Parceiro</h2>
      </div>
  
      {parceiro ? (
        <>
          <div className={styles.cardPerfil}>
            <div className={styles.imagemENome}>
              <div className={styles.imagemContainer}>
                <img
                  src={parceiro.usuario.imagem_url || defaultImg}
                  alt="Imagem do parceiro"
                  className={styles.imagemPerfil}
                />
              </div>
  
              <div className={styles.infoUsuario}>
                <h3 className={styles.nome}>{parceiro.usuario.nome_parceiro}</h3>
                <h1 className={styles.username}>{parceiro.usuario.nome_usuario}</h1>
              </div>
            </div>
  
            <div className={styles.btnContainer}>
              <button className={styles.btnParceria} onClick={fazerParceria}>
                Fazer Parceria
              </button>
            </div>
          </div>
  
          <div className={styles.secaoCards}>
            <h3 className={styles.subtitulo}>Habilidades para ensinar:</h3>
            <CardHabilidade
              dados={parceiro.habilidades}
              tipo="ensinar"
              categorias={parceiro.categorias}
              subcategorias={parceiro.subcategorias}
            />
          </div>
  
          <div className={styles.secaoCards}>
            <h3 className={styles.subtitulo}>Objetivos de aprendizagem:</h3>
            <CardHabilidade
              dados={parceiro.objetivos}
              tipo="aprender"
              categorias={parceiro.categorias}
              subcategorias={parceiro.subcategorias}
            />
          </div>
  
          <div className={styles.selectsContainer}>
            <div className={styles.selectBox}>
              <label>Seu objetivo:</label>
              <select
                value={objetivoSelecionado}
                onChange={(e) => setObjetivoSelecionado(e.target.value)}
              >
                <option value="">Selecione</option>
                {usuarioLogado.objetivos.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.categoria_nome} - {o.subcategoria_nome}
                  </option>
                ))}
              </select>
            </div>
  
            <div className={styles.selectBox}>
              <label>Habilidade do parceiro:</label>
              <select
                value={habilidadeSelecionada}
                onChange={(e) => setHabilidadeSelecionada(e.target.value)}
              >
                <option value="">Selecione</option>
                {parceiro.habilidades.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.categoria_nome} - {h.subcategoria_nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : (
        <p>Perfil do parceiro não encontrado.</p>
      )}
    </div>
  );
  
}

export default PerfilParceiros;
