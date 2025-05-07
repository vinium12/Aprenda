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
  const [habilidadeSelecionada, setHabilidadeSelecionada] = useState('');
  const [objetivoSelecionado, setObjetivoSelecionado] = useState('');

  const fazerParceria = async () => {


    useEffect(() => {
      if (!usuario || !usuario.id) return;  // Se o usuário ou o ID não estiverem disponíveis, sai do efeito
    
      const carregarUsuarioLogado = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/me/${usuario.id}`);
          const { usuario: dadosUsuario, habilidades, objetivos } = res.data;
          setUsuarioLogado({
            ...dadosUsuario,
            habilidades,
            objetivos
          });
        } catch (erro) {
          console.error('Erro ao carregar usuário logado:', erro);
        }
      };
    
      carregarUsuarioLogado();
    }, [usuario]); // O efeito depende do estado de 'usuario'
    


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
    console.log("Usuário do AuthContext:", usuario);  // Verifique se o usuário foi carregado corretamente
  }, [usuario]);
  

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
          <div className={styles.selecaoParceria}>


  <div>
    <label>Escolha sua habilidade:</label>
    <select
      value={habilidadeSelecionada}
      onChange={(e) => setHabilidadeSelecionada(e.target.value)}
    >
      <option value="">Selecione</option>
      {usuarioLogado.habilidades.map((h) => (
        <option key={h.id} value={h.id}>
          {h.categoria_nome} - {h.subcategoria_nome}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Escolha o objetivo do parceiro:</label>
    <select
      value={objetivoSelecionado}
      onChange={(e) => setObjetivoSelecionado(e.target.value)}
    >
      <option value="">Selecione</option>
      {parceiro.objetivos.map((o) => (
        <option key={o.id} value={o.id}>
          {o.categoria_nome} - {o.subcategoria_nome}
        </option>
      ))}
    </select>
  </div>
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
