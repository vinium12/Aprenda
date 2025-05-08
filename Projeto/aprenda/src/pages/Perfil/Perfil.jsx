import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Perfil.module.css";
import defaultImg from "../../assets/images/Estudante.svg";
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
      const res = await axios.get("http://localhost:3001/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuario(res.data);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    }
  };

  const handleImagemSelecionada = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagem", file);

    try {
      await axios.post("http://localhost:3001/upload-imagem", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      carregarPerfil(); // Recarrega os dados após o upload
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
    }
  };

  const handleConfigurarPerfil = () => {
    navigate("/configurar-perfil");
  };

  const formatarCelular = (celular) => {
    if (!celular) return "";
    const cleaned = celular.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) - ${match[2]}-${match[3]}`;
    }
    return celular;
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
                onClick={() => document.getElementById("uploadImagem").click()}
                title="Clique para trocar a imagem"
              >
                <img
                  src={usuario.usuario.imagem_url || defaultImg}
                  alt="Imagem do usuário"
                  className={styles.imagemPerfil}
                />
                <div className={styles.overlay}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="30"
                    height="30"
                    fill="white"
                  >
                    <path d="M362.7 19.3c25-25 65.5-25 90.5 0l39.5 39.5c25 25 25 65.5 0 90.5L177.9 464.5c-7.6 7.6-17.2 13-27.6 15.6l-111.1 27C16.6 510.1 1.9 495.4 4.9 478.8l27-111.1c2.6-10.4 8-20 15.6-27.6L362.7 19.3zM124.3 343.7l-14.4 59.1 59.1-14.4L403.2 154.3l-44.7-44.7L124.3 343.7z" />
                  </svg>
                </div>
              </div>
              <input
                type="file"
                id="uploadImagem"
                accept="image/*"
                onChange={handleImagemSelecionada}
                style={{ display: "none" }}
              />

              <div className={styles.infoUsuario}>
                <h3 className={styles.nome}>
                  {usuario.usuario.nome} {usuario.usuario.sobrenome}
                </h3>
                <p className={styles.username}>
                  @{usuario.usuario.nome_usuario}
                </p>
                <p>
                  <strong>Email:</strong> {usuario.usuario.email}
                </p>
                <p>
                  <strong>Celular:</strong> {formatarCelular(usuario.usuario.celular)}
                </p>

                <p>
                  <strong>Data de nascimento:</strong>{" "}
                  {new Date(usuario.usuario.data_nascimento).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <button
              onClick={handleConfigurarPerfil}
              className={styles.botaoEditar}
            >
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
}

export default Perfil;
