import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from "./pages/Login_cadastro/Login";
import Cadastro from "./pages/Login_cadastro/Cadastro";
import ConfigurarPerfil from "./pages/ConfigurarPerfil/ConfigurarPerfil";
import HomePosLogin from "./pages/HomePosLogin/HomePosLogin";
import HomePage from "./pages/HomePage/homePage";
import Perfil from "./pages/Perfil/Perfil";
import PerfilParceiros from "./pages/Perfil/PerfilParceiros";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

const PERFIL_KEY = 'perfilConfigurado';

function App() {
  const { token, perfilConfigurado, logout, setPerfilConfigurado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVerPerfil = () => {
    navigate('/perfil');
  };

  // Gerencia o status do perfil configurado no localStorage
  useEffect(() => {
    if (perfilConfigurado) {
      localStorage.setItem(PERFIL_KEY, 'true');
    } else {
      localStorage.removeItem(PERFIL_KEY);
    }
  }, [perfilConfigurado]);

  // Verifica a configuração do perfil quando o componente é montado
  useEffect(() => {
    if (localStorage.getItem(PERFIL_KEY) === 'true') {
      setPerfilConfigurado(true);
    }

    // Redireciona se o usuário está autenticado e configurou o perfil
    if (token && perfilConfigurado && location.pathname === '/') {
      navigate('/homeposlogin');
    }
  }, [token, perfilConfigurado, setPerfilConfigurado, navigate, location]);

  // Rota privada para autenticação
  function PrivateRoute({ element: Component, ...rest }) {
    return token ? <Component {...rest} /> : <Navigate to="/login" />;
  }

  return (
    <div>
      <Header
        isAuthenticated={!!token}
        onLogout={handleLogout}
        onPerfilClick={handleVerPerfil}
      />

      <main>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Rota de configuração do perfil (privada) */}
          <Route
            path="/configurar-perfil"
            element={token ? <ConfigurarPerfil /> : <Navigate to="/login" />}
          />

          {/* Rota após login (privada) */}
          <Route
            path="/homeposlogin"
            element={token ? <HomePosLogin /> : <Navigate to="/login" />}
          />

          {/* Rota inicial - Página pública ou redireciona para HomePosLogin se autenticado */}
          <Route
            path="/"
            element={token ? <Navigate to="/homeposlogin" /> : <HomePage />}
          />

          {/* Perfil do usuário (privada) */}
          <Route
            path="/perfil"
            element={<PrivateRoute element={Perfil} />}
          />

          {/* Perfil de parceiros (privada) */}
          <Route
            path="/perfilparceiros"
            element={<PrivateRoute element={PerfilParceiros} />}
          />
          
          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
