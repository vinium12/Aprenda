import styles from './CardHabilidade.module.css'

const CardHabilidade = ({titulo, subtitulo, categoria, subcategoria, nivel, descricao, onChange}) => {
  return (
    <div className={styles.CardHabilidade}>
        <h1 className={styles.titulo}>Habilidade 1</h1>
        <p className={styles.categoria}>Tecnologia</p>
        <p className={styles.subcategoria}>Programação</p>
        <p className={styles.nivel}>Básico</p>
        <p className={styles.descricao}>Eu gostaria muito de aprender programação</p>
    </div>
  )
}

export default CardHabilidade