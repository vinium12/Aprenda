import styles from "./homePage.module.css";
import caraDosComputer from "../../assets/images/CaraDosComputer.svg";
import ImgQuemSomos from "../../assets/images/ImagemQuemSomos.svg";
import Foguete from "../../assets/images/Foguete.svg";
import Cérebro from "../../assets/images/Cérebro.svg";
import Maos from "../../assets/images/Maos.svg";
import CF from "../../assets/images/ComoFunciona.svg";
const HomePage = () => {
  return (
    <div className={styles.body}>
      {/* Banner */}
      <section className={styles.baner}>
        <div className={styles.banerContainer}>
          <div className={styles.banerTexto}>
            <h1>Troque conhecimento com quem quer aprender!</h1>
            <p>
              Encontre pessoas reais que querem aprender e ensinar, como você.
            </p>
            <button className={styles.banerBotao}>Comece agora</button>
          </div>
          <img
            src={caraDosComputer}
            alt="Cara no PC"
            className={styles.banerImage}
          />
        </div>
      </section>

      {/* Quem Somos */}
      <section className={styles.sobre}>
        <div className={styles.sobreContainer}>
          <img
            src={ImgQuemSomos}
            alt="Quem somos"
            className={styles.imgSobre}
          />
          <div className={styles.sobreTexto}>
            <h2>Quem somos nós?</h2>
            <p>
              Unimos pessoas que querem aprender e ensinar, criando conexões
              reais e transformando curiosidade em conhecimento.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className={styles.beneficios}>
        <h2>Por que escolher o Aprenda?</h2>
        <p>
          Facilitamos o aprendizado com conexões reais e experiências únicas.
        </p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.iconeCard}>
              <img src={Cérebro} alt="Ícone de cérebro" />
            </div>
            <div className={styles.cardTexto}>
              <h3>Aprenda mais rápido</h3>
              <p>
                Encontre quem compartilha sua paixão e evolua através da troca
                de experiências.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.iconeCard}>
              <img src={Maos} alt="Ícone de mãos" />
            </div>
            <div className={styles.cardTexto}>
              <h3>Crie conexões reais</h3>
              <p>
                Faça parcerias duradouras com pessoas que têm sede de aprender
                como você.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.iconeCard}>
              <img src={Foguete} alt="Ícone de foguete" />
            </div>
            <div className={styles.cardTexto}>
              <h3>Sem barreiras</h3>
              <p>
                Tudo o que você precisa para crescer está a um clique de
                distância, sem burocracias.
              </p>
            </div>
          </div>
        </div>

        <button className={styles.ButtonCard}>Participe</button>
      </section>

      {/* Como Funciona */}
      <section className={styles.funciona}>
        <h2>Como Funciona?</h2>
        <p>
          Entenda o passo a passo da nossa plataforma. Veja como é fácil
          aprender e ensinar com outras pessoas.
        </p>
        <div className={styles.conteudo}>
          <ol className={styles.etapas}>
            <li>
              <div>
                <h3>Crie sua conta</h3>
                <p>
                  Faça seu cadastro e personalize seu perfil com suas
                  habilidades e o que deseja aprender.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Encontre parceiros</h3>
                <p>
                  Receba sugestões de pessoas com interesses compatíveis para
                  trocar conhecimento.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Conecte e aprenda</h3>
                <p>Marque sessões, troque experiências e evoluam juntos.</p>
              </div>
            </li>
          </ol>
          <img src={CF} alt="Como funciona" className={styles.imagemFunciona} />
        </div>
      </section>
      {/* Chamada final */}
      <section className={styles.chamadaFinal}>
        <div>
          <h2>Comece a trocar conhecimento hoje mesmo</h2>
          <p>
            Faça parte de uma comunidade onde cada conexão é uma nova chance de
            aprender e ensinar.
          </p>
          <button className={styles.banerBotao}>Quero fazer parte!</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
