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
    console.log('Usuário autenticado:', user);  // Verificar se os dados estão corretos
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

  res.json({
    token,
    perfil_configurado: usuario.perfil_configurado,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome, // inclua outras propriedades conforme necessário
    }
  })
});
  
// Verifique se você está importando corretamente o modelo
app.get('/me/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await getDbConnection();

    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    if (usuarios.length === 0) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const usuario = usuarios[0];

    // Supondo que você tenha tabelas 'habilidades' e 'objetivos' ligadas por usuario_id
    const [habilidades] = await db.query('SELECT * FROM habilidades WHERE usuario_id = ?', [userId]);
    const [objetivos] = await db.query(`
      SELECT o.id, c.nome AS categoria_nome, s.nome AS subcategoria_nome
      FROM objetivos o
      JOIN categorias c ON o.categoria_id = c.id
      JOIN subcategorias s ON o.subcategoria_id = s.id
      WHERE o.usuario_id = ?
    `, [userId]);
    

    res.json({
      usuario,
      habilidades,
      objetivos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
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

app.use('/arquivos', express.static(path.join(__dirname, 'assets/images')));
const uploadPath = path.join(__dirname, 'assets/images');

// Criação da pasta, caso ela não exista
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuração do Multer para o armazenamento dos arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);  // Define o caminho onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Obtém a extensão do arquivo
    const nomeImagem = `usuario_${req.user.id}${ext}`;  // Define o nome do arquivo
    cb(null, nomeImagem);  // Define o nome do arquivo no armazenamento
  }
});

// Validação do tipo de arquivo (opcional, mas recomendada)
const fileFilter = (req, file, cb) => {
  const validTypes = ['.jpg', '.jpeg', '.png', '.gif', '.mp4','.pdf'];  // Tipos permitidos
  const fileExt = path.extname(file.originalname).toLowerCase();  // Extensão do arquivo
  const mimeType = file.mimetype;  // Tipo MIME do arquivo

  console.log('Tipo de arquivo:', mimeType);  // Logando o tipo MIME do arquivo
  // Verifica se o tipo de arquivo é válido
  if (validTypes.includes(fileExt) || mimeType === 'video/mp4') {
    cb(null, true);  // Arquivo permitido
  } else {
    cb(new Error('Arquivo inválido. Somente imagens JPG, JPEG, PNG, GIF ou vídeos MP4 são permitidos.'), false);
  }
};


// Inicialização do Multer com as configurações
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter  // Aplica a validação de tipo de arquivo
});

module.exports = upload;



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





app.get('/perfil-parceiro/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await getDbConnection();
    
    // 1. Dados do usuário
    const [usuarioRows] = await db.query(
      `SELECT id, nome_usuario, imagem 
      FROM usuarios 
      WHERE id = ?`,
      [userId]
    );

    if (usuarioRows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = {
      ...usuarioRows[0],
      imagem_url: usuarioRows[0].imagem
        ? `http://localhost:3001/${usuarioRows[0].imagem}`
        : null
    };

    // 2. Habilidades
    const [habilidades] = await db.query(
      `SELECT h.*, c.nome AS categoria_nome, s.nome AS subcategoria_nome
      FROM habilidades h
      JOIN categorias c ON h.categoria_id = c.id
      LEFT JOIN subcategorias s ON h.subcategoria_id = s.id
      WHERE h.usuario_id = ?`,
      [userId]
    );

    // 3. Objetivos
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
    console.error('Erro ao carregar perfil do parceiro:', error);
    res.status(500).json({ erro: 'Erro ao carregar perfil do parceiro', detalhe: error.message });
  }
});



app.post('/fazer-parceria', autenticarToken, async (req, res) => {
  const userId = req.user.id;  // Corrigir para req.user
  const { parceiroId, habilidadeId, objetivoId } = req.body;

  try {
    const db = await getDbConnection();

    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    if (usuarios.length === 0) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const usuario = usuarios[0];
    console.log("Body recebido:", req.body);
    console.log("Usuário autenticado:", req.user);  // Corrigir para req.user

    // Verificar se o objetivo pertence ao usuário logado
    const [objetivoUsuario] = await db.query(
      'SELECT * FROM objetivos WHERE id = ? AND usuario_id = ?',
      [objetivoId, userId]
    );

    // Verificar se a habilidade pertence ao parceiro
    const [habilidadeParceiro] = await db.query(
      'SELECT * FROM habilidades WHERE id = ? AND usuario_id = ?',
      [habilidadeId, parceiroId]
    );

   if (objetivoUsuario.length === 0) {
     return res.status(400).send('Objetivo não encontrado ou não pertence ao usuário.');
   }

   if (habilidadeParceiro.length === 0) {
     return res.status(400).send('Habilidade não encontrada ou não pertence ao parceiro.');
   }

   const [result] = await db.query(
     'INSERT INTO parcerias (usuario_id, parceiro_id, habilidade_id, objetivo_id) VALUES (?, ?, ?, ?)',
     [userId, parceiroId, habilidadeId, objetivoId]
   );

   res.status(200).json({ mensagem: 'Parceria criada com sucesso', idParceria: result.insertId });
 } catch (error) {
   console.error('Erro ao criar parceria:', error.message, error.stack);
   res.status(500).json({ erro: 'Erro ao criar parceria' });
 }

});

app.get('/parcerias', autenticarToken, async (req, res) => {
  try {
    const conexao = await getDbConnection();

    const [resultado] = await conexao.query(`
  SELECT 
  p.id, 
  u.nome_usuario, 
  h.descricao AS habilidade,  -- Substituindo 'nome' por 'descricao' na tabela 'habilidades'
  o.descricao AS objetivo,    -- Substituindo 'nome' por 'descricao' na tabela 'objetivos'
  u.id AS usuario_id
FROM parcerias p
JOIN usuarios u ON u.id = p.parceiro_id
LEFT JOIN habilidades h ON h.id = p.habilidade_id
LEFT JOIN objetivos o ON o.id = p.objetivo_id
WHERE p.usuario_id = ?;

    `, [req.user.id]);

    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar parcerias:', erro);
    res.status(500).send('Erro no servidor');
  }
});




app.post('/sessaoSalvar', autenticarToken, upload.single('arquivo'), async (req, res) => {
  const { parceriaId, tema, descricao, linkConteudo } = req.body;
  const arquivo = req.file ? req.file.filename : null;
  const userId = req.user.id;

  console.log('Dados recebidos:', { parceriaId, tema, descricao, linkConteudo, arquivo, userId });

  try {
    const db = await getDbConnection();

    // Verifica se a parceria existe e pertence ao usuário
    const [parceria] = await db.query(
      'SELECT * FROM parcerias WHERE id = ? AND (usuario_id = ? OR parceiro_id = ?)',
      [parceriaId, userId, userId]
    );

    if (parceria.length === 0) {
      return res.status(400).json({ erro: 'Parceria não encontrada ou não pertence ao usuário' });
    }

    const [result] = await db.query(
      'INSERT INTO sessoes (usuario_id, parceria_id, tema, descricao, link_conteudo, arquivo) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, parceriaId, tema, descricao, linkConteudo, arquivo]
    );

    console.log('Sessão cadastrada com sucesso', result);
    res.status(201).json({ mensagem: 'Sessão cadastrada com sucesso', idSessao: result.insertId });
  } catch (error) {
    console.error('Erro ao cadastrar sessão:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar sessão' });
  }
});

// Rota para buscar as sessões postadas por um parceiro específico
app.get('/sessoes/:parceriaId', autenticarToken, async (req, res) => {
  const { parceriaId } = req.params; // Obtendo o ID da parceria da URL
  const userId = req.user.id; // Obtendo o ID do usuário autenticado

  try {
    const db = await getDbConnection();

    // Verifica se a parceria existe e pertence ao usuário autenticado
    const [parceria] = await db.query(
      'SELECT * FROM parcerias WHERE id = ? AND (usuario_id = ? OR parceiro_id = ?)',
      [parceriaId, userId, userId]
    );

    if (parceria.length === 0) {
      return res.status(400).json({ erro: 'Parceria não encontrada ou não pertence ao usuário' });
    }

    // Busca as sessões associadas a essa parceria
    const [sessoes] = await db.query(
      'SELECT * FROM sessoes WHERE parceria_id = ?',
      [parceriaId]
    );

    if (sessoes.length === 0) {
      return res.status(404).json({ erro: 'Nenhuma sessão encontrada para esta parceria.' });
    }

    // Retorna as sessões encontradas
    res.status(200).json(sessoes);
  } catch (error) {
    console.error('Erro ao buscar sessões:', error);
    res.status(500).json({ erro: 'Erro ao buscar sessões postadas' });
  }
});

//essa parte é a do google mas nao to conseguindo fazer funcionar essa bomba
// const express = require("express"); ja ta declarado la em cima, comentei pq n ta deixando rodar o servidor
/*const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
// const jwt = require("jsonwebtoken"); mesma coisa, ta declarado la em cima

const CLIENT_ID = "448708226167-a50kmb5p49our8d503qqkfd5bj16prtj.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

router.post("/login-google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    const usuario = {
      id: 1, // Buscar do DB
      nome: name,
      email: email,
      imagem: picture,
    };

    const appToken = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: appToken,
      perfil_configurado: true,
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token inválido" });
  }
});

module.exports = router;

*/
app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
