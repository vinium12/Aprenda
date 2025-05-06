import styles from "./Sessao.module.css";
import IconeEsc from "../../assets/images/Sessao.svg";
import { useState, useRef } from "react";

const Sessao = () => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleClickAnexar = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.Esquerdo}>
        <img src={IconeEsc} alt="Ilustração sessão" />
        <h2>Nova Sessão</h2>
        <p>
          Cadastre uma nova sessão de aprendizado com seu parceiro de estudos.
          Compartilhe recursos para melhorar o aprendizado.
        </p>
      </div>

      <div className={styles.Direito}>
        <form className={styles.formulario}>
          <label>
            Selecione um Parceiro:
            <select>
              <option value="">Categoria</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Educação">Educação</option>
              <option value="Esporte">Esporte</option>
            </select>
          </label>

          <label>
            Tema de Sessão:
            <input
              type="text"
              placeholder="Descreva aqui o tema da sua sessão..."
            />
          </label>

          <label>
            Descrição:
            <input type="text" placeholder="Descreva aqui sua habilidade..." />
          </label>

          <label>
            Link de conteúdo (Opcional):
            <input type="text" placeholder="Cole aqui o link..." />
          </label>

          <div className={styles.anexar}>
            <input
              type="file" //David aqui ta o nome e a id do input, tive que fazer uma funçao de javascript para resolver um problema que tava dando, mas a funçao é só para exibir o nome do arquivo que a pessoa colocou
              ref={fileInputRef} 
              onChange={handleFileChange}
              id="arquivo"
              style={{ display: "none" }}
            />
            <span onClick={handleClickAnexar}> Anexar Arquivo</span>
            {fileName && <div className={styles.nomeArquivo}>{fileName}</div>}
          </div>

          <button type="submit" className={styles.botaoCadastrar}>
            Cadastrar Sessão
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sessao;
