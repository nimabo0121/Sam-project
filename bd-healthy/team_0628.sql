-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-10-14 14:53:33
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
-- 資料表結構 `member_login`
--

CREATE TABLE `member_login` (
  `member_profile_id` int DEFAULT NULL,
  `account` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `status` enum('active','blacklist') NOT NULL DEFAULT 'active',
  `reason` varchar(255) DEFAULT NULL,
  `blacklist_date` datetime DEFAULT NULL COMMENT '黑名單日期'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `member_login`
--

INSERT INTO `member_login` (`member_profile_id`, `account`, `password`, `hash`, `role`, `status`, `reason`, `blacklist_date`) VALUES
(1, 'user1', 'admin', 'hashed_password', 'admin', 'active', NULL, NULL),
(2, 'user2', 'admin', 'hashed_password', 'admin', 'active', NULL, NULL),
(3, 'wangwu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(4, 'zhaoliu', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(5, 'xiaoming', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(6, 'xiaohong', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(7, 'xiaogang', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(8, 'xiaoli', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(9, 'xiaohua', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(10, 'xiaoming2', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(11, 'zhangsi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(12, 'liwu', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(13, 'wangliu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(14, 'zhaoqi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(15, 'xiaoba', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(16, 'xiaojiu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(17, 'xiaoshi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(18, 'xiaoshier', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(19, 'xiaoshisan', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(20, 'xiaoshisi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(21, 'zhangshisi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(22, 'lishiwu', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(23, 'wangshiliu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(24, 'zhaoshiqi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(25, 'xiaoshiba', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(26, 'xiaoshijiu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(27, 'xiaoshierling', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(28, 'xiaoshieryi', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(29, 'xiaoshierer', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(30, 'xiaoshiersan', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(31, 'asd123456', '$2y$10$GnoPoG5jAbF2vQlbsilneu.t3iGtdofNLFn2TJqZ4ORC6xiyhaQvG', '$2y$10$GnoPoG5jAbF2vQlbsilneu.t3iGtdofNLFn2TJqZ4ORC6xiyhaQvG', 'user', 'active', NULL, NULL),
(1, 'user1', 'admin', 'hashed_password', 'admin', 'active', NULL, NULL),
(2, 'user2', 'admin', 'hashed_password', 'admin', 'active', NULL, NULL),
(3, 'wangwu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(4, 'zhaoliu', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(5, 'xiaoming', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(6, 'xiaohong', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(7, 'xiaogang', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(8, 'xiaoli', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(9, 'xiaohua', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(10, 'xiaoming2', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(11, 'zhangsi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(12, 'liwu', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(13, 'wangliu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(14, 'zhaoqi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(15, 'xiaoba', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(16, 'xiaojiu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(17, 'xiaoshi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(18, 'xiaoshier', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(19, 'xiaoshisan', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(20, 'xiaoshisi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(21, 'zhangshisi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(22, 'lishiwu', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(23, 'wangshiliu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(24, 'zhaoshiqi', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(25, 'xiaoshiba', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(26, 'xiaoshijiu', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(27, 'xiaoshierling', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(28, 'xiaoshieryi', 'password456', 'hashed_password', 'user', 'active', NULL, NULL),
(29, 'xiaoshierer', 'password789', 'hashed_password', 'user', 'active', NULL, NULL),
(30, 'xiaoshiersan', 'password123', 'hashed_password', 'user', 'active', NULL, NULL),
(31, 'asd123456', '$2y$10$GnoPoG5jAbF2vQlbsilneu.t3iGtdofNLFn2TJqZ4ORC6xiyhaQvG', '$2y$10$GnoPoG5jAbF2vQlbsilneu.t3iGtdofNLFn2TJqZ4ORC6xiyhaQvG', 'user', 'active', NULL, NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `member_profile`
--

CREATE TABLE `member_profile` (
  `id` int NOT NULL,
  `member_name` varchar(50) NOT NULL,
  `gender` varchar(5) NOT NULL,
  `email` varchar(254) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `birthday` date NOT NULL,
  `create_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `member_profile`
--

INSERT INTO `member_profile` (`id`, `member_name`, `gender`, `email`, `mobile`, `birthday`, `create_date`) VALUES
(1, '张三', '男', 'zhangan@example.com', '13812345678', '1990-05-15', '2024-05-01 00:00:00'),
(2, '李四', '女', 'lii@example.com', '13987654321', '1988-10-20', '2024-05-02 00:00:00'),
(3, '王五', '男', 'wanwu@example.com', '13654321098', '1995-03-08', '2024-05-03 00:00:00'),
(4, '赵六', '女', 'zhaoliu@example.com', '13765432109', '1992-08-25', '2024-05-04 00:00:00'),
(5, '小明', '男', 'xiaoing@example.com', '13578901234', '1998-12-10', '2024-05-05 00:00:00'),
(6, '小红', '女', 'xiahng@example.com', '13658909234', '1997-11-20', '2024-05-06 00:00:00'),
(7, '小刚', '男', 'xiagang@example.com', '12315151155', '1996-09-15', '2024-05-07 00:00:00'),
(8, '小李', '女', 'xiaoliexample.com', '13578901236', '1994-07-05', '2024-05-08 00:00:00'),
(9, '小华', '男', 'xiohua@example.com', '13578971237', '1993-04-25', '2024-05-09 00:00:00'),
(10, '小明', '女', 'xiaoming2@example.com', '13578901238', '1991-02-15', '2024-05-10 00:00:00'),
(11, '张四', '男', 'zhangsi@example.com', '13812345679', '1991-05-15', '2024-05-11 00:00:00'),
(12, '李五', '女', 'liwu@example.com', '13987654322', '1989-10-20', '2024-05-12 00:00:00'),
(13, '王六', '男', 'angliu@example.com', '13654321099', '1996-03-08', '2024-05-13 00:00:00'),
(14, '赵七', '女', 'zhaoqi@example.com', '13765432110', '1993-08-25', '2024-05-14 00:00:00'),
(15, '小八', '男', 'xaoba@example.com', '13578901235', '1999-12-10', '2024-05-15 00:00:00'),
(16, '小九', '女', 'xiaojiu@example.com', '73578901236', '1992-07-10', '2024-05-16 00:00:00'),
(17, '小十', '男', 'xiaohi@example.com', '13578901237', '1995-04-10', '2024-05-17 00:00:00'),
(18, '小十一', '女', 'xiaoshier@example.com', '1357890238', '1994-02-10', '2024-05-18 00:00:00'),
(19, '小十二', '男', 'aoshisan@example.com', '13578901239', '1997-11-10', '2024-05-19 00:00:00'),
(20, '小十三', '女', 'aoshisi@example.com', '13578901240', '1998-09-10', '2024-05-20 00:00:00'),
(21, '张十四', '男', 'zhanshisi@example.com', '1381235670', '1992-05-15', '2024-05-21 00:00:00'),
(22, '李十五', '女', 'lishiwu@example.com', '13987654323', '1994-10-20', '2024-05-22 00:00:00'),
(23, '王十六', '男', 'wangshiliu@example.com', '1365321090', '1998-03-08', '2024-05-23 00:00:00'),
(24, '赵十七', '女', 'zaoshiqi@example.com', '13765432101', '1991-08-25', '2024-05-24 00:00:00'),
(25, '小十八', '男', 'xiashba@example.com', '1378901241', '1996-12-10', '2024-05-25 00:00:00'),
(26, '小十九', '女', 'xiashijiu@example.com', '1358901242', '1993-07-10', '2024-05-26 00:00:00'),
(27, '小二十', '男', 'xiaohierling@example.com', '13578901243', '1995-04-10', '2024-05-27 00:00:00'),
(28, '小二十一', '女', 'xiaoshieryi@example.com', '1357801244', '1997-02-10', '2024-05-28 00:00:00'),
(29, '小二十二', '男', 'xaoshierer@example.com', '1357890245', '1999-11-10', '2024-05-29 00:00:00'),
(30, '小二十三', '女', 'xiaoshersan@example.com', '1357901246', '2000-09-10', '2024-05-30 00:00:00'),
(31, 'asd123456', '女', 'asd123456@gmail.com', '0987652323', '2024-05-07', '2024-06-06 14:35:59');


CREATE TABLE `purchase_item` (
  `id` int NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- 資料表結構 `purchase_order`
--

CREATE TABLE `purchase_order` (
  `id` varchar(255) NOT NULL COMMENT 'UUID',
  `user_id` int NOT NULL,
  `amount` int DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL COMMENT 'LINE Pay, 信用卡, ATM',
  `shipping` varchar(255) DEFAULT NULL COMMENT '7-11, Family Mart, Hi-Life, OK Mart, 郵局, 宅配',
  `status` varchar(255) DEFAULT NULL COMMENT 'pending, paid, fail, cancel, error',
  `order_info` text COMMENT 'send to line pay',
  `reservation` text COMMENT 'get from line pay',
  `confirm` text COMMENT 'confirm from line pay',
  `return_code` varchar(255) DEFAULT NULL,
  `order_name1` text,
  `order_phone1` text,
  `order_zip1` text,
  `order_county1` text,
  `order_district1` text,
  `order_address1` text,
  `order_name2` text,
  `order_phone2` text,
  `order_zip2` text,
  `order_county2` text,
  `order_district2` text,
  `order_address2` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `purchase_order`
--

INSERT INTO `purchase_order` (`id`, `user_id`, `amount`, `transaction_id`, `payment`, `shipping`, `status`, `order_info`, `reservation`, `confirm`, `return_code`, `order_name1`, `order_phone1`, `order_zip1`, `order_county1`, `order_district1`, `order_address1`, `order_name2`, `order_phone2`, `order_zip2`, `order_county2`, `order_district2`, `order_address2`, `created_at`, `updated_at`) VALUES
('1ad558ee-0801-453d-854d-ad4bbc7ff06f', 1, 500, NULL, NULL, NULL, '已付款', '{\"orderId\":\"1ad558ee-0801-453d-854d-ad4bbc7ff06f\",\"currency\":\"TWD\",\"amount\":500,\"packages\":[{\"id\":\"9106e849-fa56-4b8c-a114-4aa5151b01c4\",\"amount\":500,\"products\":[{\"id\":1,\"name\":\"測試商品1\",\"quantity\":1,\"price\":100},{\"id\":2,\"name\":\"測試商品2\",\"quantity\":4,\"price\":100}]}],\"options\":{\"display\":{\"locale\":\"zh_TW\"}}}', NULL, NULL, NULL, '張三', '0912345678', '100', '台北市', '中正區', '忠孝東路一段 1 號', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-11 20:18:10', '2024-07-26 22:06:00'),
('217b318a-be75-45cb-a078-96b7eec26caa', 1, 300, NULL, NULL, NULL, '完成訂單', '{\"orderId\":\"217b318a-be75-45cb-a078-96b7eec26cba\",\"currency\":\"TWD\",\"amount\":300,\"packages\":[{\"id\":\"043a689f-e2c1-4b03-a3ec-f338df3a4e4e\",\"amount\":300,\"products\":[{\"id\":1,\"name\":\"測試商品1\",\"quantity\":1,\"price\":100},{\"id\":2,\"name\":\"測試商品2\",\"quantity\":2,\"price\":100}]}],\"options\":{\"display\":{\"locale\":\"zh_TW\"}}}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '李四444', '0987654321', '320', '新北市', '板橋區', '文化路二段 123 號', '2024-07-11 19:56:57', '2024-07-26 22:06:00'),
('217b318a-be75-45cb-a078-96b7eec26cba', 1, 300, NULL, NULL, NULL, '店家以確認', '{\"orderId\":\"217b318a-be75-45cb-a078-96b7eec26cba\",\"currency\":\"TWD\",\"amount\":300,\"packages\":[{\"id\":\"043a689f-e2c1-4b03-a3ec-f338df3a4e4e\",\"amount\":300,\"products\":[{\"id\":1,\"name\":\"測試商品1\",\"quantity\":1,\"price\":100},{\"id\":2,\"name\":\"測試商品2\",\"quantity\":2,\"price\":100}]}],\"options\":{\"display\":{\"locale\":\"zh_TW\"}}}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '李四444', '0987654321', '320', '新北市', '板橋區', '文化路二段 123 號', '2024-07-11 19:56:57', '2024-07-26 22:06:00');

-- --------------------------------------------------------

--
-- 資料表結構 `qrcode_ecpay`
--

CREATE TABLE `qrcode_ecpay` (
  `id` varchar(255) NOT NULL COMMENT 'UUID',
  `user_id` int NOT NULL,
  `amount` int DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment` varchar(255) DEFAULT NULL COMMENT 'LINE Pay, 信用卡, ATM',
  `shipping` varchar(255) DEFAULT NULL COMMENT '7-11, Family Mart, Hi-Life, OK Mart, 郵局, 宅配',
  `status` varchar(255) DEFAULT NULL COMMENT 'pending, paid, fail, cancel, error',
  `order_info` text COMMENT 'send to line pay',
  `reservation` text COMMENT 'get from line pay',
  `confirm` text COMMENT 'confirm from line pay',
  `return_code` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

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
  `name1` varchar(255) DEFAULT NULL,
  `phone1` varchar(255) DEFAULT NULL,
  `zip1` varchar(255) DEFAULT NULL,
  `county1` varchar(255) DEFAULT NULL,
  `district1` varchar(255) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `name2` varchar(255) DEFAULT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `zip2` varchar(255) DEFAULT NULL,
  `county2` varchar(255) DEFAULT NULL,
  `district2` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'offline',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `name`, `username`, `password`, `email`, `avatar`, `birth_date`, `sex`, `phone`, `google_uid`, `line_uid`, `photo_url`, `line_access_token`, `name1`, `phone1`, `zip1`, `county1`, `district1`, `address1`, `name2`, `phone2`, `zip2`, `county2`, `district2`, `address2`, `status`, `created_at`, `updated_at`) VALUES
(1, '啊哈', 'herry', '$2b$10$RWBUnwCy6ntgICDmDxJou.ex6zvr0qWHYz6J286sPmEp2m7s9BOH2', 'herry@test.com', '1.png', '1980-07-13', '男', '0906102808', NULL, NULL, NULL, NULL, 'herry', '0906102808', '336', '桃園市', '復興區', '桃園市桃園區劉南路377號18樓', '', '', '', '', '', '', 'offline', '2024-07-26 22:06:00', '2024-10-12 15:29:30'),
(2, '金妮', 'ginny', '$2b$10$a3h3RFgtECCgUpYT6R/Tn.CCUEToqKDZ7A69nM6x1jCp6Uvsg8SnK', 'ginny@test.com', '', '1981-08-11', '女', '0946840920', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'offline', '2024-07-26 22:06:00', '2024-07-26 22:06:00'),
(3, '妙麗', 'mione', '$2b$10$TniWfS80tWE8tj3RwfGne.gP9XpHCt2wZG/8/sRSqfKqG5jHe4ejK', 'mione@test.com', '', '1979-09-19', '女', '0912541534', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'offline', '2024-07-26 22:06:00', '2024-07-26 22:06:00'),
(5, '張豪誠', 'asd123456', '$2b$10$kRnlupqUepTmwswtywyu8eywBU9fu4xE/x4SkMbibGzNcbV8Zj/Ti', 'nimabo0121@gmail.com', '5.png', '2024-09-30', '男', '0906102808', NULL, NULL, NULL, NULL, '', '', '', '', '', '', '', '', '', '', '', '', 'offline', '2024-10-12 04:23:48', '2024-10-12 04:24:08'),
(6, 'yu sung LIU', NULL, NULL, 'nimabo0121@gmail.com', NULL, NULL, NULL, NULL, '111716724075720857765', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLx58k8Dy3TjrzlchGvk35wrSaXj_J_zrozxrgUBLQMgJRVP5my=s96-c', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'offline', '2024-10-12 04:29:37', '2024-10-12 04:29:37');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `product_color`
--
ALTER TABLE `product_color`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `product_size`
--
ALTER TABLE `product_size`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `product_tag`
--
ALTER TABLE `product_tag`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `purchase_item`
--
ALTER TABLE `purchase_item`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `qrcode_ecpay`
--
ALTER TABLE `qrcode_ecpay`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `color`
--
ALTER TABLE `color`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `favorite`
--
ALTER TABLE `favorite`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1001;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_color`
--
ALTER TABLE `product_color`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2492;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_size`
--
ALTER TABLE `product_size`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2506;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_tag`
--
ALTER TABLE `product_tag`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2036;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `purchase_item`
--
ALTER TABLE `purchase_item`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `size`
--
ALTER TABLE `size`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
