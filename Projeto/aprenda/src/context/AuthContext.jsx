import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [perfilConfigurado, setPerfilConfigurado] = useState(
    localStorage.getItem('perfil_configurado') === 'true'
  );
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario')) || null
  );

  const login = (token, perfilConfigurado, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('perfil_configurado', perfilConfigurado ? 'true' : 'false');
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setToken(token);
    setPerfilConfigurado(perfilConfigurado);
    setUsuario(usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil_configurado');
    localStorage.removeItem('usuario');
    setToken(null);
    setPerfilConfigurado(false);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, perfilConfigurado, usuario, login, logout, setPerfilConfigurado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
