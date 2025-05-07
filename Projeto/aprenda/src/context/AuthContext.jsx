import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [perfilConfigurado, setPerfilConfigurado] = useState(
    localStorage.getItem('perfil_configurado') === 'true'
  );
  const [usuario, setUsuario] = useState(null); // Adicione o estado de usuário aqui

  const login = (token, perfilConfigurado, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('perfil_configurado', perfilConfigurado ? 'true' : 'false');
    setToken(token);
    setPerfilConfigurado(perfilConfigurado);
    setUsuario(usuario); // Armazena o usuário após o login
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil_configurado');
    setToken(null);
    setPerfilConfigurado(false);
    setUsuario(null); // Limpa as informações do usuário ao fazer logout
  };

  return (
    <AuthContext.Provider value={{ token, perfilConfigurado, usuario, login, logout, setPerfilConfigurado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

