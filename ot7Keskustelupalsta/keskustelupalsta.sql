-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 12.01.2019 klo 22:42
-- Palvelimen versio: 10.1.29-MariaDB
-- PHP Version: 7.2.0

--
-- tekijä: Maarit Parkkonen
--
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `keskustelupalsta`
--
CREATE DATABASE IF NOT EXISTS `keskustelupalsta` DEFAULT CHARACTER SET utf8 COLLATE utf8_swedish_ci;
USE `keskustelupalsta`;

-- --------------------------------------------------------

--
-- Rakenne taululle `keskustelut`
--

CREATE TABLE `keskustelut` (
  `keskusteluId` int(11) NOT NULL,
  `kirjoittaja` varchar(100) COLLATE utf8_swedish_ci NOT NULL DEFAULT 'Anonyymi',
  `otsikko` varchar(400) COLLATE utf8_swedish_ci NOT NULL,
  `aloitusTeksti` varchar(1200) COLLATE utf8_swedish_ci NOT NULL,
  `aika` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Vedos taulusta `keskustelut`
--

INSERT INTO `keskustelut` (`keskusteluId`, `kirjoittaja`, `otsikko`, `aloitusTeksti`, `aika`) VALUES
(17, 'Milla Magia', 'Kuinka varastaa Roopen onnenlantti?', '<p>Ideat alkavat loppua, jospa some auttaisi?</p>', '2019-01-12 21:17:46'),
(18, 'Poliisimestari Sisu', 'Vaaratiedoitus', '<p>Kathukopla karkasi viime y&ouml;n&auml;. Pahoittelen!</p>', '2019-01-12 21:18:39'),
(19, 'mummo Ankka', 'Kissanpentuja annetaan hyvään kotiin', '<p>Viisi s&ouml;p&ouml;&auml; kisuliinia odottaa uutta onnellista kotia ja VAIN hyv&auml;&auml; kotia.</p>', '2019-01-12 21:20:40'),
(20, 'Vartionjohtaja', 'Sudenpentujen vuosikokous 1.2.2019', '<p>Kaikki sudenpennut tervetuloa!</p>', '2019-01-12 21:25:44');

-- --------------------------------------------------------

--
-- Rakenne taululle `viestit`
--

CREATE TABLE `viestit` (
  `viestiId` int(11) NOT NULL,
  `keskusteluId` int(11) NOT NULL,
  `kirjoittaja` text COLLATE utf8_swedish_ci NOT NULL,
  `teksti` text COLLATE utf8_swedish_ci NOT NULL,
  `aika` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Vedos taulusta `viestit`
--

INSERT INTO `viestit` (`viestiId`, `keskusteluId`, `kirjoittaja`, `teksti`, `aika`) VALUES
(25, 17, 'Roope-Ankka', '<p>&Auml;l&auml; edes kuvittele!!!!</p>', '2019-01-12 21:19:13'),
(26, 18, 'Roope-Ankka', '<p>#&curren;!&amp;%&curren;/.... on se kummalista ettei kunnollinen veronmaksaja saa vastinetta rahoilleen!</p>', '2019-01-12 21:21:39'),
(27, 18, 'Aku Ankka', '<p>Kathukopla... k&auml;&auml;&auml;&auml;&auml;&auml;k.. poliisit kirjoituskouluun</p>', '2019-01-12 21:22:19'),
(28, 19, 'anonyymi', '<p>M&auml;&auml;rittele hyv&auml; koti?</p>', '2019-01-12 21:23:52'),
(29, 21, 'mummo Ankka', '<p>Tuon tullessani ensi sunnuntaina</p>', '2019-01-12 21:27:11'),
(30, 21, 'anonyymi', '', '2019-01-12 21:27:16'),
(31, 17, 'Karhukopla', '<p>Me voisimme auttaa...</p>', '2019-01-12 21:29:51'),
(32, 17, 'Poliisimestari Sisu', '<p>Minuakin kiinnostaisivat teid&auml;n suunnitelmanne!</p>', '2019-01-12 21:30:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `keskustelut`
--
ALTER TABLE `keskustelut`
  ADD PRIMARY KEY (`keskusteluId`);

--
-- Indexes for table `viestit`
--
ALTER TABLE `viestit`
  ADD PRIMARY KEY (`viestiId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `keskustelut`
--
ALTER TABLE `keskustelut`
  MODIFY `keskusteluId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `viestit`
--
ALTER TABLE `viestit`
  MODIFY `viestiId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
