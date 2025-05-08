-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08/05/2025 às 06:44
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `aprenda`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categorias`
--

INSERT INTO `categorias` (`id`, `nome`) VALUES
(1, 'Tecnologia'),
(2, 'Esporte'),
(3, 'Educação');

-- --------------------------------------------------------

--
-- Estrutura para tabela `habilidades`
--

CREATE TABLE `habilidades` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `subcategoria_id` int(11) DEFAULT NULL,
  `nivel_abilidade` enum('baixo','medio','intermediario','avancado') NOT NULL DEFAULT 'baixo',
  `descricao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `habilidades`
--

INSERT INTO `habilidades` (`id`, `usuario_id`, `categoria_id`, `subcategoria_id`, `nivel_abilidade`, `descricao`) VALUES
(19, 14, 1, 1, 'medio', 'Python'),
(20, 14, 1, 1, 'medio', 'Java'),
(21, 14, 1, 1, 'avancado', 'HTML '),
(22, 13, 2, 3, 'baixo', 'Chute de 3 dedos '),
(23, 13, 2, 4, 'medio', 'Arremesso longo '),
(24, 15, 3, 5, 'medio', 'Funções');

-- --------------------------------------------------------

--
-- Estrutura para tabela `objetivos`
--

CREATE TABLE `objetivos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `subcategoria_id` int(11) DEFAULT NULL,
  `nivel_abilidade` enum('baixo','medio','intermediario','avancado') NOT NULL DEFAULT 'baixo',
  `descricao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `objetivos`
--

INSERT INTO `objetivos` (`id`, `usuario_id`, `categoria_id`, `subcategoria_id`, `nivel_abilidade`, `descricao`) VALUES
(19, 14, 2, 3, 'baixo', 'Quero aprender como chutar bem'),
(20, 14, 2, 4, 'medio', 'Quero aprender como arremessar '),
(21, 13, 1, 1, 'baixo', 'Como codar '),
(22, 15, 1, 1, 'baixo', 'Python'),
(23, 15, 2, 3, 'baixo', 'chute');

-- --------------------------------------------------------

--
-- Estrutura para tabela `parcerias`
--

CREATE TABLE `parcerias` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `parceiro_id` int(11) NOT NULL,
  `habilidade_id` int(11) DEFAULT NULL,
  `objetivo_id` int(11) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `parcerias`
--

INSERT INTO `parcerias` (`id`, `usuario_id`, `parceiro_id`, `habilidade_id`, `objetivo_id`, `data_criacao`) VALUES
(4, 14, 13, 22, 19, '2025-05-08 04:24:17'),
(5, 13, 14, 19, 21, '2025-05-08 04:30:17');

-- --------------------------------------------------------

--
-- Estrutura para tabela `sessoes`
--

CREATE TABLE `sessoes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `parceria_id` int(11) NOT NULL,
  `tema` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `link_conteudo` varchar(500) DEFAULT NULL,
  `arquivo` varchar(255) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `subcategorias`
--

CREATE TABLE `subcategorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `subcategorias`
--

INSERT INTO `subcategorias` (`id`, `nome`, `categoria_id`) VALUES
(1, 'Programação', 1),
(2, 'Redes', 1),
(3, 'Futebol', 2),
(4, 'Basquete', 2),
(5, 'Matemática', 3),
(6, 'História', 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `sobrenome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `celular` varchar(20) NOT NULL,
  `data_nascimento` date NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome_usuario` varchar(50) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  `perfil_configurado` tinyint(1) NOT NULL DEFAULT 0,
  `imagem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `sobrenome`, `email`, `celular`, `data_nascimento`, `senha`, `nome_usuario`, `data_cadastro`, `perfil_configurado`, `imagem`) VALUES
(13, 'David', 'Romero', 'DavidRomero@gmail.com', '11 96578-7828', '2007-08-13', '$2b$10$YRVFHcJmHTqg3tVKoXqyuO0bPNLz32Z7vhY/N.LWGR7Ur252qhOhq', 'Davi_Rei_Delas', '2025-05-08 04:11:06', 1, 'assets/images/usuario_13.png'),
(14, 'Gustavo', 'Souza', 'GustavoSouza@gmail.com', '11 97709-9445', '2007-06-08', '$2b$10$jx81KUrhRqRcs5Tfs25Pq.nSOBZsDCvp1mZG6rx0UOnxCixPMsOhy', 'Guto_0', '2025-05-08 04:12:45', 1, NULL),
(15, 'Vinicius', 'Fernandes', 'ViniciusFernandes@gmail.com', '11 96752-3300', '2008-02-04', '$2b$10$WXM926aX1criTE4PTmmCYexsnjvfgAZdj.rqxPFixdE6LH.uMvD96', 'Vininho', '2025-05-08 04:27:13', 1, NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `habilidades`
--
ALTER TABLE `habilidades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_habilidade` (`usuario_id`),
  ADD KEY `fk_categoria_habilidade` (`categoria_id`),
  ADD KEY `fk_subcategoria_habilidade` (`subcategoria_id`);

--
-- Índices de tabela `objetivos`
--
ALTER TABLE `objetivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_objetivo` (`usuario_id`),
  ADD KEY `fk_categoria_objetivo` (`categoria_id`),
  ADD KEY `fk_subcategoria_objetivo` (`subcategoria_id`);

--
-- Índices de tabela `parcerias`
--
ALTER TABLE `parcerias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario_parceria` (`usuario_id`),
  ADD KEY `idx_parceiro_parceria` (`parceiro_id`),
  ADD KEY `fk_habilidade_parceria` (`habilidade_id`),
  ADD KEY `fk_objetivo_parceria` (`objetivo_id`);

--
-- Índices de tabela `sessoes`
--
ALTER TABLE `sessoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_parceria_sessao` (`parceria_id`);

--
-- Índices de tabela `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_categoria_subcategoria` (`categoria_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nome_usuario` (`nome_usuario`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `habilidades`
--
ALTER TABLE `habilidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de tabela `objetivos`
--
ALTER TABLE `objetivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de tabela `parcerias`
--
ALTER TABLE `parcerias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `sessoes`
--
ALTER TABLE `sessoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `subcategorias`
--
ALTER TABLE `subcategorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `habilidades`
--
ALTER TABLE `habilidades`
  ADD CONSTRAINT `fk_categoria_habilidade` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_subcategoria_habilidade` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usuario_habilidade` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `objetivos`
--
ALTER TABLE `objetivos`
  ADD CONSTRAINT `fk_categoria_objetivo` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_subcategoria_objetivo` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usuario_objetivo` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `parcerias`
--
ALTER TABLE `parcerias`
  ADD CONSTRAINT `fk_habilidade_parceria` FOREIGN KEY (`habilidade_id`) REFERENCES `habilidades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_objetivo_parceria` FOREIGN KEY (`objetivo_id`) REFERENCES `objetivos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_parceiro_parceria` FOREIGN KEY (`parceiro_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usuario_parceria` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `sessoes`
--
ALTER TABLE `sessoes`
  ADD CONSTRAINT `fk_parceria_sessao` FOREIGN KEY (`parceria_id`) REFERENCES `parcerias` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD CONSTRAINT `fk_categoria_subcategoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
