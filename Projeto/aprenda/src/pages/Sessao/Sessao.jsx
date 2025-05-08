import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Sessao.module.css";
import IconeEsc from "../../assets/images/Sessao.svg";

const Sessao = () => {
  const [fileName, setFileName] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [parceriaId, setParceriaId] = useState(""); // Defina o estado para 'parceriaId'
  const [objetivoSelecionado, setObjetivoSelecionado] = useState("");
  const [tema, setTema] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linkConteudo, setLinkConteudo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages
  
    const formData = new FormData();
    
    // Use parceriaId (não objetivoId) conforme esperado pelo backend
    formData.append("parceriaId", Number(parceriaId)); // Use parceriaId agora
    formData.append("tema", tema);
    formData.append("descricao", descricao);
    formData.append("linkConteudo", linkConteudo);
  
    // Verifica se há arquivo para enviar
    if (fileName) {
      const fileInput = fileInputRef.current;
      const file = fileInput && fileInput.files[0];
  
      if (file) {
        const validTypes = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.pdf'];
        const ext = file.name.split('.').pop().toLowerCase();
        
        // Validação do tipo de arquivo
        if (!validTypes.includes(`.${ext}`)) {
          setErrorMessage('Arquivo inválido. Apenas imagens ou vídeos são permitidos.');
          setLoading(false);
          return;
        }
  
        formData.append("arquivo", file);
      }
    }
  
    try {
      const response = await axios.post("http://localhost:3001/sessaoSalvar", formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Sessão cadastrada com sucesso", response);
      // Opcional: redirecionar ou limpar o formulário
      setLoading(false);
      // Exemplo: limpar formulário
      setTema("");
      setDescricao("");
      setLinkConteudo("");
      setFileName("");
    } catch (error) {
      console.error("Erro ao cadastrar sessão", error);
      setErrorMessage('Erro ao cadastrar sessão. Tente novamente.');
      setLoading(false);
    }
  };
    

  useEffect(() => {
    axios
      .get("http://localhost:3001/parcerias", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          const parceriasComObjetivos = response.data.map(parceria => ({
            id: parceria.id,
            objetivo: parceria.objetivo,
            parceiroNome: parceria.nome_parceiro
          }));
          setObjetivos(parceriasComObjetivos);
        } else {
          console.error("Resposta inválida das parcerias", response.data);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar parcerias:", error);
      });
  }, []);
  
  

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
        <form className={styles.formulario} onSubmit={handleSubmit}>
        <label>
  Selecione uma parceria:
  <select value={parceriaId} onChange={(e) => setParceriaId(e.target.value)}>
    <option value="">Selecione uma parceria</option>
    {objetivos.map((parceria) => (
      <option key={parceria.id} value={parceria.id}>
        {parceria.objetivo} com {parceria.parceiroNome}
      </option>
    ))}
  </select>
</label>



          <label>
            Tema de Sessão:
            <input
              type="text"
              placeholder="Descreva aqui o tema da sua sessão..."
              value={tema}
              onChange={(e) => setTema(e.target.value)}
            />
          </label>

          <label>
            Descrição:
            <input
              type="text"
              placeholder="Descreva aqui sua habilidade..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>

          <label>
            Link de conteúdo (Opcional):
            <input
              type="text"
              placeholder="Cole aqui o link..."
              value={linkConteudo}
              onChange={(e) => setLinkConteudo(e.target.value)}
            />
          </label>

          <div className={styles.anexar}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="arquivo"
              style={{ display: "none" }}
            />
            <span onClick={handleClickAnexar}> Anexar Arquivo</span>
            {fileName && <div className={styles.nomeArquivo}>{fileName}</div>}
          </div>

          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

          <button type="submit" className={styles.botaoCadastrar} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Sessão'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sessao;
