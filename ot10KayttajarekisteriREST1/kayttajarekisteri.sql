-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 22.03.2017 klo 15:29
-- Palvelimen versio: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kayttajarekisteri`
--
CREATE DATABASE IF NOT EXISTS `kayttajarekisteri` DEFAULT CHARACTER SET utf8 COLLATE utf8_swedish_ci;
USE `kayttajarekisteri`;

-- --------------------------------------------------------

--
-- Rakenne taululle `kayttajat`
--

CREATE TABLE `kayttajat` (
  `id` int(11) NOT NULL,
  `sukunimi` text COLLATE utf8_swedish_ci,
  `etunimi` text COLLATE utf8_swedish_ci,
  `sahkoposti` text COLLATE utf8_swedish_ci,
  `kayttajatunnus` text COLLATE utf8_swedish_ci,
  `salasana` text COLLATE utf8_swedish_ci
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Vedos taulusta `kayttajat`
--

INSERT INTO `kayttajat` (`id`, `sukunimi`, `etunimi`, `sahkoposti`, `kayttajatunnus`, `salasana`) VALUES
(1, 'Hicks', 'Kathy', 'khicks0@liveinternet.ru', 'khicks0', '732ccbdb2a7c553ef49020185d89b087e71331389711152302a3bff6a6f79f9c'),
(2, 'Myers', 'Clarence', 'cmyers1@dot.gov', 'cmyers1', '4725e5b60279ccace92d152e005d717815f5627a7558992459bf180e66de265b'),
(3, 'James', 'Philip', 'pjames2@businessinsider.com', 'pjames2', '5c914a307bff1fe1215b1d77e18188374abd0a67d612ac790e777aac7baf0821'),
(4, 'Bowman', 'Matthew', 'mbowman3@yale.edu', 'mbowman3', '71edc4e4d02d00641307b900e3b1bf71ba2a4e563b4c9a802ac280baeed024d4'),
(5, 'Garza', 'Samuel', 'sgarza4@g.co', 'sgarza4', '978cd6b1df742bf8a7c8a4369a958ad97391f1d25e0bee43eacd257a200f0278'),
(6, 'Meyer', 'John', 'jmeyer5@tinypic.com', 'jmeyer5', '7a1563e859b181c26fe81b27bde319774d44fe7e0898dd237d3666062730b250'),
(7, 'King', 'Jane', 'jking6@about.me', 'jking6', 'bf2159651d1da7c1068ffa76868e6892f09f94038fa41f72b0860400b2ffdc2f'),
(8, 'Garrett', 'Helen', 'hgarrett7@nydailynews.com', 'hgarrett7', '02eca12e49d1a2ee636cbc2e1e84a22671b541a4bfea19d0b8cde35400ac60ea'),
(9, 'Hunt', 'Dorothy', 'dhunt8@buzzfeed.com', 'dhunt8', '2dd20750e02569c852fc6ec4a1e4694c0a1366ffe63a6b93bb89d46669c051eb'),
(10, 'Thompson', 'Alice', 'athompson9@seesaa.net', 'athompson9', 'ac5023f5f35c802c17214515e0d4b3cbb0482cbdb8ed32d1e9c56cc1e62a1b2b'),
(11, 'Cole', 'Richard', 'rcolea@dagondesign.com', 'rcolea', '876d8bffb9ca0b98ef6c333bab55ca9cfd6dea3997beffeb866e794f5d94a023'),
(12, 'Mendoza', 'Lisa', 'lmendozab@ihg.com', 'lmendozab', '967a68775344eb2a807f5a7f7329abadc5ce8e67d0bdb32a5a7d173d4e758719'),
(13, 'Washington', 'Donald', 'dwashingtonc@reverbnation.com', 'dwashingtonc', '06a80f7c569d86030cb3824fa3763e22002b92bca89e68739edf574c65ca6e84'),
(14, 'Fisher', 'Jimmy', 'jfisherd@usgs.gov', 'jfisherd', '6ca653dd8136baffbc6191bfd62006b523ff9b2a46740f8d99ff86683a49fe99'),
(15, 'Bennett', 'Julie', 'jbennette@dyndns.org', 'jbennette', '182bedebf1bff16f4848efe6534d400e27a72ac50e484b1e385aa89239a1bfc9'),
(16, 'Cruz', 'Jane', 'jcruzf@nps.gov', 'jcruzf', 'cb2e1237c46d746f2f0b5127ba6c9218eaf3c75e8afe81ce5bf887d1376a7213'),
(17, 'Bryant', 'Ralph', 'rbryantg@vimeo.com', 'rbryantg', 'e34e958ca9c0cebefa7ebd64d3e772583738ea311457331e7f33c375537ac77f'),
(18, 'Wallace', 'Sharon', 'swallaceh@nhs.uk', 'swallaceh', '6f7009946ba876d0f380eb02b5af88301b127f48221dfff1ef1440276f07c7dd'),
(19, 'Hamilton', 'Ruth', 'rhamiltoni@de.vu', 'rhamiltoni', '1744877f4ac663ea71ed294a091140c2a76d50feed77608a2d17ce6764980255'),
(20, 'Ferguson', 'Philip', 'pfergusonj@istockphoto.com', 'pfergusonj', 'b9b6ac21de15286db8ba8adf7f68dc210ddaab7e5577d495c4bdfeb70d746978');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kayttajat`
--
ALTER TABLE `kayttajat`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kayttajat`
--
ALTER TABLE `kayttajat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
