const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

const SECRET = 'sua_chave_jwt_secreta';
app.use(cors());
app.use(express.json());

async function getDbConnection() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aprenda'
  });
  return db;
}

function autenticarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/cadastro', async (req, res) => {
  const { nome, sobrenome, email, senha, confirmacaoSenha, celular, data_nascimento, nome_usuario } = req.body;

  if (senha !== confirmacaoSenha) return res.status(400).send('Senhas não coincidem');
  if (senha.length < 6) return res.status(400).send('Senha deve ter no mínimo 6 caracteres');

  const db = await getDbConnection();
  const [usuariosExistentes] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (usuariosExistentes.length > 0) return res.status(400).send('Email já cadastrado');

  const hash = await bcrypt.hash(senha, 10);
  const sql = 'INSERT INTO usuarios (nome, sobrenome, email, celular, data_nascimento, senha, nome_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [nome, sobrenome, email, celular, data_nascimento, hash, nome_usuario], err => {
    if (err) return res.status(500).send('Erro ao cadastrar');
    res.sendStatus(201);
  });
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const db = await getDbConnection();
  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  const [results] = await db.query(sql, [email]);

  if (results.length === 0) return res.status(401).send('Usuário não encontrado');

  const usuario = results[0];
  const match = await bcrypt.compare(senha, usuario.senha);
  if (!match) return res.status(401).send('Senha incorreta');

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '1h' });

  res.json({ token, perfil_configurado: usuario.perfil_configurado });
});

app.post('/configurar-perfil', autenticarToken, async (req, res) => {
  console.log('Dados recebidos:', req.body);
  const userId = req.user.id;
  const { habilidades_ensinar, habilidades_aprender } = req.body;

  const db = await getDbConnection();
  const conexao = db;

  try {
    await conexao.beginTransaction();

    const inserirHabilidades = habilidades_ensinar.map(h => {
      // Corrigir para verificar 'nivel_abilidade'
      if (!h.nivel_abilidade) {
        throw new Error('Nível de habilidade é obrigatório');
      }
      return [
        userId, h.categoria_id, h.subcategoria_id || null, h.nivel_abilidade, h.descricao
      ];
    });

    const inserirObjetivos = habilidades_aprender.map(h => {
      // Corrigir para verificar 'nivel_abilidade'
      if (!h.nivel_abilidade) {
        throw new Error('Nível de habilidade é obrigatório');
      }
      return [
        userId, h.categoria_id, h.subcategoria_id || null, h.nivel_abilidade, h.descricao
      ];
    });

    const sqlHabilidades = `INSERT INTO habilidades (usuario_id, categoria_id, subcategoria_id, nivel_abilidade, descricao) VALUES ?`;
    const sqlObjetivos = `INSERT INTO objetivos (usuario_id, categoria_id, subcategoria_id, nivel_abilidade, descricao) VALUES ?`;

    await conexao.query(sqlHabilidades, [inserirHabilidades]);
    await conexao.query(sqlObjetivos, [inserirObjetivos]);

    const sqlUpdate = `UPDATE usuarios SET perfil_configurado = TRUE WHERE id = ?`;
    await conexao.query(sqlUpdate, [userId]);

    await conexao.commit();
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao configurar perfil:', error);
    await conexao.rollback();
    res.status(500).send('Erro ao configurar perfil');
  }
});

app.get('/categorias', async (req, res) => {
  try {
    const db = await getDbConnection();
    const [rows] = await db.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
});

app.get('/subcategorias/:categoriaId', async (req, res) => {
  const { categoriaId } = req.params;

  try {
    const db = await getDbConnection();
    const [rows] = await db.query(
      'SELECT * FROM subcategorias WHERE categoria_id = ?',
      [categoriaId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar subcategorias:', error);
    res.status(500).json({ erro: 'Erro ao buscar subcategorias' });
  }
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
