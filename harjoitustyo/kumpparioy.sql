-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 21.08.2019 klo 19:31
-- Palvelimen versio: 10.1.29-MariaDB
-- PHP Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kumpparioy`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `tuote`
--

CREATE TABLE `tuote` (
  `id` int(11) NOT NULL,
  `malli` text COLLATE utf8_swedish_ci NOT NULL,
  `vari` text COLLATE utf8_swedish_ci NOT NULL,
  `koko` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Vedos taulusta `tuote`
--

INSERT INTO `tuote` (`id`, `malli`, `vari`, `koko`) VALUES
(63, 'basic', 'musta', 39),
(64, 'basic', 'musta', 41),
(65, 'basic', 'musta', 39),
(67, 'special', 'musta', 39),
(68, 'basic', 'musta', 39),
(69, 'hard', 'punainen', 41),
(70, 'hard', 'vihrea', 41),
(71, 'hard', 'punainen', 41),
(72, 'hard', 'punainen', 41),
(73, 'special', 'sininen', 46),
(74, 'basic', 'musta', 41),
(75, 'basic', 'musta', 41),
(76, 'basic', 'musta', 41),
(77, 'basic', 'musta', 41),
(78, 'premium', 'valkoinen', 46),
(79, 'premium', 'valkoinen', 46),
(80, 'special', 'vihrea', 39),
(81, 'special', 'vihrea', 39),
(82, 'special', 'vihrea', 39),
(83, 'special', 'vihrea', 39),
(84, 'special', 'vihrea', 39),
(85, 'basic', 'valkoinen', 40),
(86, 'basic', 'valkoinen', 44),
(87, 'hard', 'punainen', 45),
(89, 'special', 'sininen', 37),
(90, 'special', 'sininen', 37),
(91, 'special', 'sininen', 37),
(92, 'special', 'sininen', 37),
(93, 'premium', 'punainen', 47),
(94, 'premium', 'valkoinen', 37),
(95, 'premium', 'valkoinen', 37),
(96, 'premium', 'valkoinen', 38),
(97, 'special', 'punainen', 38),
(98, 'special', 'punainen', 38),
(99, 'special', 'punainen', 38),
(100, 'special', 'punainen', 38),
(101, 'premium', 'vihrea', 41),
(102, 'premium', 'vihrea', 41);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tuote`
--
ALTER TABLE `tuote`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tuote`
--
ALTER TABLE `tuote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
