import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login_cadastro/Login";
import Cadastro from "./pages/Login_cadastro/Cadastro";
import ConfigurarPerfil from "./pages/ConfigurarPerfil/ConfigurarPerfil";
import HomePosLogin from "./pages/HomePosLogin/HomePosLogin";
import HomePage from "./pages/HomePage/homePage";
import Perfil from "./pages/Perfil/Perfil";
import Sessao from "./pages/Sessao/Sessao";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const { token, perfilConfigurado, logout, setPerfilConfigurado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleVerPerfil = () => {
    navigate("/perfil");
  };

  useEffect(() => {
    if (perfilConfigurado) {
      localStorage.setItem("perfilConfigurado", "true");
    } else {
      localStorage.removeItem("perfilConfigurado");
    }
  }, [perfilConfigurado]);

  useEffect(() => {
    if (localStorage.getItem("perfilConfigurado") === "true") {
      setPerfilConfigurado(true);
    }

    if (token && perfilConfigurado && location.pathname === "/") {
      navigate("/homeposlogin");
      console.log("Redirecionando para /homeposlogin...");
    }
  }, [token, perfilConfigurado, setPerfilConfigurado, navigate, location]);

  return (
    <div>
      <Header
        isAuthenticated={!!token}
        onLogout={handleLogout}
        onPerfilClick={handleVerPerfil}
      />

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/configurar-perfil"
            element={token ? <ConfigurarPerfil /> : <Navigate to="/login" />}
          />
          <Route
            path="/homeposlogin"
            element={token ? <HomePosLogin /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/perfil"
            element={token ? <Perfil /> : <Navigate to="/login" />}
          />
          <Route
            path="/Sessao"
            element={token ? <Sessao /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
