import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../HomePage/homePage.module.css';

import caraDosComputer from "../../assets/images/CaraDosComputer.svg";
import ImgQuemSomos from "../../assets/images/ImagemQuemSomos.svg";
import Foguete from "../../assets/images/Foguete.svg";
import Cérebro from "../../assets/images/Cérebro.svg";
import Maos from "../../assets/images/Maos.svg";
import CF from "../../assets/images/ComoFunciona.svg";

function HomePosLogin() {
  const [usuariosSimilares, setUsuariosSimilares] = useState([]);
  const navigate = useNavigate();

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

  const usuariosSimilaresSemDuplicados = usuariosSimilares.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.id === value.id)
  );

  return (
    <div className={styles.body}>
      {/* Banner */}
      <section className={styles.baner}>
        <div className={styles.banerContainer}>
          <div className={styles.banerTexto}>
            <h1>Bem-vindo de volta!</h1>
            <p>Conecte-se com pessoas que compartilham suas paixões.</p>
            <button className={styles.banerBotao} onClick={() => navigate('/explorar')}>Explorar mais</button>
          </div>
          <img src={caraDosComputer} alt="Cara no PC" className={styles.banerImage} />
        </div>
      </section>

      {/* Quem Somos */}
      <section className={styles.sobre}>
        <div className={styles.sobreContainer}>
          <img src={ImgQuemSomos} alt="Quem somos" className={styles.imgSobre} />
          <div className={styles.sobreTexto}>
            <h2>Quem somos nós?</h2>
            <p>
              Unimos pessoas que querem aprender e ensinar, criando conexões reais e transformando curiosidade em conhecimento.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className={styles.beneficios}>
        <h2>Por que continuar no Aprenda?</h2>
        <p>Conexões reais para impulsionar seu aprendizado.</p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.iconeCard}>
              <img src={Cérebro} alt="Ícone de cérebro" />
            </div>
            <div className={styles.cardTexto}>
              <h3>Aprenda mais rápido</h3>
              <p>Encontre quem compartilha sua paixão e evolua através da troca de experiências.</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.iconeCard}>
              <img src={Maos} alt="Ícone de mãos" />
            </div>
            <div className={styles.cardTexto}>
              <h3>Crie conexões reais</h3>
              <p>Faça parcerias duradouras com pessoas que têm sede de aprender como você.</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.iconeCard}>
              <img src={Foguete} alt="Ícone de foguete" />
            </div>
            <div className={styles.cardTexto}>
              <h3>Sem barreiras</h3>
              <p>Tudo o que você precisa para crescer está a um clique de distância, sem burocracias.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usuários Similares */}
      <section className={styles.beneficios}>
        <h2>Usuários com habilidades semelhantes</h2>
        <p>Veja quem está alinhado com seus interesses.</p>

        <div className={styles.cards}>
          {usuariosSimilaresSemDuplicados.length > 0 ? (
            usuariosSimilaresSemDuplicados.map((usuario, index) => (
              <div key={usuario.id || index} className={styles.card}>
                <div className={styles.iconeCard}>
                  <img
                    src={`http://localhost:3001/${usuario.imagem}`}
                    alt={usuario.nome_usuario}
                    style={{ width: '100%', height: 'auto', borderRadius: '1rem' }}
                  />
                </div>
                <div className={styles.cardTexto}>
                  <h3>{usuario.nome} {usuario.sobrenome}</h3>
                  <p>@{usuario.nome_usuario}</p>
                  <Link to={`/perfil-parceiro/${usuario.id}`} className={styles.banerBotao}>
                    Ver Perfil
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>Nenhum usuário semelhante encontrado.</p>
          )}
        </div>
      </section>

      {/* Como Funciona */}
      <section className={styles.funciona}>
        <h2>Como Funciona?</h2>
        <p>
          Entenda o passo a passo da nossa plataforma. Veja como é fácil aprender e ensinar com outras pessoas.
        </p>
        <div className={styles.conteudo}>
          <ol className={styles.etapas}>
            <li>
              <div>
                <h3>Atualize seu perfil</h3>
                <p>Inclua suas habilidades e o que deseja aprender para melhorar suas conexões.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Veja recomendações</h3>
                <p>Acesse sugestões automáticas de pessoas com interesses compatíveis.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Converse e evolua</h3>
                <p>Troque experiências, marque encontros e cresça junto com sua rede.</p>
              </div>
            </li>
          </ol>
          <img src={CF} alt="Como funciona" className={styles.imagemFunciona} />
        </div>
      </section>

      {/* Chamada Final */}
      <section className={styles.chamadaFinal}>
        <div>
          <h2>Continue trocando conhecimento</h2>
          <p>Você está a um passo de descobrir novos caminhos e crescer ainda mais.</p>
          <button className={styles.banerBotao} onClick={() => navigate('/explorar')}>Explorar mais</button>
        </div>
      </section>
    </div>
  );
}

export default HomePosLogin;
