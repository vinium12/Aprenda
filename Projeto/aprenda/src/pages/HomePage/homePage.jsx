import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from './homePage.module.css'

const homePage = () => {
  return (
    <div>
      <Header />
      <div className='conteudo'></div>
      <Footer />
    </div>
  )
}

export default homePage