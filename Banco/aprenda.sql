SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE database `aprenda`;

use `aprenda`;

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `categorias` (`id`, `nome`) VALUES
(1, 'Tecnologia'),
(2, 'Esporte'),
(3, 'Educação');



CREATE TABLE `habilidades` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `subcategoria_id` int(11) DEFAULT NULL,
  `nivel_abilidade` enum('baixo','medio','intermediario','avancado') NOT NULL DEFAULT 'baixo',
  `descricao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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

CREATE TABLE `objetivos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `subcategoria_id` int(11) DEFAULT NULL,
  `nivel_abilidade` enum('baixo','medio','intermediario','avancado') NOT NULL DEFAULT 'baixo',
  `descricao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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

CREATE TABLE `subcategorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `subcategorias` (`id`, `nome`, `categoria_id`) VALUES
(1, 'Programação', 1),
(2, 'Redes', 1),
(3, 'Futebol', 2),
(4, 'Basquete', 2),
(5, 'Matemática', 3),
(6, 'História', 3);

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


INSERT INTO `usuarios` (`id`, `nome`, `sobrenome`, `email`, `celular`, `data_nascimento`, `senha`, `nome_usuario`, `data_cadastro`, `perfil_configurado`) VALUES
(3, 'Casso', '', 'cassioa@gmail.com', '', '0000-00-00', '$2b$10$MWjWRqA6ZRsku5i5bmicE.Maa35LjT6V/thi6agSQd1HdWfIl39f.', '', '2025-04-30 21:02:13', 0),
(7, 'eu', 'tu', 'olabomdia@gmail.com', '4444444', '2025-04-15', '$2b$10$vRZEl4cwZPTtrskM8kzfR.VUumdHISVKAo4RVjFDQW56lUzo/LLCu', 'dgfe', '2025-04-30 21:08:18', 0),
(8, 'das', 'd', 'cassioadm@gmail.com', '21412414', '2025-05-02', '$2b$10$3B8QKwp7JadrJ4PidfzNle63SFBuV1Vm5136z0rCDV67c8OXK7bGO', 'a', '2025-05-02 21:26:38', 1),
(10, 'das', 'a', 'funci@gmail.com', '123124', '2025-05-02', '$2b$10$lMUwaSyqjXYXViU.dfZUAuBlNhzethRmJdEF0PKRZACdCiySoadpu', 'ad', '2025-05-02 23:54:12', 1),
(11, 'das', 'dsad', 'davidrgarcia1974@gmail.com', '12414', '2025-05-02', '$2b$10$sTITWwF7OB.BCA392PgHdecdHqahBvePy5OHJ11lkJqtE.pxGXv5.', 'adsa', '2025-05-03 00:59:43', 1);



CREATE TABLE `parcerias` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `parceiro_id` int(11) NOT NULL,
  `habilidade_id` int(11) DEFAULT NULL, 
  `objetivo_id` int(11) DEFAULT NULL,  
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `habilidades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_habilidade` (`usuario_id`),
  ADD KEY `fk_categoria_habilidade` (`categoria_id`),
  ADD KEY `fk_subcategoria_habilidade` (`subcategoria_id`);

ALTER TABLE `objetivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_objetivo` (`usuario_id`),
  ADD KEY `fk_categoria_objetivo` (`categoria_id`),
  ADD KEY `fk_subcategoria_objetivo` (`subcategoria_id`);

ALTER TABLE `subcategorias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_categoria_subcategoria` (`categoria_id`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nome_usuario` (`nome_usuario`);

ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `habilidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `objetivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `subcategorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

ALTER TABLE `habilidades`
  ADD CONSTRAINT `fk_categoria_habilidade` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_subcategoria_habilidade` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usuario_habilidade` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

ALTER TABLE `objetivos`
  ADD CONSTRAINT `fk_categoria_objetivo` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_subcategoria_objetivo` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usuario_objetivo` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

ALTER TABLE `subcategorias`
  ADD CONSTRAINT `fk_categoria_subcategoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

ALTER TABLE `usuarios`
ADD COLUMN `imagem` VARCHAR(255) DEFAULT NULL AFTER `perfil_configurado`;

ALTER TABLE `parcerias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario_parceria` (`usuario_id`),
  ADD KEY `idx_parceiro_parceria` (`parceiro_id`),
  ADD CONSTRAINT `fk_usuario_parceria` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_parceiro_parceria` FOREIGN KEY (`parceiro_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_habilidade_parceria` FOREIGN KEY (`habilidade_id`) REFERENCES `habilidades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_objetivo_parceria` FOREIGN KEY (`objetivo_id`) REFERENCES `objetivos` (`id`) ON DELETE CASCADE;
