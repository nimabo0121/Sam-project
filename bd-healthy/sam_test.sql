-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-05 21:00:04
-- 伺服器版本： 8.0.36
-- PHP 版本： 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `sam_test`
--

-- --------------------------------------------------------

--
-- 資料表結構 `friends`
--

CREATE TABLE `friends` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `friend_id` int DEFAULT NULL,
  `status` enum('pending','accepted','blocked') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `status`, `created_at`) VALUES
(10, 2, 1, 'accepted', '2024-10-17 10:29:01'),
(11, 1, 2, 'accepted', '2024-10-17 10:29:37'),
(14, 5, 1, 'accepted', '2024-10-20 07:40:52'),
(15, 1, 5, 'accepted', '2024-10-20 07:41:28'),
(17, 7, 1, 'accepted', '2024-10-22 14:28:46'),
(18, 1, 7, 'accepted', '2024-11-05 12:58:00');

-- --------------------------------------------------------

--
-- 資料表結構 `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `created_at`) VALUES
(1, 1, 5, 'zxc', '2024-10-20 09:44:55'),
(2, 5, 1, '8787', '2024-10-20 09:45:43'),
(3, 1, 2, 'asd', '2024-10-20 09:54:18'),
(4, 1, 5, 'aasd', '2024-10-20 09:54:24'),
(5, 1, 5, 'a', '2024-10-20 10:52:21'),
(6, 1, 5, 's', '2024-10-20 11:01:46'),
(18, 5, 1, '嘿嘿ㄏㄟ ', '2024-10-20 12:10:59'),
(19, 1, 5, '123', '2024-10-20 12:11:11'),
(20, 1, 5, 'asd', '2024-10-20 12:12:19'),
(21, 1, 5, '111', '2024-10-20 12:12:39'),
(22, 5, 1, '555', '2024-10-20 12:12:45'),
(23, 1, 5, 'sd', '2024-10-21 11:42:32'),
(24, 1, 5, 'sd', '2024-10-21 11:43:28'),
(25, 1, 5, 's', '2024-10-21 11:53:48'),
(26, 1, 5, 'd', '2024-10-21 12:53:26'),
(27, 5, 1, 'sd', '2024-10-21 13:03:16'),
(28, 1, 5, 'asd', '2024-10-21 13:19:33'),
(29, 1, 5, 'a', '2024-10-21 13:22:12'),
(30, 5, 1, 'sd', '2024-10-21 13:22:25'),
(31, 1, 5, 'sd', '2024-10-21 13:23:03'),
(32, 1, 5, 'sd', '2024-10-21 13:26:08'),
(33, 1, 5, 'sd', '2024-10-21 13:26:13'),
(34, 5, 1, 'sd', '2024-10-21 13:28:19'),
(36, 1, 5, 'ss', '2024-10-21 13:32:29'),
(37, 1, 5, 'sssssssssss', '2024-10-21 13:32:57'),
(38, 1, 5, 's', '2024-10-21 13:34:11'),
(39, 5, 1, 's', '2024-10-21 13:34:39'),
(40, 1, 5, 'sd', '2024-10-21 13:36:18'),
(41, 1, 5, 'sd', '2024-10-21 13:36:27'),
(42, 5, 1, 'sd', '2024-10-21 13:37:10'),
(43, 1, 5, 'sd', '2024-10-21 13:37:25'),
(44, 1, 5, 'sd', '2024-10-21 13:37:35'),
(45, 1, 5, 'sd', '2024-10-21 13:37:39'),
(46, 1, 5, 'sd', '2024-10-21 13:37:43'),
(47, 1, 5, 'sd', '2024-10-21 13:39:14'),
(48, 1, 5, 'sssss', '2024-10-21 13:40:52'),
(49, 5, 1, 'dddd', '2024-10-21 13:40:54'),
(50, 1, 5, 'ddd', '2024-10-21 13:40:57'),
(51, 5, 1, 'sss', '2024-10-21 13:40:59'),
(52, 5, 1, 'sd', '2024-10-21 13:43:57'),
(53, 1, 5, 'sss', '2024-10-21 13:43:58'),
(54, 1, 5, 'sd', '2024-10-21 13:44:01'),
(55, 5, 1, 'sd', '2024-10-21 13:44:06'),
(56, 1, 5, 's', '2024-10-21 13:44:39'),
(57, 1, 5, 's', '2024-10-21 13:45:04'),
(58, 1, 5, 's', '2024-10-21 13:45:38'),
(59, 1, 5, 'aaaaaa', '2024-10-21 14:09:51'),
(60, 1, 5, 'sd', '2024-10-22 16:26:28'),
(61, 5, 1, 'sd', '2024-10-22 16:26:54');

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `google_uid` varchar(255) DEFAULT NULL,
  `line_uid` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `line_access_token` text,
  `status` varchar(255) NOT NULL DEFAULT 'offline',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `name`, `username`, `password`, `email`, `avatar`, `birth_date`, `sex`, `phone`, `google_uid`, `line_uid`, `photo_url`, `line_access_token`, `status`, `created_at`, `updated_at`) VALUES
(1, '啊哈', 'herry', '$2b$10$RWBUnwCy6ntgICDmDxJou.ex6zvr0qWHYz6J286sPmEp2m7s9BOH2', 'herry@test.com', 'default.png', '1980-07-13', '男', '0906102808', NULL, NULL, NULL, NULL, 'offline', '2024-07-26 22:06:00', '2024-10-12 15:29:30'),
(2, '金妮', 'ginny', '$2b$10$a3h3RFgtECCgUpYT6R/Tn.CCUEToqKDZ7A69nM6x1jCp6Uvsg8SnK', 'ginny@test.com', '1.png', '1981-08-11', '女', '0946840920', NULL, NULL, NULL, NULL, 'offline', '2024-07-26 22:06:00', '2024-07-26 22:06:00'),
(3, '妙麗', 'mione', '$2b$10$TniWfS80tWE8tj3RwfGne.gP9XpHCt2wZG/8/sRSqfKqG5jHe4ejK', 'mione@test.com', '', '1979-09-19', '女', '0912541534', NULL, NULL, NULL, NULL, 'offline', '2024-07-26 22:06:00', '2024-07-26 22:06:00'),
(5, '張豪誠', 'asd123456', '$2b$10$kRnlupqUepTmwswtywyu8eywBU9fu4xE/x4SkMbibGzNcbV8Zj/Ti', 'nimabo0121@gmail.com', '5.png', '2024-09-30', '男', '0906102808', NULL, NULL, NULL, NULL, 'offline', '2024-10-12 04:23:48', '2024-10-12 04:24:08'),
(6, 'yu sung LIU', NULL, NULL, 'nimabo0121@gmail.com', NULL, NULL, NULL, NULL, '111716724075720857765', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLx58k8Dy3TjrzlchGvk35wrSaXj_J_zrozxrgUBLQMgJRVP5my=s96-c', NULL, 'offline', '2024-10-12 04:29:37', '2024-10-12 04:29:37'),
(7, '金哈哈', 'zxc123456', '$2b$10$UxXMeFl2hHUdtJkdwq47vOW5/whpnkQYqMhKOL.vlSTPJJKljMLNW', 'nimabos0121@gmail.com', 'default.png', '2024-10-01', '男', '0906102808', NULL, NULL, NULL, NULL, 'offline', '2024-10-17 18:37:09', '2024-10-17 18:37:09'),
(8, 'apple', 'asd1234567', '$2b$10$OwZ3jR3ve0a5Ks22tqfKCuN0KjChA2W3cpdErOIQvBOKo.Q/LnUOm', 'ron@test.com', NULL, '2024-11-04', '男', '0962033555', NULL, NULL, NULL, NULL, 'offline', '2024-11-05 20:54:34', '2024-11-05 20:54:34');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- 資料表索引 `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
