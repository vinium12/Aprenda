// hooks/usePerfil.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export function usePerfil(token) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (!token) return;

    const carregarPerfil = async () => {
      try {
        const res = await axios.get('http://localhost:3001/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuario(res.data);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    };

    carregarPerfil();
  }, [token]);

  return usuario;
}
