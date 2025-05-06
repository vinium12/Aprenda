import React from "react";
import styles from "./CardHabilidade.module.css"; // Você criará esse CSS depois

const CardHabilidade = ({ dados = [], tipo }) => {
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
        <p>🔎 Nenhum{tipo === "ensinar" ? "a habilidade" : " objetivo"} cadastrad{tipo === "ensinar" ? "a" : "o"} ainda.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {dados.map((item, index) => (
        <div key={index} className={`${styles.card} ${getEstiloPorTipo(tipo)}`}>
          <p><strong>Categoria:</strong> {item.categoria}</p>
          <p><strong>Subcategoria:</strong> {item.subcategoria}</p>
          <p><strong>Nível:</strong> {item.nivel}</p>
          <p><strong>Descrição:</strong> {item.descricao}</p>
        </div>
      ))}
    </div>
  );
};

export default CardHabilidade;
