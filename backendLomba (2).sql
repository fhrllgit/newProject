-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 16 Okt 2025 pada 09.57
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backendLomba`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Pria'),
(2, 'Wanita'),
(3, 'Anak');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `img` text DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `tipe` varchar(100) DEFAULT NULL,
  `point` text DEFAULT NULL,
  `variasi` varchar(100) DEFAULT NULL,
  `warna` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `discount_price` decimal(15,2) DEFAULT NULL,
  `discount_start` datetime DEFAULT NULL,
  `discount_end` datetime DEFAULT NULL,
  `size_guide` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`size_guide`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `category_id`, `img`, `name`, `tipe`, `point`, `variasi`, `warna`, `description`, `price`, `discount_price`, `discount_start`, `discount_end`, `size_guide`) VALUES
(19, 1, 'http://localhost:3005/uploads/1760515390781-659653770.jpg', 'ESSENTIALS SMALL LOGO PIQUE POLO SHIRT', 'Pria Sportswear', 'A SHOPISTICATED POLO SHIRT MADE IN PART WITH RECYLED AN RENEWABLE MATERIALS.', 'WHITE/BLACK [JE9020]', '#ECEDEFF', 'Essentials Small Logo Piqué Polo Shirt from Adidas updates a classic silhouette with breathable piqué fabric for lightweight comfort. A small embroidered logo at the chest adds subtle branding to this timeless sporty style.', 599000.00, 500000.00, '2025-10-16 12:07:00', '2025-10-18 12:07:00', NULL),
(20, 2, 'http://localhost:3005/uploads/1760515428864-536711256.jpg', 'SEPATU ADIZERO TAKUMI SEN 11 SHOES', 'Wanita Running', 'SEPATU LARI UNTUK LOMBA LARI CEPAT 10K DAN 20K', 'WHITE/BLACK/MULTICOLOR [JQ2818] ', '#ECEDEFF', 'Sepatu lari untuk lomba lari cepat 5K dan 10K.', 3200000.00, NULL, NULL, NULL, NULL),
(21, 2, 'http://localhost:3005/uploads/1760515481251-753193132.webp', 'SLIP ON CROCS CLOG', 'Wanita Crocs', 'DESAIN SIMPLE DAN STYLISH UNTUK AKTIVITAS SEHARI HARI', 'Bone', '#fff', 'Warna pada gambar dapat sedikit berbeda dengan warna asli produk akibat pencahayaan saat proses photoshoot.', 1220543.00, NULL, NULL, NULL, NULL),
(22, 1, 'http://localhost:3005/uploads/1760515513217-808787264.webp', 'SEPATU PEGASUS 41 RUNNING SHOES', 'Pria Running', 'SEPATU BALET SPORTY DENGAN GAYA KHAS TAHUN 00-AN.', 'WHITE/FOLT/BLACK', '#fff', 'Nike Pegasus 41 Men\'s Road Running Shoes The personal relationship you have with the Peg is unlike anything else. Faithful. Reliable. The pair that’s always there, pushing the running world forward, while still putting your wants and needs first. With an always speedy Zoom Air engine on top of softer, more responsive ReactX foam the Pegasus 41 is quietly unlike any other Peg we have ever made before. A springy ride for any run, better for all runners on this planet, and all planets where we run. Hello, ReactX Nike ReactX foam is engineered to reduce its carbon footprint by at least 43% in a pair of midsoles due to reduced manufacturing process energy compared to prior Nike React foam. Take Off, Zoom We paired Nike ReactX technology with 2 Zoom Air units 1 in the forefoot and the heel) to give you a bouncy, springy sensation and an energized feel at toe-off.', 1574247.00, NULL, NULL, NULL, NULL),
(23, 1, 'http://localhost:3005/uploads/1760517251546-456112262.webp', 'SEPATU NIKE PEGASUS 41 RUNNING', 'Sepatu Running', 'DESAIN SPORTY DENGAN TAMPILAN MODERN', 'BLACK/WHITE/ANTHRACITE', '#fff', 'Sepatu Lari Jalan Raya Pria Nike Pegasus 41 Hubungan pribadi yang Anda miliki dengan Peg tidak seperti yang lain. Setia. Andal. Pasangan yang selalu ada, mendorong dunia lari ke depan, sambil tetap mengutamakan keinginan dan kebutuhan Anda. Dengan mesin Zoom Air yang selalu cepat di atas busa ReactX yang lebih lembut dan responsif, Pegasus 41 diam-diam tidak seperti Peg lain yang pernah kami buat sebelumnya. Perjalanan yang kenyal untuk lari apa pun, lebih baik untuk semua pelari di planet ini, dan semua planet tempat kita berlari. Halo, ReactX Busa Nike ReactX direkayasa untuk mengurangi jejak karbonnya setidaknya 43% pada sepasang midsole karena berkurangnya energi proses manufaktur dibandingkan dengan busa Nike React sebelumnya. Lepas Landas, Zoom Kami memasangkan teknologi Nike ReactX dengan 2 unit Zoom Air (1 di kaki depan dan tumit) untuk memberi Anda sensasi memantul, kenyal, dan rasa berenergi saat lepas landas. Lebih Luas dan Lebih Baik Kami memperlebar lebar kaki depan dan tumit dibandingkan dengan Peg 40.', 2098998.00, NULL, NULL, NULL, NULL),
(24, 2, 'http://localhost:3005/uploads/1760518265074-490187962.webp', 'SEPATU CONVERSE', 'Wanita Taylor', 'PILIHAN TEPAT UNTUK TAMPILAN KASUAL STYLISH', 'BLACK/WHITE', '#fff', 'Warna pada gambar dapat sedikit berbeda dengan warna asli produk akibat pencahayaan saat proses photoshoot.', 1159100.00, NULL, NULL, NULL, NULL),
(25, 1, 'http://localhost:3005/uploads/1760519083402-179087158.webp', 'SANDAL SLIP ON CROCS', 'Pria Classic', 'DESAIN SIMPLE COCOK UNTUK BERBAGAI AKTIVITAS.', 'NAVY', '#fff', 'Warna pada gambar dapat sedikit berbeda dengan warna asli produk akibat pencahayaan saat proses photoshoot.', 712089.00, NULL, NULL, NULL, NULL),
(26, 1, 'http://localhost:3005/uploads/1760519983945-746331941.webp', 'SANDAL ADIDAS ADILETTE', 'Pria Sandal & Flipflop', 'COCOK UNTUK DI PAKAI DI RUMAH ATAU SETELAH OLAHRAGA', 'LIGHT BROWN/CORE BLACK', '#fff', 'Musim panas terasa begitu istimewa saat pertama kali Anda resmi memakai dan melangkah keluar dengan sandal baru. Dengan desainnya yang menarik, Sandal The Island Club Adilette 22 merupakan tambahan yang stylish untuk koleksi musiman Anda. Konstruksi one-piece-nya memberikan kenyamanan terbaik untuk bersantai sepanjang hari, sementara tampilannya yang terinspirasi dari Topografi 3D menambah sentuhan inovatif.', 750000.00, NULL, NULL, NULL, NULL),
(27, 1, 'http://localhost:3005/uploads/1760521230503-411089688.webp', 'SEPATU PRIA RUNNING DOWNSHIFTER 12 ', 'Pria Running', 'COCOK UNTUK MENINGKATKAN PERFORMA LARI ', 'PLATINUM TIN/LT CRIMSON/BLACK/WHITE', '#fff', 'Sepatu Lari Jalan Raya Pria Nike Downshifter 12 LARI ANDA DIMULAI DENGAN DUKUNGAN YANG STABIL. Ambil langkah pertama dalam perjalanan lari Anda dengan Nike Downshifter 12. Terbuat dari setidaknya 20% konten daur ulang berdasarkan berat, sepatu ini memiliki kecocokan yang suportif dan pengendaraan yang stabil, dengan rasa ringan yang dengan mudah beralih dari latihan Anda ke hangout. Perjalanan Anda dimulai. Kenakan tali sepatu dan jalan. Cool, Light, Fast Mesh di seluruh bagian atas memiliki rasa ringan dan bernapas. Mesh ditempatkan di zona utama berdasarkan umpan balik pelari, memberi Anda pendinginan di tempat yang penting. Lace Up, Topang Rasakan stabilitas dengan fitband midfoot. Ini bekerja dengan tali sepatu Anda, menjaga kaki Anda lebih aman semakin ketat tali sepatu Anda. Run Hard with a Soft Feel Busa super lembut melalui midsole membantu bantalan kaki Anda dengan setiap langkah. Peningkatan ketinggian berarti sensasi yang lebih lembut saat Anda berlari. Sol luar karet memiliki traksi untuk membantu menjaga kaki Anda mencengkeram trotoar. Kulit di jari kaki dan lubang tali menawarkan daya tahan. Bahan jala memperlihatkan komponen internal di bagian tengah kaki dan ujung kaki.', 820000.00, NULL, NULL, NULL, NULL),
(28, 1, 'http://localhost:3005/uploads/1760521945668-41790589.webp', 'SEPATU PRIA RUNNING DOWNSHIFTER 13', 'Pria Running ', 'COCOK UNTUK MENINGKATKAN PERFORMA LARI ', 'COLLEGE GREY/SOFT YELLOW/CAVE STONE', '#fff', 'Sepatu Lari Jalan Raya Pria Nike Downshifter 13 Baik Anda baru memulai perjalanan lari atau seorang ahli yang ingin meningkatkan kecepatan, Downshifter 13 siap untuk perjalanan Anda. Dengan bagian atas yang diperbarui dan bantalan serta daya tahan, sepatu ini membantu Anda menemukan perlengkapan tambahan atau mengambil langkah pertama untuk mengejar tujuan Anda. Dibuat dengan Nike Grind Sol luar terbuat dari setidaknya 15% bahan Nike Grind, terbuat dari sisa-sisa proses pembuatan alas kaki. Jaring Bernapas Jaring yang lembut dan nyaman menawarkan tingkat sirkulasi udara yang tinggi. Mendukung dan Aman Pita internal yang diperbarui menawarkan penahan di sekitar bagian tengah kaki untuk dukungan dan keamanan. Detail Selengkapnya', 889011.00, NULL, NULL, NULL, NULL),
(29, 1, 'http://localhost:3005/uploads/1760534490438-992435620.webp', 'SEPATU ADIDAS ADIZERO EVO SL', 'Pria Sport Running', 'SEPATU RUNNING YANG DI DESIGN UNTUK ALL ROUND ', 'WHITE', '#fff', 'Rasakan sensasi berlari cepat dengan Adizero Evo SL. Terinspirasi oleh inovasi sepatu pemecah rekor dalam keluarga lari Adizero - khususnya Pro Evo 1 - Evo SL dirancang agar Anda dapat berlari dengan sepatu ini, atau tidak. Menggabungkan teknologi Adizero dengan estetika yang berani dan unik terinspirasi dari balapan, sepatu ini merupakan evolusi kecepatan dalam segala aspek kehidupan. Lapisan busa LIGHTSTRIKE PRO yang responsif di midsole memberikan kenyamanan dan bantalan untuk pengembalian energi yang optimal.', 2499000.00, NULL, NULL, NULL, NULL),
(30, 1, 'http://localhost:3005/uploads/1760576283029-774697380.webp', 'contoh guide ', 'contoh guide ', 'contoh guide ', 'contoh guide ', '#fff', 'contoh guide ', 100000.00, NULL, NULL, NULL, '{\"thead\":[\"Ukuran\",\"Panjang (cm)\",\"Lebar (cm)\"],\"tbody\":[[\"S\",\"34\",\"34\"]]}');

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `url`) VALUES
(116, 19, 'http://localhost:3005/uploads/1760515361037-894777445.jpg'),
(117, 19, 'http://localhost:3005/uploads/1760515361038-351028106.jpg'),
(118, 19, 'http://localhost:3005/uploads/1760515361038-588467141.jpg'),
(119, 19, 'http://localhost:3005/uploads/1760515361038-138687363.jpg'),
(120, 19, 'http://localhost:3005/uploads/1760515361038-818102645.jpg'),
(121, 19, 'http://localhost:3005/uploads/1760515361039-616322331.jpg'),
(122, 20, 'http://localhost:3005/uploads/1760515450684-390494195.jpg'),
(123, 20, 'http://localhost:3005/uploads/1760515450684-451580487.jpg'),
(124, 20, 'http://localhost:3005/uploads/1760515450685-636643016.jpg'),
(125, 20, 'http://localhost:3005/uploads/1760515450685-624646223.jpg'),
(126, 20, 'http://localhost:3005/uploads/1760515450685-960202549.jpg'),
(127, 20, 'http://localhost:3005/uploads/1760515450686-36192344.jpg'),
(128, 20, 'http://localhost:3005/uploads/1760515450686-406607697.jpg'),
(129, 20, 'http://localhost:3005/uploads/1760515450686-275321263.jpg'),
(130, 21, 'http://localhost:3005/uploads/1760515481295-811364179.webp'),
(131, 21, 'http://localhost:3005/uploads/1760515481295-368481366.webp'),
(132, 21, 'http://localhost:3005/uploads/1760515481296-700703995.webp'),
(133, 21, 'http://localhost:3005/uploads/1760515481296-174880357.webp'),
(134, 22, 'http://localhost:3005/uploads/1760515513248-638406021.webp'),
(135, 22, 'http://localhost:3005/uploads/1760515513249-328136584.webp'),
(136, 22, 'http://localhost:3005/uploads/1760515513249-722068347.webp'),
(137, 22, 'http://localhost:3005/uploads/1760515513250-81933972.webp'),
(138, 22, 'http://localhost:3005/uploads/1760515513250-453538757.webp'),
(139, 22, 'http://localhost:3005/uploads/1760515513250-970793080.webp'),
(140, 23, 'http://localhost:3005/uploads/1760517651788-149350019.webp'),
(141, 23, 'http://localhost:3005/uploads/1760517651789-952474720.webp'),
(142, 23, 'http://localhost:3005/uploads/1760517651789-762893330.webp'),
(143, 23, 'http://localhost:3005/uploads/1760517651789-670480324.webp'),
(144, 23, 'http://localhost:3005/uploads/1760517651789-895915217.webp'),
(145, 23, 'http://localhost:3005/uploads/1760517651790-193805515.webp'),
(146, 24, 'http://localhost:3005/uploads/1760518792519-461128999.webp'),
(147, 24, 'http://localhost:3005/uploads/1760518792520-730047113.webp'),
(148, 24, 'http://localhost:3005/uploads/1760518792521-825933948.webp'),
(149, 24, 'http://localhost:3005/uploads/1760518792521-556746948.webp'),
(150, 24, 'http://localhost:3005/uploads/1760518792521-332302813.webp'),
(151, 25, 'http://localhost:3005/uploads/1760519384028-233638999.webp'),
(152, 25, 'http://localhost:3005/uploads/1760519384032-384510948.webp'),
(153, 25, 'http://localhost:3005/uploads/1760519384032-688811054.webp'),
(154, 25, 'http://localhost:3005/uploads/1760519384032-94449376.webp'),
(155, 26, 'http://localhost:3005/uploads/1760520431932-812134957.webp'),
(156, 26, 'http://localhost:3005/uploads/1760520431933-740532328.webp'),
(157, 26, 'http://localhost:3005/uploads/1760520431934-339919465.webp'),
(158, 26, 'http://localhost:3005/uploads/1760520431934-3443350.webp'),
(159, 27, 'http://localhost:3005/uploads/1760521638666-77119745.webp'),
(160, 27, 'http://localhost:3005/uploads/1760521638667-505426715.webp'),
(161, 27, 'http://localhost:3005/uploads/1760521638668-176737517.webp'),
(162, 27, 'http://localhost:3005/uploads/1760521638668-694502487.webp'),
(163, 27, 'http://localhost:3005/uploads/1760521638668-14671161.webp'),
(164, 27, 'http://localhost:3005/uploads/1760521638669-344778170.webp'),
(165, 27, 'http://localhost:3005/uploads/1760521638669-602898569.webp'),
(166, 27, 'http://localhost:3005/uploads/1760521638669-310916013.webp'),
(167, 28, 'http://localhost:3005/uploads/1760522358694-431562126.webp'),
(168, 28, 'http://localhost:3005/uploads/1760522358696-533041842.webp'),
(169, 28, 'http://localhost:3005/uploads/1760522358697-435089891.webp'),
(170, 28, 'http://localhost:3005/uploads/1760522358698-340257865.webp'),
(171, 28, 'http://localhost:3005/uploads/1760522358698-700550028.webp'),
(172, 28, 'http://localhost:3005/uploads/1760522358699-207457878.webp'),
(173, 28, 'http://localhost:3005/uploads/1760522358699-700238491.webp'),
(174, 28, 'http://localhost:3005/uploads/1760522358700-760590347.webp'),
(175, 29, 'http://localhost:3005/uploads/1760535901734-633097782.webp'),
(176, 29, 'http://localhost:3005/uploads/1760535901736-327032236.webp'),
(177, 29, 'http://localhost:3005/uploads/1760535901736-860144875.webp'),
(178, 29, 'http://localhost:3005/uploads/1760535901736-194947808.webp'),
(179, 29, 'http://localhost:3005/uploads/1760535901737-452419116.webp'),
(180, 29, 'http://localhost:3005/uploads/1760535901737-25769027.webp'),
(181, 29, 'http://localhost:3005/uploads/1760535901737-650939563.webp'),
(182, 30, 'http://localhost:3005/uploads/1760576303876-336972466.webp');

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_type` varchar(20) NOT NULL,
  `size_value` varchar(10) NOT NULL,
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `product_sizes`
--

INSERT INTO `product_sizes` (`id`, `product_id`, `size_type`, `size_value`, `stock`) VALUES
(301, 19, 'UKURAN', 'A/2XL', 6),
(302, 19, 'UKURAN', 'A/2XS', 4),
(303, 19, 'UKURAN', 'A/L', 3),
(304, 19, 'UKURAN', 'A/XS', 2),
(305, 19, 'UKURAN', 'A/XL', 2),
(322, 20, 'UK', '3.5', 5),
(323, 20, 'UK', '4', 3),
(324, 20, 'UK', '4.5', 4),
(325, 20, 'UK', '5', 7),
(326, 20, 'UK', '5.5', 4),
(327, 20, 'EUROPE', '36', 4),
(328, 20, 'EUROPE', '37', 1),
(329, 20, 'EUROPE', '38', 2),
(330, 20, 'EUROPE', '39', 2),
(331, 20, 'EUROPE', '40', 3),
(332, 20, 'US', '5', 7),
(333, 20, 'US', '5.5', 2),
(334, 20, 'US', '6', 2),
(335, 20, 'US', '6.5', 3),
(336, 20, 'US', '7', 4),
(337, 20, 'US', '7.5', 7),
(345, 22, 'US ', '7', 4),
(346, 22, 'US', '7.5', 3),
(347, 22, 'US', '8', 3),
(348, 22, 'US', '8.5', 3),
(349, 22, 'US', '9', 3),
(350, 22, 'US', '9.5', 5),
(351, 22, 'US', '10', 2),
(352, 22, 'US', '11', 6),
(353, 22, 'US', '12', 3),
(354, 22, 'UK', '8', 4),
(355, 22, 'UK', '8.5', 2),
(356, 22, 'UK', '9', 2),
(357, 22, 'UK', '9.5', 2),
(358, 22, 'UK', '10', 1),
(359, 22, 'UK', '10.5', 1),
(360, 22, 'UK', '11', 3),
(361, 22, 'EUROPE', '40', 2),
(362, 22, 'EUROPE', '40.5', 2),
(363, 22, 'EUROPE', '41', 3),
(364, 22, 'EUROPE', '42', 2),
(365, 22, 'EUROPE', '42.5', 3),
(366, 22, 'EUROPE', '43', 4),
(367, 22, 'EUROPE', '44', 3),
(368, 22, 'EUROPE', '44.5', 2),
(369, 22, 'EUROPE', '45', 3),
(370, 21, 'EUROPE', '37', 5),
(371, 21, 'EUROPE', '38', 3),
(372, 21, 'EUROPE', '39', 3),
(373, 21, 'EUROPE', '40', 3),
(374, 21, 'EUROPE', '41', 3),
(375, 21, 'EUROPE', '42', 3),
(376, 21, 'EUROPE', '43', 3),
(377, 23, 'EUROPE', '40', 3),
(378, 23, 'EUROPE', '40.5', 5),
(379, 23, 'EUROPE', '41', 1),
(380, 23, 'EUROPE', '42', 1),
(381, 23, 'EUROPE', '42.5', 2),
(382, 23, 'EUROPE', '43', 3),
(383, 23, 'EUROPE', '44', 3),
(384, 23, 'EUROPE', '44.5', 2),
(385, 23, 'EUROPE', '45', 5),
(386, 23, 'UK', '6', 4),
(387, 23, 'UK', '6.5', 2),
(388, 23, 'UK', '7', 7),
(389, 23, 'UK', '7.5', 5),
(390, 23, 'UK', '8', 2),
(391, 23, 'UK', '8.5', 6),
(392, 23, 'UK', '9', 5),
(393, 23, 'UK', '10', 6),
(394, 23, 'UK', '11', 5),
(395, 23, 'US', '7', 5),
(396, 23, 'US', '7.5', 3),
(397, 23, 'US', '8', 6),
(398, 23, 'US', '8.5', 2),
(399, 23, 'US', '9', 3),
(400, 23, 'US', '9.5', 3),
(401, 23, 'US', '10', 4),
(402, 23, 'US', '10.5', 1),
(403, 23, 'US', '11', 2),
(404, 23, 'US', '12', 4),
(405, 24, 'EUROPE', '35', 5),
(406, 24, 'EUROPE', '36', 4),
(407, 24, 'EUROPE', '37', 2),
(408, 24, 'EUROPE', '38', 1),
(409, 24, 'EUROPE', '39', 1),
(410, 24, 'EUROPE', '40', 3),
(411, 24, 'EUROPE', '41', 3),
(412, 24, 'EUROPE', '42', 3),
(413, 24, 'EUROPE', '43', 3),
(414, 24, 'EUROPE', '44', 2),
(415, 24, 'UK', '3', 2),
(416, 24, 'UK', '3.5', 5),
(417, 24, 'UK', '4', 3),
(418, 24, 'UK', '4.5', 2),
(419, 24, 'UK', '6', 5),
(420, 24, 'UK', '7', 2),
(421, 24, 'UK', '7.5', 4),
(422, 24, 'UK', '8', 3),
(423, 24, 'UK', '8.5', 2),
(424, 24, 'UK', '9', 2),
(425, 24, 'UK', '10', 4),
(426, 24, 'UK', '11', 1),
(427, 24, 'US', '3', 2),
(428, 24, 'US', '3.5', 2),
(429, 24, 'US', '4', 2),
(430, 24, 'US', '4.5', 4),
(431, 24, 'US', '5.5', 3),
(432, 24, 'US', '6', 6),
(433, 24, 'US', '7', 11),
(434, 24, 'US', '8.5', 2),
(435, 24, 'US', '9', 4),
(436, 24, 'US', '9.5', 2),
(437, 24, 'US', '10', 5),
(438, 24, 'US', '11', 5),
(439, 25, 'EUROPE', '36/37', 6),
(440, 25, 'EUROPE', '37/38', 5),
(441, 25, 'EUROPE', '38/39', 2),
(442, 25, 'EUROPE', '39/40', 5),
(443, 25, 'EUROPE', '40/41', 4),
(444, 25, 'EUROPE', '41/42', 2),
(445, 25, 'EUROPE', '42/43', 1),
(446, 25, 'EUROPE', '43/44', 7),
(447, 25, 'EUROPE', '44/45', 5),
(448, 26, 'EUROPE', '35', 3),
(449, 26, 'EUROPE', '36', 3),
(450, 26, 'EUROPE', '38', 2),
(451, 26, 'EUROPE', '39', 5),
(452, 26, 'EUROPE', '40', 4),
(453, 26, 'EUROPE', '42', 1),
(454, 26, 'EUROPE', '43', 3),
(455, 26, 'EUROPE', '44', 3),
(456, 26, 'EUROPE', '46', 2),
(457, 26, 'UK', '3', 2),
(458, 26, 'UK', '4', 3),
(459, 26, 'UK', '5', 3),
(460, 26, 'UK', '6', 1),
(461, 26, 'UK', '7', 3),
(462, 26, 'UK', '8', 5),
(463, 26, 'UK', '9', 4),
(464, 26, 'UK', '10', 4),
(465, 26, 'UK', '11', 3),
(466, 26, 'UK', '12', 2),
(467, 26, 'UK', '13', 3),
(468, 26, 'UK', '14', 3),
(469, 26, 'US', '3', 3),
(470, 26, 'US', '4', 10),
(471, 26, 'US', '5', 6),
(472, 26, 'US', '6', 6),
(473, 26, 'US', '7', 5),
(474, 26, 'US', '8', 5),
(475, 26, 'US', '9', 5),
(476, 26, 'US', '10', 4),
(477, 26, 'US', '11', 4),
(478, 26, 'US', '12', 3),
(479, 26, 'US', '13', 5),
(480, 26, 'US', '14', 3),
(481, 26, 'US', '15', 3),
(482, 27, 'EUROPE', '39', 5),
(483, 27, 'EUROPE', '40', 6),
(484, 27, 'EUROPE', '40.5', 3),
(485, 27, 'EUROPE', '41', 3),
(486, 27, 'EUROPE', '42', 1),
(487, 27, 'EUROPE', '42.5', 4),
(488, 27, 'EUROPEEUROPE', '43', 4),
(489, 27, 'EUROPE', '44', 4),
(490, 27, 'EUROPE', '44.5', 4),
(491, 27, 'EUROPE', '45', 5),
(492, 27, 'UK', '6', 4),
(493, 27, 'UK', '6.5', 4),
(494, 27, 'UK', '7', 5),
(495, 27, 'UK', '7.5', 5),
(496, 27, 'UK', '8', 5),
(497, 27, 'UK', '8.5', 4),
(498, 27, 'UK', '9', 5),
(499, 27, 'UK', '9.5', 5),
(500, 27, 'UK', '10', 5),
(501, 27, 'UK', '11', 5),
(502, 27, 'US', '6.5', 5),
(503, 27, 'US', '7', 5),
(504, 27, 'US', '7.5', 3),
(505, 27, 'US', '8', 3),
(506, 27, 'US', '8.5', 2),
(507, 27, 'US', '9', 3),
(508, 27, 'US', '9.5', 4),
(509, 27, 'US', '10', 4),
(510, 27, 'US', '10.5', 3),
(511, 27, 'US', '11', 2),
(512, 27, 'US', '12', 2),
(513, 28, 'EUROPE', '40', 4),
(514, 28, 'EUROPE', '40.5', 3),
(515, 28, 'EUROPE', '41', 4),
(516, 28, 'EUROPE', '42', 2),
(517, 28, 'EUROPE', '43', 5),
(518, 28, 'EUROPE', '44', 3),
(519, 28, 'EUROPE', '44.5', 2),
(520, 28, 'EUROPE', '45', 3),
(521, 28, 'EUROPE', '46', 3),
(522, 28, 'UK', '6', 2),
(523, 28, 'UK', '6.5', 2),
(524, 28, 'UK', '7', 2),
(525, 28, 'UK', '7.5', 3),
(526, 28, 'UK', '8', 3),
(527, 28, 'UK', '8.5', 3),
(528, 28, 'UK', '9', 1),
(529, 28, 'UK', '9.5', 2),
(530, 28, 'UK', '10', 2),
(531, 28, 'UK', '11', 1),
(532, 28, 'US', '7', 2),
(533, 28, 'US', '7.5', 2),
(534, 28, 'US', '8', 3),
(535, 28, 'US', '8.5', 4),
(536, 28, 'US', '9', 2),
(537, 28, 'US', '9.5', 3),
(538, 28, 'US', '10', 2),
(539, 28, 'US', '11', 1),
(540, 28, 'US', '12', 1),
(541, 29, 'EUROPE', '39', 4),
(542, 29, 'EUROPE', '40', 6),
(543, 29, 'EUROPE', '40.7', 3),
(544, 29, 'EUROPE', '41.3', 2),
(545, 29, 'EUROPE', '42', 1),
(546, 29, 'EUROPE', '42.7', 5),
(547, 29, 'EUROPE', '43.3', 4),
(548, 29, 'EUROPE', '44', 5),
(549, 29, 'EUROPE', '44.7', 3),
(550, 29, 'EUROPE', '45.3', 1),
(551, 29, 'EUROPE', '46', 5),
(552, 29, 'EUROPE', '46.7', 5),
(553, 29, 'EUROPE', '47.3', 4),
(554, 29, 'EUROPE', '48', 5),
(555, 29, 'EUROPE', '48.7', 3),
(556, 29, 'EUROPE', '49.3', 4),
(557, 29, 'EUROPE', '50', 4),
(558, 29, 'EUROPE', '50.7', 1),
(559, 29, 'EUROPE', '51.3', 4),
(560, 29, 'EUROPE', '52.7', 3),
(561, 29, 'EUROPE', '53.3', 3),
(562, 29, 'UK', '6', 3),
(563, 29, 'UK', '6.5', 3),
(564, 29, 'UK', '7', 4),
(565, 29, 'UK', '7.5', 4),
(566, 29, 'UK', '8', 5),
(567, 29, 'UK', '8.5', 4),
(568, 29, 'UK', '9', 1),
(569, 29, 'UK', '9.5', 3),
(570, 29, 'UK', '10', 1),
(571, 29, 'UK', '10.5', 3),
(572, 29, 'UK', '11', 4),
(573, 29, 'UK', '11.5', 2),
(574, 29, 'UK', '12', 1),
(575, 29, 'UK', '12.5', 3),
(576, 29, 'UK', '13', 2),
(577, 29, 'UK', '13.5', 4),
(578, 29, 'UK', '14', 4),
(579, 29, 'UK', '14.5', 3),
(580, 29, 'UK', '15', 6),
(581, 29, 'UK', '16', 8),
(582, 29, 'UK', '17', 6),
(583, 29, 'US', '6.5', 8),
(584, 29, 'US', '7', 4),
(585, 29, 'US', '7.5', 6),
(586, 29, 'US', '8', 7),
(587, 29, 'US', '8.5', 6),
(588, 29, 'US', '9', 6),
(589, 29, 'US', '9.5', 6),
(590, 29, 'US', '10', 6),
(591, 29, 'US', '10.5', 6),
(592, 29, 'US', '11', 7),
(593, 29, 'US', '11.5', 6),
(594, 29, 'US', '12', 7),
(595, 29, 'US', '12.5', 6),
(596, 29, 'US', '13', 3),
(597, 29, 'US', '13.5', 5),
(598, 29, 'US', '14', 5),
(599, 29, 'US', '14.5', 4),
(600, 29, 'US', '15', 6),
(601, 29, 'US', '16', 6),
(602, 29, 'US', '17', 5),
(603, 29, 'US', '18', 5),
(604, 30, 'EU', '43', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `product_specifications`
--

CREATE TABLE `product_specifications` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `product_specifications`
--

INSERT INTO `product_specifications` (`id`, `product_id`, `name`) VALUES
(270, 19, 'Regular Fit'),
(271, 19, '100% cotton'),
(272, 19, 'Product code: JE9020'),
(273, 19, 'Button Clourse'),
(279, 20, 'Potongan reguler'),
(280, 20, 'Menggunakan tali sepatu'),
(281, 20, 'Lapisan tekstil'),
(282, 20, 'Bantalan Lightstrik Pro'),
(283, 20, 'Bagian atas LIGHTLOCK'),
(290, 22, 'Tekstile Insole'),
(291, 22, 'Rubber Outsole'),
(292, 22, 'Lace Up Fastening'),
(293, 22, 'Closed round toe'),
(294, 21, 'Rubber Upper'),
(295, 21, 'Rubber Insole'),
(296, 21, 'Rubber Outsole'),
(297, 21, 'Back strap fastening'),
(298, 21, 'Round toe'),
(299, 21, 'Produk unisex'),
(300, 23, 'Sol dalam berbahan tekstil'),
(301, 23, 'Sol luar berbahan karet'),
(302, 23, 'Tali pengikat'),
(303, 23, 'Ujung bulat tertutup'),
(304, 23, 'Bagian atas berbahan mesh/sintetis'),
(305, 24, 'Bagian atas canvas'),
(306, 24, 'Sol dalam tekstil'),
(307, 24, 'Sol luar karet'),
(308, 24, 'Ujung bulat '),
(309, 24, 'Tali pengikat'),
(310, 25, 'Warna Navy'),
(311, 25, 'Sol dalam karet'),
(312, 25, 'Sol luar karet'),
(313, 25, 'Tali pengikat belakang'),
(314, 25, 'Ujung terbuka'),
(315, 25, 'Produk Unisex'),
(316, 26, 'Bagian atas model banded'),
(317, 26, 'Slip on'),
(318, 26, 'Adidas Originals'),
(319, 26, 'Terbaik untuk gaya hidup'),
(320, 27, 'Terbaik untuk lari '),
(321, 27, 'Bagian atas berbahan mesh '),
(322, 27, 'Sol dalam berbahan tekstil'),
(323, 27, 'Sol luar berbahan karet'),
(324, 27, 'Tali pengikat'),
(325, 27, 'Ujung bulat '),
(326, 28, 'Sol dalam tekstil'),
(327, 28, 'Sol luar karet'),
(328, 28, 'Detail design reflektif'),
(329, 28, 'Pengikat tali'),
(330, 28, 'Ujung bulat tertutup'),
(331, 28, 'Terbaik untuk lari'),
(332, 29, 'Regular Fit'),
(333, 29, 'Penutup Tali'),
(334, 29, 'Lapisan Tekstil'),
(335, 29, 'Bagian atas sintetis dan tekstil'),
(336, 29, 'Terbaik untuk berlari'),
(337, 30, 'succes guide');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT untuk tabel `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=605;

--
-- AUTO_INCREMENT untuk tabel `product_specifications`
--
ALTER TABLE `product_specifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=338;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Ketidakleluasaan untuk tabel `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD CONSTRAINT `product_specifications_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
