-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 03/05/2025 às 04:44
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

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
(7, 8, 1, 1, 'baixo', 'a'),
(8, 8, 1, 1, 'medio', 'a'),
(9, 8, 1, 1, 'intermediario', 'a'),
(10, 10, 1, 1, '', ''),
(11, 10, 1, 1, 'medio', 'a'),
(12, 10, 1, 1, '', ''),
(13, 10, 1, 1, '', ''),
(14, 10, 1, 1, '', ''),
(15, 11, 1, 1, '', ''),
(16, 11, 1, 1, '', ''),
(17, 11, 2, 4, 'baixo', 'asd');

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
(7, 8, 1, 1, 'baixo', 'a'),
(8, 8, 1, 1, 'medio', 'a'),
(9, 8, 1, 1, 'intermediario', 'a'),
(10, 10, 1, 1, '', ''),
(11, 10, 1, 1, '', ''),
(12, 10, 1, 1, '', ''),
(13, 10, 1, 1, '', ''),
(14, 10, 1, 1, '', ''),
(15, 11, 1, 1, '', ''),
(16, 11, 1, 1, '', ''),
(17, 11, 1, 2, 'avancado', 'asd');

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
  `perfil_configurado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `sobrenome`, `email`, `celular`, `data_nascimento`, `senha`, `nome_usuario`, `data_cadastro`, `perfil_configurado`) VALUES
(3, 'Casso', '', 'cassioa@gmail.com', '', '0000-00-00', '$2b$10$MWjWRqA6ZRsku5i5bmicE.Maa35LjT6V/thi6agSQd1HdWfIl39f.', '', '2025-04-30 21:02:13', 0),
(7, 'eu', 'tu', 'olabomdia@gmail.com', '4444444', '2025-04-15', '$2b$10$vRZEl4cwZPTtrskM8kzfR.VUumdHISVKAo4RVjFDQW56lUzo/LLCu', 'dgfe', '2025-04-30 21:08:18', 0),
(8, 'das', 'd', 'cassioadm@gmail.com', '21412414', '2025-05-02', '$2b$10$3B8QKwp7JadrJ4PidfzNle63SFBuV1Vm5136z0rCDV67c8OXK7bGO', 'a', '2025-05-02 21:26:38', 1),
(10, 'das', 'a', 'funci@gmail.com', '123124', '2025-05-02', '$2b$10$lMUwaSyqjXYXViU.dfZUAuBlNhzethRmJdEF0PKRZACdCiySoadpu', 'ad', '2025-05-02 23:54:12', 1),
(11, 'das', 'dsad', 'davidrgarcia1974@gmail.com', '12414', '2025-05-02', '$2b$10$sTITWwF7OB.BCA392PgHdecdHqahBvePy5OHJ11lkJqtE.pxGXv5.', 'adsa', '2025-05-03 00:59:43', 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `objetivos`
--
ALTER TABLE `objetivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `subcategorias`
--
ALTER TABLE `subcategorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
-- Restrições para tabelas `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD CONSTRAINT `fk_categoria_subcategoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
