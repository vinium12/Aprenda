-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08/05/2025 às 06:34
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
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
