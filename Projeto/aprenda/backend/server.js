const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const SECRET = 'sua_chave_jwt_secreta';
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // se estiver usando cookies ou sessões
}));
app.use(express.json());
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));

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

// codigo abaixo mudado

app.post('/cadastro', async (req, res) => {
  try {
    console.log('Requisição de cadastro recebida:', req.body);
    const { nome, sobrenome, email, senha, confirmacaoSenha, celular, data_nascimento, nome_usuario } = req.body;

    if (senha !== confirmacaoSenha) return res.status(400).send('Senhas não coincidem');
    if (senha.length < 6) return res.status(400).send('Senha deve ter no mínimo 6 caracteres');

    const db = await getDbConnection();
    const [usuariosExistentes] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (usuariosExistentes.length > 0) return res.status(400).send('Email já cadastrado');

    const hash = await bcrypt.hash(senha, 10);

    // Aqui usamos `execute` com `  await`
    await db.execute(
      'INSERT INTO usuarios (nome, sobrenome, email, celular, data_nascimento, senha, nome_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, sobrenome, email, celular, data_nascimento, hash, nome_usuario]
    );
    console.log('Usuário cadastrado com sucesso:', req.body);
    return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).send('Erro interno ao cadastrar');
  }
});

// codigo acima mudado

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const db = await getDbConnection();
  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  const [results] = await db.query(sql, [email]);

  if (results.length === 0) return res.status(401).send('Usuário não encontrado');

  const usuario = results[0];
  const match = await bcrypt.compare(senha, usuario.senha);
  if (!match) return res.status(401).send('Senha incorreta');
  
  const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '7d' });

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


const uploadPath = path.join(__dirname, 'assets/images');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeImagem = `usuario_${req.user.id}${ext}`;
    cb(null, nomeImagem);
  }
});

const upload = multer({ storage });

// Rota exemplo para upload (proteja com autenticação como precisar)
app.post('/upload-imagem', autenticarToken, upload.single('imagem'), async (req, res) => {
  const db = await getDbConnection();
  const imagemPath = `assets/images/${req.file.filename}`;

  try {
    await db.query('UPDATE usuarios SET imagem = ? WHERE id = ?', [imagemPath, req.user.id]);
    res.json({ mensagem: 'Imagem enviada com sucesso', imagem: imagemPath });
  } catch (err) {
    console.error('Erro ao salvar imagem no banco:', err);
    res.status(500).send('Erro ao salvar imagem');
  }
});

app.get('/perfil', autenticarToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const db = await getDbConnection();

    // 1. Dados do usuário
    const [usuarioRows] = await db.query(
      'SELECT id, nome, sobrenome, email, celular, data_nascimento, nome_usuario, perfil_configurado, imagem FROM usuarios WHERE id = ?',
      [userId]
    );
    if (usuarioRows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const usuario = {
      ...usuarioRows[0],
      imagem_url: usuarioRows[0].imagem
      ? `http://localhost:3001/${usuarioRows[0].imagem}`
      : null    
    };

    // 2. Habilidades para ensinar
    const [habilidades] = await db.query(
      `SELECT h.*, c.nome AS categoria_nome, s.nome AS subcategoria_nome
       FROM habilidades h
       JOIN categorias c ON h.categoria_id = c.id
       LEFT JOIN subcategorias s ON h.subcategoria_id = s.id
       WHERE h.usuario_id = ?`,
      [userId]
    );

    // 3. Objetivos para aprender
    const [objetivos] = await db.query(
      `SELECT o.*, c.nome AS categoria_nome, s.nome AS subcategoria_nome
       FROM objetivos o
       JOIN categorias c ON o.categoria_id = c.id
       LEFT JOIN subcategorias s ON o.subcategoria_id = s.id
       WHERE o.usuario_id = ?`,
      [userId]
    );

    res.json({
      usuario,
      habilidades,
      objetivos
    });

  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    res.status(500).json({ erro: 'Erro ao carregar perfil' });
  }
});



app.get('/usuarios-similares', autenticarToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const db = await getDbConnection();

    // Buscar habilidades do usuário logado
    const [habilidadesUsuario] = await db.query(
      `SELECT h.categoria_id, h.subcategoria_id, h.nivel_abilidade 
       FROM habilidades h 
       WHERE h.usuario_id = ?`,
      [userId]
    );

    // Buscar objetivos do usuário logado
    const [objetivosUsuario] = await db.query(
      `SELECT o.categoria_id, o.subcategoria_id, o.nivel_abilidade 
       FROM objetivos o 
       WHERE o.usuario_id = ?`,
      [userId]
    );

    // Buscar usuários que têm habilidades e objetivos semelhantes
    const similarUsuariosQuery = `
      SELECT u.id, u.nome, u.sobrenome, u.imagem, u.nome_usuario
      FROM usuarios u
      JOIN habilidades h ON u.id = h.usuario_id
      JOIN objetivos o ON u.id = o.usuario_id
      WHERE 
        (h.categoria_id IN (?) OR o.categoria_id IN (?))
        AND (h.subcategoria_id IN (?) OR o.subcategoria_id IN (?))
        AND (h.nivel_abilidade = o.nivel_abilidade)
        AND u.id != ?
    `;

    // Extraindo IDs e subcategorias dos resultados
    const categoriaIds = habilidadesUsuario.map(h => h.categoria_id);
    const subcategoriaIds = habilidadesUsuario.map(h => h.subcategoria_id);

    const [usuariosSimilares] = await db.query(similarUsuariosQuery, [
      categoriaIds, categoriaIds,
      subcategoriaIds, subcategoriaIds,
      userId
    ]);

    // Respondendo com os dados dos usuários similares
    res.json(usuariosSimilares);
  } catch (error) {
    console.error('Erro ao buscar usuários similares:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuários similares' });
  }
});


app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
