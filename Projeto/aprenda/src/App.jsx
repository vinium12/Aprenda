{
  /*Componentes*/
}

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import HomePage from "./pages/HomePage/homePage";
import Cadastro from "./pages/Cadastro/Cadastro";
import HomePosLogin from "./pages/HomePosLogin/HomePosLogin";
import ConfigurarPerfil from "./pages/ConfigurarPerfil/ConfigurarPerfil";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import FormHabilidades from "./components/FormHabilidades";
{
  /*Style*/
}
import "./App.css";

function App() {
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<HomePosLogin />} />
          <Route path="/configurar-perfil" element={<ConfigurarPerfil />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
