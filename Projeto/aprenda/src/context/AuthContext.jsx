import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // certifique-se de ter instalado

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [perfilConfigurado, setPerfilConfigurado] = useState(
    localStorage.getItem('perfil_configurado') === 'true'
  );
  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  

  const login = (token, perfilConfigurado, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('perfil_configurado', perfilConfigurado ? 'true' : 'false');
    localStorage.setItem('usuario', JSON.stringify(usuario)); // Salva o usuário
    setToken(token);
    setPerfilConfigurado(perfilConfigurado);
    setUsuario(usuario);
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil_configurado');
    localStorage.removeItem('usuario'); // Limpa o usuário
    setToken(null);
    setPerfilConfigurado(false);
    setUsuario(null);
  };
  

  // ✅ Carregar usuário automaticamente com base no token salvo
  useEffect(() => {
    const carregarUsuario = async () => {
      if (token && !usuario) {
        try {
          const res = await axios.get('http://localhost:3001/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsuario(res.data.usuario); // ajuste se o backend retorna em outro formato
        } catch (err) {
          console.error('Erro ao carregar usuário com token salvo:', err);
          logout(); // token expirado ou inválido
        }
      }
    };

    carregarUsuario();
  }, [token]);

  useEffect(() => {
    console.log('Usuário atualizado no contexto:', usuario);
  }, [usuario]);

  return (
    <AuthContext.Provider
      value={{
        token,
        perfilConfigurado,
        usuario,
        login,
        logout,
        setPerfilConfigurado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
