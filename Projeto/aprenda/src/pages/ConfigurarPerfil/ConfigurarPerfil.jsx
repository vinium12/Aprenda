import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SelectWithLabel from "../../components/Select"; // Importando o SelectWithLabel
import styles from "./ConfigurarPerfil.module.css";
import Estudante from "../../assets/images/Estudante.svg";
const ConfigurarPerfil = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategoriasEnsinar, setSubcategoriasEnsinar] = useState([]);
  const [subcategoriasAprender, setSubcategoriasAprender] = useState([]);
  const [habilidadesEnsinar, setHabilidadesEnsinar] = useState([]);
  const [habilidadesAprender, setHabilidadesAprender] = useState([]);
  const [habilidadeEnsinar, setHabilidadeEnsinar] = useState({
    categoria: "",
    subcategoria: "",
    nivel: "",
    descricao: "",
  });
  const [habilidadeAprender, setHabilidadeAprender] = useState({
    categoria: "",
    subcategoria: "",
    nivel: "",
    descricao: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar categorias. Tente novamente.");
      });
  }, []);

  useEffect(() => {
    if (habilidadeEnsinar.categoria) {
      axios
        .get(
          `http://localhost:3001/subcategorias/${habilidadeEnsinar.categoria}`
        )
        .then((res) => setSubcategoriasEnsinar(res.data))
        .catch((err) => {
          console.error(err);
          setError(
            "Erro ao carregar subcategorias para ensinar. Tente novamente."
          );
        });
    }
  }, [habilidadeEnsinar.categoria]);

  useEffect(() => {
    if (habilidadeAprender.categoria) {
      axios
        .get(
          `http://localhost:3001/subcategorias/${habilidadeAprender.categoria}`
        )
        .then((res) => setSubcategoriasAprender(res.data))
        .catch((err) => {
          console.error(err);
          setError(
            "Erro ao carregar subcategorias para aprender. Tente novamente."
          );
        });
    }
  }, [habilidadeAprender.categoria]);

  const adicionarHabilidadeEnsinar = () => {
    if (
      habilidadeEnsinar.categoria &&
      habilidadeEnsinar.subcategoria &&
      habilidadeEnsinar.nivel
    ) {
      setHabilidadesEnsinar((prev) => [...prev, habilidadeEnsinar]);
      setHabilidadeEnsinar({
        categoria: "",
        subcategoria: "",
        nivel: "",
        descricao: "",
      });
    } else {
      setError("Categoria, Subcategoria e Nível são obrigatórios");
    }
  };

  const adicionarHabilidadeAprender = () => {
    if (
      habilidadeAprender.categoria &&
      habilidadeAprender.subcategoria &&
      habilidadeAprender.nivel
    ) {
      setHabilidadesAprender((prev) => [...prev, habilidadeAprender]);
      setHabilidadeAprender({
        categoria: "",
        subcategoria: "",
        nivel: "",
        descricao: "",
      });
    } else {
      setError("Categoria, Subcategoria e Nível são obrigatórios");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidHabilidadeEnsinar = habilidadesEnsinar.some(
      (h) => !h.categoria || !h.subcategoria || !h.nivel
    );
    const invalidHabilidadeAprender = habilidadesAprender.some(
      (h) => !h.categoria || !h.subcategoria || !h.nivel
    );

    if (invalidHabilidadeEnsinar || invalidHabilidadeAprender) {
      setError(
        "Por favor, preencha todas as categorias, subcategorias e níveis antes de enviar."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/configurar-perfil",
        {
          habilidades_ensinar: habilidadesEnsinar.map((h) => ({
            categoria_id: h.categoria,
            subcategoria_id: h.subcategoria,
            nivel_abilidade: h.nivel,
            descricao: h.descricao,
          })),
          habilidades_aprender: habilidadesAprender.map((h) => ({
            categoria_id: h.categoria,
            subcategoria_id: h.subcategoria,
            nivel_abilidade: h.nivel,
            descricao: h.descricao,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Perfil configurado com sucesso!");
      navigate("/homeposlogin");
    } catch (err) {
      console.error(err);
      setError("Erro ao configurar perfil. Tente novamente.");
    }
  };

  const options = [
    { value: "baixo", label: "Baixo" },
    { value: "medio", label: "Médio" },
    { value: "avancado", label: "Avançado" },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.Esquerda}>
        <img src={Estudante} alt="" className={styles.Image} />
        <p className={styles.titulo}>Bem Vindo Ao Aprenda!</p>
        <p className={styles.subtitulo}>
          Antes de começar, conte um pouco sobre o que você sabe e o que quer
          aprender.
        </p>
      </div>

      <form className={styles.Direita}>
        <h2>Habilidades que posso ensinar</h2>
        <SelectWithLabel
          label="Categoria"
          value={habilidadeEnsinar.categoria}
          onChange={(e) =>
            setHabilidadeEnsinar({
              ...habilidadeEnsinar,
              categoria: e.target.value,
              subcategoria: "",
              // Resetar subcategoria ao mudar a categoria
            })
          }
          options={categorias.map((c) => ({ value: c.id, label: c.nome }))}
        />

        <SelectWithLabel
          label="Subcategoria"
          value={habilidadeEnsinar.subcategoria}
          onChange={(e) =>
            setHabilidadeEnsinar({
              ...habilidadeEnsinar,
              subcategoria: e.target.value,
            })
          }
          options={
            habilidadeEnsinar.categoria === "" // Verifica se a categoria não está selecionada
              ? [{ value: "", label: "Selecione uma categoria" }] // Exibe a opção padrão "Selecione uma subcategoria" quando não há categoria
              : subcategoriasEnsinar.length > 0
              ? subcategoriasEnsinar.map((s) => ({
                  value: s.id,
                  label: s.nome,
                }))
              : [{ value: "", label: "Nenhuma subcategoria disponível" }] // Caso não haja subcategorias
          }
        />

        <SelectWithLabel
          label="Nível"
          value={habilidadeEnsinar.nivel}
          onChange={(e) =>
            setHabilidadeEnsinar({
              ...habilidadeEnsinar,
              nivel: e.target.value,
            })
          }
          options={options}
        />

        <input
          type="text"
          placeholder="Descrição"
          value={habilidadeEnsinar.descricao}
          onChange={(e) =>
            setHabilidadeEnsinar({
              ...habilidadeEnsinar,
              descricao: e.target.value,
            })
          }
        />
        <button onClick={adicionarHabilidadeEnsinar}>Adicionar</button>

        <h3>Habilidades adicionadas para ensinar:</h3>
        {habilidadesEnsinar.map((habilidade, index) => (
          <div key={index}>
            <p>
              <strong>Categoria:</strong> {habilidade.categoria}
            </p>
            <p>
              <strong>Subcategoria:</strong> {habilidade.subcategoria}
            </p>
            <p>
              <strong>Nível:</strong> {habilidade.nivel}
            </p>
            <p>
              <strong>Descrição:</strong> {habilidade.descricao}
            </p>
          </div>
        ))}

        <h2>Habilidades que desejo aprender</h2>
        <SelectWithLabel
          label="Categoria"
          value={habilidadeAprender.categoria}
          onChange={(e) =>
            setHabilidadeAprender({
              ...habilidadeAprender,
              categoria: e.target.value,
              subcategoria: "", // Resetar subcategoria ao mudar a categoria
            })
          }
          options={categorias.map((c) => ({ value: c.id, label: c.nome }))}
        />

        <SelectWithLabel
          label="Subcategoria"
          value={habilidadeAprender.subcategoria}
          onChange={(e) =>
            setHabilidadeAprender({
              ...habilidadeAprender,
              subcategoria: e.target.value,
            })
          }
          options={subcategoriasAprender.map((s) => ({
            value: s.id,
            label: s.nome,
          }))}
        />

        <SelectWithLabel
          label="Nível"
          value={habilidadeAprender.nivel}
          onChange={(e) =>
            setHabilidadeAprender({
              ...habilidadeAprender,
              nivel: e.target.value,
            })
          }
          options={options}
        />

        <input
          type="text"
          placeholder="Descrição"
          value={habilidadeAprender.descricao}
          onChange={(e) =>
            setHabilidadeAprender({
              ...habilidadeAprender,
              descricao: e.target.value,
            })
          }
        />
        <button onClick={adicionarHabilidadeAprender}>Adicionar</button>

        <h3>Habilidades adicionadas para aprender:</h3>
        {habilidadesAprender.map((habilidade, index) => (
          <div key={index}>
            <p>
              <strong>Categoria:</strong> {habilidade.categoria}
            </p>
            <p>
              <strong>Subcategoria:</strong> {habilidade.subcategoria}
            </p>
            <p>
              <strong>Nível:</strong> {habilidade.nivel}
            </p>
            <p>
              <strong>Descrição:</strong> {habilidade.descricao}
            </p>
          </div>
        ))}

        <button onClick={handleSubmit}>Salvar e finalizar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default ConfigurarPerfil;
