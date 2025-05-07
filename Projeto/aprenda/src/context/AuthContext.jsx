import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [perfilConfigurado, setPerfilConfigurado] = useState(
    localStorage.getItem('perfil_configurado') === 'true'
  );

  const login = (token, perfilConfigurado) => {
    localStorage.setItem('token', token);
    localStorage.setItem('perfil_configurado', perfilConfigurado ? 'true' : 'false');
    setToken(token);
    setPerfilConfigurado(perfilConfigurado);

  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil_configurado');
    setToken(null);
    setPerfilConfigurado(false);
  };

  return (
    <AuthContext.Provider value={{ token, perfilConfigurado, login, logout, setPerfilConfigurado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
