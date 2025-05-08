import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CardHabilidade.module.css"; // Você criará esse CSS depois

const CardHabilidade = ({ dados = [], tipo, categorias = [], subcategorias = [] }) => {
  console.log("Categorias:", categorias);
  console.log("Subcategorias:", subcategorias);
  const [error, setError] = useState(null);

  // Função para pegar o nome da categoria a partir do ID
  const getCategoriaNome = (categoriaId) => {
    if (!categoriaId) {
      return "Categoria não encontrada";
    }
    console.log("Procurando categoria ID:", categoriaId);
    const categoria = categorias.find((c) => c.id === Number(categoriaId));
    return categoria ? categoria.nome : "Categoria não encontrada";
  };

  // Função para pegar o nome da subcategoria a partir do ID
  const getSubcategoriaNome = (subcategoriaId) => {
    if (!subcategoriaId) {
      return "Subcategoria não encontrada";
    }
    console.log("Procurando subcategoria ID:", subcategoriaId);
    const subcategoria = subcategorias.find((s) => s.id === Number(subcategoriaId));
    return subcategoria ? subcategoria.nome : "Subcategoria não encontrada";
  };

  const getEstiloPorTipo = (tipo) => {
    switch (tipo) {
      case "ensinar":
        return styles.cardEnsinar;
      case "aprender":
        return styles.cardAprender;
      default:
        return styles.cardVazio;
    }
  };

  if (!dados || dados.length === 0) {
    return (
      <div className={styles.cardVazio}>
        <p className={styles.paragrafo}>
          🔎 Nenhum{tipo === "ensinar" ? "a habilidade" : " objetivo"} cadastrad{tipo === "ensinar" ? "a" : "o"} ainda.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {dados.map((item, index) => (
        <div key={index} className={`${styles.card} ${getEstiloPorTipo(tipo)}`}>
          <p className={styles.paragrafoEnsinar}>
            <strong>Categoria:</strong> {getCategoriaNome(item.categoria_id)}
          </p>
          <p className={styles.paragrafoEnsinar}>
            <strong>Subcategoria:</strong> {getSubcategoriaNome(item.subcategoria_id)}
          </p>
          <p className={styles.paragrafoEnsinar}>
            <strong>Nível:</strong> {item.nivel_abilidade}
          </p>
          <p className={styles.paragrafoEnsinar}>
            <strong>Descrição:</strong> {item.descricao}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CardHabilidade;
