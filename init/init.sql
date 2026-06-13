-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: smartfix
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

-- Создаем базу, если ее нет
CREATE DATABASE IF NOT EXISTS smartfix;

-- Создаем пользователя, который может подключаться ТОЛЬКО из сети Docker
-- (используем имя сервиса или маску сети, если Docker настроен)
CREATE USER IF NOT EXISTS 'smartfix_user'@'%' IDENTIFIED BY '${DB_PASSWORD}';

-- Даем права ТОЛЬКО на нужную базу
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX ON smartfix.* TO 'smartfix_user'@'%';

FLUSH PRIVILEGES;

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20251119165002_InitialCreate','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20251120122311_InitialCreate','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20251123201509_AddRejectedStatus','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20251123201653_AddRejectedStatusSafe','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20251123204949_InitialComments3NF','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260410173753_AddInventoryTables','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260410174211_AddInventoryTablesV2','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260410174748_AddPaymentsAndSalary','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260416143900_SparePartTypeAddMigration','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260416150439_FixTypeSync','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260416151643_KeySparePartTypeAdd','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260502151238_Payment','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260502152324_RequestPrice','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260505153502_AddEmployeesTable','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260505195656_AddTelegramChatIdToUser','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260506155112_PushMigration','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260507215902_AddImageUrlToService','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260508170618_AddReviewsTable','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260508185705_AddParentReviewMigrations','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260509161912_AddIsPaidToRequests','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260509220413_AddAvatarToEmployee','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260509221402_RemoveAvatarFromEmployee','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260509230448_AddRepairServicesTable','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260509230857_AnalyticsAndRepairServices','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260509231718_AnalyticsAndRepairServices2','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260509232324_UpdateTableRepairReview','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260511140201_AddPriceToRepairPart','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260514144032_AddWiki','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260514193254_AddStockMovementUser','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260515000952_AddMinimumThresholdAndNotifications','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260515002723_AddNotificationsTable','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260515003135_AddNotifications','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260515151316_AddPromotions','9.0.0');
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES ('20260516180043_UpdateClientLoyalty','9.0.0');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RepairRequestId` int NOT NULL,
  `UserId` int NOT NULL,
  `Text` text NOT NULL,
  `Date` datetime NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_request` (`RepairRequestId`),
  KEY `idx_user` (`UserId`),
  KEY `IX_Comments_UserId` (`UserId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`RepairRequestId`) REFERENCES `repairrequests` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Comments_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` (`Id`, `RepairRequestId`, `UserId`, `Text`, `Date`) VALUES (1,1,4,'Сдала телефон утром.','2025-10-25 10:00:00');
INSERT INTO `comments` (`Id`, `RepairRequestId`, `UserId`, `Text`, `Date`) VALUES (3,2,3,'Диагностика завершена. Произведена чистка и замена термопасты. Ноутбук готов к выдаче.','2025-10-26 15:00:00');
INSERT INTO `comments` (`Id`, `RepairRequestId`, `UserId`, `Text`, `Date`) VALUES (13,11,26,'Оставил заявку. Завезу в 17:09.','2026-04-21 16:47:16');
INSERT INTO `comments` (`Id`, `RepairRequestId`, `UserId`, `Text`, `Date`) VALUES (14,11,7,'Мастер Виталий Каспер принял заявку в работу','2026-04-21 16:47:34');
INSERT INTO `comments` (`Id`, `RepairRequestId`, `UserId`, `Text`, `Date`) VALUES (17,5,7,'Поко','2026-05-07 16:18:52');
INSERT INTO `comments` (`Id`, `RepairRequestId`, `UserId`, `Text`, `Date`) VALUES (50,6,8,'Поко','2026-05-12 16:59:17');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `BaseSalary` decimal(65,30) NOT NULL,
  `BonusPercentage` decimal(65,30) NOT NULL,
  `UserId` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Employee_UserId` (`UserId`),
  CONSTRAINT `FK_Employee_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` (`Id`, `BaseSalary`, `BonusPercentage`, `UserId`) VALUES (1,70000.000000000000000000000000000000,2.000000000000000000000000000000,2);
INSERT INTO `employees` (`Id`, `BaseSalary`, `BonusPercentage`, `UserId`) VALUES (2,50000.000000000000000000000000000000,2.000000000000000000000000000000,7);
INSERT INTO `employees` (`Id`, `BaseSalary`, `BonusPercentage`, `UserId`) VALUES (3,20000.000000000000000000000000000000,10.000000000000000000000000000000,8);
INSERT INTO `employees` (`Id`, `BaseSalary`, `BonusPercentage`, `UserId`) VALUES (7,50000.000000000000000000000000000000,10.000000000000000000000000000000,3);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IsRead` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (1,'Внимание: запас детали \'Термопаста Arctic MX-4 (4г)\' заканчивается. Осталось: 2 шт.',1,'2026-05-15 00:33:13.404449',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (2,'Внимание: запас детали \'Дисплей iPhone 13 Pro (Original)\' заканчивается. Осталось: 2 шт.',0,'2026-05-15 00:38:52.931922',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (3,'Внимание: запас детали \'Конденсатор высоковольтный для микроволновой печи\' заканчивается. Осталось: 1 шт.',0,'2026-05-15 00:40:23.296858',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (4,'Ваше устройство Микроволновка DEXP  MB-70 готово к выдаче!',1,'2026-05-15 00:40:23.298385',26);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (5,'Внимание: запас детали \'Конденсатор высоковольтный для микроволновой печи\' заканчивается. Осталось: 1 шт.',0,'2026-05-15 00:42:59.014267',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (6,'Ваше устройство Микроволновка DEXP  MB-70 готово к выдаче!',1,'2026-05-15 00:42:59.014335',26);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (7,'Внимание: запас детали \'Конденсатор высоковольтный для микроволновой печи\' заканчивается. Осталось: 1 шт.',0,'2026-05-15 00:46:29.304645',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (8,'Ваше устройство Микроволновка DEXP  MB-70 готово к выдаче!',0,'2026-05-15 00:46:29.304700',26);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (9,'Внимание: запас детали \'Дисплей iPhone 13 Pro (Original)\' заканчивается. Осталось: 1 шт.',0,'2026-05-15 00:52:20.862986',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (10,'Внимание: запас детали \'Дисплей iPhone 13 Pro (Original)\' заканчивается. Осталось: 3 шт.',0,'2026-05-15 15:40:06.821054',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (11,'Внимание: запас детали \'Аккумулятор Samsung\' заканчивается. Осталось: 1 шт.',0,'2026-05-15 17:31:23.483717',NULL);
INSERT INTO `notifications` (`Id`, `Message`, `IsRead`, `CreatedAt`, `UserId`) VALUES (12,'Ваше устройство 1 1 1 готово к выдаче!',1,'2026-05-15 17:31:23.488001',26);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RepairRequestId` int NOT NULL,
  `Amount` decimal(65,30) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `PaymentMethod` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IsPaid` tinyint(1) NOT NULL,
  `PaidAt` datetime(6) DEFAULT NULL,
  `Status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `YooKassaPaymentId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_Payments_RepairRequestId` (`RepairRequestId`),
  CONSTRAINT `FK_Payments_RepairRequests_RepairRequestId` FOREIGN KEY (`RepairRequestId`) REFERENCES `repairrequests` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (11,17,5350.000000000000000000000000000000,'2026-05-10 20:58:32.586182','Card',0,NULL,'Pending','31930541-000f-5001-8000-15eadb080d7a');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (12,21,1000.000000000000000000000000000000,'2026-05-12 13:49:04.594076','Card',0,NULL,'Pending','31954398-000f-5001-8000-118485bde3b5');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (13,11,13500.000000000000000000000000000000,'2026-05-14 21:41:50.426767','Card',0,NULL,'Pending','3198556e-000f-5001-8000-137f14559ffc');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (14,11,13500.000000000000000000000000000000,'2026-05-16 19:34:58.447774','Card',0,NULL,'Pending','319adaa3-000f-5001-8000-199d9cd40d3e');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (15,11,13500.000000000000000000000000000000,'2026-05-16 19:52:32.596125','Card',0,NULL,'Pending','319adec1-000f-5000-b000-194250478de6');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (16,11,13500.000000000000000000000000000000,'2026-05-16 19:55:57.329636','Card',0,NULL,'Pending','319adf8e-000f-5001-9000-1610ca422853');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (17,11,13500.000000000000000000000000000000,'2026-05-16 19:56:04.124289','Card',0,NULL,'Pending','319adf95-000f-5001-9000-16738fa3e971');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (18,11,13500.000000000000000000000000000000,'2026-05-16 19:59:59.236358','Card',0,NULL,'Pending','319ae080-000f-5000-8000-107f1e3108fd');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (19,11,13438.000000000000000000000000000000,'2026-05-16 20:00:33.060324','Card',0,NULL,'Pending','319ae0a2-000f-5001-8000-1908c72e1b47');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (20,11,13457.000000000000000000000000000000,'2026-05-16 20:00:44.038739','Card',0,NULL,'Pending','319ae0ad-000f-5001-9000-1d8d8ed5376a');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (21,11,13500.000000000000000000000000000000,'2026-05-16 20:06:03.458228','Card',0,NULL,'Pending','319ae1ec-000f-5000-b000-18a447437d39');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (22,11,13500.000000000000000000000000000000,'2026-05-16 20:06:19.625707','Card',0,NULL,'Pending','319ae1fc-000f-5001-8000-15104de424a9');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (23,11,13500.000000000000000000000000000000,'2026-05-16 20:06:30.927427','Card',0,NULL,'Pending','319ae208-000f-5000-8000-162dbc2670f5');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (24,11,13500.000000000000000000000000000000,'2026-05-16 20:06:41.665603','Card',0,NULL,'Pending','319ae212-000f-5000-b000-1227daacc71c');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (25,11,13500.000000000000000000000000000000,'2026-05-16 20:06:59.427019','Card',0,NULL,'Pending','319ae224-000f-5001-8000-1c5197b8283e');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (26,11,13500.000000000000000000000000000000,'2026-05-16 20:07:24.084325','Card',0,NULL,'Pending','319ae23d-000f-5000-8000-12468373aaca');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (27,11,13500.000000000000000000000000000000,'2026-05-16 20:07:43.056524','Card',0,NULL,'Pending','319ae250-000f-5000-b000-109392b786dc');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (28,11,13500.000000000000000000000000000000,'2026-05-16 20:07:56.852686','Card',0,NULL,'Pending','319ae25e-000f-5000-8000-14d82261f9d1');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (29,11,13500.000000000000000000000000000000,'2026-05-16 20:08:01.868600','Card',0,NULL,'Pending','319ae263-000f-5000-b000-1b8b8c61b293');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (30,11,13500.000000000000000000000000000000,'2026-05-16 20:08:07.662307','Card',0,NULL,'Pending','319ae268-000f-5000-b000-174a6b884dcb');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (31,11,13500.000000000000000000000000000000,'2026-05-16 20:08:28.565506','Card',0,NULL,'Pending','319ae27d-000f-5000-b000-1073ce0b0ad1');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (32,11,13500.000000000000000000000000000000,'2026-05-16 20:08:41.221119','Card',0,NULL,'Pending','319ae28a-000f-5000-b000-172d32f6e590');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (33,11,13500.000000000000000000000000000000,'2026-05-16 20:14:47.651078','Card',0,NULL,'Pending','319ae3f8-000f-5001-9000-1772a38f370f');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (34,11,13500.000000000000000000000000000000,'2026-05-16 20:14:57.908025','Card',0,NULL,'Pending','319ae403-000f-5001-8000-171e208dec0a');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (35,11,12600.000000000000000000000000000000,'2026-05-16 20:15:05.608184','Card',0,NULL,'Pending','319ae40a-000f-5000-b000-16c3314363a1');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (36,11,13468.000000000000000000000000000000,'2026-05-16 20:15:17.761748','Card',0,NULL,'Pending','319ae417-000f-5000-8000-1490864de7ab');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (37,11,13500.000000000000000000000000000000,'2026-05-16 20:16:19.886180','Card',0,NULL,'Pending','319ae455-000f-5000-b000-14f75d73a11f');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (38,11,13500.000000000000000000000000000000,'2026-05-16 20:16:39.635925','Card',0,NULL,'Pending','319ae468-000f-5001-8000-1b3c855ceedf');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (39,11,13500.000000000000000000000000000000,'2026-05-16 20:21:44.425751','Card',0,NULL,'Pending','319ae599-000f-5000-8000-13200e2f6911');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (40,11,13500.000000000000000000000000000000,'2026-05-16 20:22:06.767232','Card',0,NULL,'Pending','319ae5b0-000f-5001-8000-1d49bb2ac51c');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (41,11,13500.000000000000000000000000000000,'2026-05-16 20:28:04.949915','Card',0,NULL,'Pending','319ae716-000f-5001-8000-11325c5cac4b');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (42,21,1000.000000000000000000000000000000,'2026-05-16 20:28:21.716136','Card',0,NULL,'Pending','319ae727-000f-5000-8000-16af8109dd6c');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (43,11,13500.000000000000000000000000000000,'2026-05-16 20:29:54.791569','Card',0,NULL,'Pending','319ae784-000f-5000-b000-135590de8db7');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (44,11,13500.000000000000000000000000000000,'2026-05-16 21:16:14.742345','Card',0,NULL,'Pending','319af260-000f-5000-8000-1a3180550573');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (45,11,13500.000000000000000000000000000000,'2026-05-16 21:18:54.582016','Card',0,NULL,'Pending','319af300-000f-5001-9000-18989ddef919');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (46,11,12825.000000000000000000000000000000,'2026-05-16 21:34:34.587349','Card',0,NULL,'Pending','319af6ac-000f-5001-9000-14bc926067e9');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (47,11,12824.000000000000000000000000000000,'2026-05-16 21:34:46.095981','Card',0,NULL,'Pending','319af6b7-000f-5001-8000-1ab581dad300');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (48,11,12825.000000000000000000000000000000,'2026-05-16 21:41:52.561495','Card',0,NULL,'Pending','319af862-000f-5001-8000-1761735d74e1');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (49,11,12825.000000000000000000000000000000,'2026-05-16 21:53:36.396141','Card',0,NULL,'Pending','319afb22-000f-5001-8000-1169698e6fd9');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (50,11,12825.000000000000000000000000000000,'2026-05-16 21:56:16.302375','Card',0,NULL,'Pending','319afbc2-000f-5000-8000-111eaaf39da4');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (51,11,12825.000000000000000000000000000000,'2026-05-16 21:56:45.725287','Card',0,NULL,'Pending','319afbdf-000f-5001-8000-14b8f2fb6eef');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (52,11,12814.000000000000000000000000000000,'2026-05-16 22:29:30.810822','Card',0,NULL,'Pending','319b038c-000f-5000-b000-1c709ac226f9');
INSERT INTO `payments` (`Id`, `RepairRequestId`, `Amount`, `CreatedAt`, `PaymentMethod`, `IsPaid`, `PaidAt`, `Status`, `YooKassaPaymentId`) VALUES (53,11,11926.000000000000000000000000000000,'2026-05-16 22:29:40.939539','Card',0,NULL,'Pending','319b0396-000f-5001-8000-187a0e23116a');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repairparts`
--

DROP TABLE IF EXISTS `repairparts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repairparts` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RepairRequestId` int NOT NULL,
  `SparePartId` int NOT NULL,
  `Quantity` int NOT NULL,
  `PriceAtTheTime` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  PRIMARY KEY (`Id`),
  KEY `IX_RepairParts_RepairRequestId` (`RepairRequestId`),
  KEY `IX_RepairParts_SparePartId` (`SparePartId`),
  CONSTRAINT `FK_RepairParts_RepairRequests_RepairRequestId` FOREIGN KEY (`RepairRequestId`) REFERENCES `repairrequests` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_RepairParts_SpareParts_SparePartId` FOREIGN KEY (`SparePartId`) REFERENCES `spareparts` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repairparts`
--

LOCK TABLES `repairparts` WRITE;
/*!40000 ALTER TABLE `repairparts` DISABLE KEYS */;
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (4,20,4,1,0.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (21,2,1,1,12500.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (23,21,7,1,0.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (30,1,2,0,0.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (31,11,1,0,0.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (32,14,1,0,12500.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (33,15,9,0,500.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (38,24,15,1,243.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (39,6,15,1,243.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (42,5,16,1,0.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (43,23,8,1,803.000000000000000000000000000000);
INSERT INTO `repairparts` (`Id`, `RepairRequestId`, `SparePartId`, `Quantity`, `PriceAtTheTime`) VALUES (46,25,15,1,243.000000000000000000000000000000);
/*!40000 ALTER TABLE `repairparts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repairrequests`
--

DROP TABLE IF EXISTS `repairrequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repairrequests` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClientId` int NOT NULL,
  `TechnicianId` int DEFAULT NULL,
  `Device` varchar(150) NOT NULL,
  `IssueDescription` text NOT NULL,
  `Status` enum('New','InProgress','Ready','Closed','Rejected') NOT NULL,
  `CreatedAt` date NOT NULL,
  `Price` decimal(65,30) DEFAULT NULL,
  `IsPaid` tinyint(1) NOT NULL DEFAULT '0',
  `CompletedAt` datetime(6) DEFAULT NULL,
  `MasterBonus` decimal(65,30) DEFAULT NULL,
  `PartsCost` decimal(65,30) DEFAULT NULL,
  `BonusesSubtracted` decimal(65,30) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_status` (`Status`),
  KEY `idx_technician` (`TechnicianId`),
  KEY `idx_client` (`ClientId`),
  KEY `idx_created` (`CreatedAt` DESC),
  KEY `IX_RepairRequests_ClientId` (`ClientId`),
  KEY `IX_RepairRequests_TechnicianId` (`TechnicianId`),
  CONSTRAINT `FK_RepairRequests_Users_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `users` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_RepairRequests_Users_TechnicianId` FOREIGN KEY (`TechnicianId`) REFERENCES `users` (`Id`),
  CONSTRAINT `repairrequests_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `users` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `repairrequests_ibfk_2` FOREIGN KEY (`TechnicianId`) REFERENCES `users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repairrequests`
--

LOCK TABLES `repairrequests` WRITE;
/*!40000 ALTER TABLE `repairrequests` DISABLE KEYS */;
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (1,4,2,'Samsung A52','Заменить аккумулятор','Ready','2025-10-25',4000.000000000000000000000000000000,0,'2026-05-01 20:50:58.967031',430.000000000000000000000000000000,2100.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (2,5,2,'MacBook Pro 16\"','Ноутбук сильно греется и шумит даже при небольшой нагрузке.','Ready','2025-10-24',13500.000000000000000000000000000000,0,'2026-05-02 18:33:18.605814',0.000000000000000000000000000000,0.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (3,4,3,'Apple Watch Series 7','Часы перестали включаться после падения.','Ready','2025-10-26',5000.000000000000000000000000000000,0,'2026-05-03 21:14:22.342995',400.000000000000000000000000000000,200.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (5,9,7,'Телефон Poco','Срочность: Стандартная. Проблема: Отличный телефон','Ready','2025-11-23',2500.000000000000000000000000000000,0,'2026-05-15 02:06:59.642689',400.000000000000000000000000000000,0.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (6,9,7,'Телефон Poco X3 Pro','Срочность: Стандартная. Проблема: Разбит внутри и ему очень грустно. Развеселите его','Ready','2025-11-23',243.000000000000000000000000000000,0,'2026-05-15 01:23:00.083037',NULL,NULL,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (11,26,7,'Телефон Apple Iphone 13','Срочность: Стандартная. Проблема: Разбил экран','Ready','2026-04-21',13500.000000000000000000000000000000,0,'2026-05-05 20:53:21.901467',1500.000000000000000000000000000000,1000.000000000000000000000000000000,899.000000000000000000000000000000);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (14,4,7,'iPhone 13','Замена экрана','Ready','2026-05-01',13500.000000000000000000000000000000,1,'2026-05-06 20:53:43.452606',1000.000000000000000000000000000000,2500.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (15,5,2,'Samsung S21','Замена разъема','Ready','2026-05-02',1500.000000000000000000000000000000,1,'2026-05-07 21:00:10.023944',600.000000000000000000000000000000,500.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (16,9,7,'Xiaomi Mi 11','Прошивка','Ready','2026-05-04',1200.000000000000000000000000000000,1,'2026-05-11 21:00:22.147141',400.000000000000000000000000000000,200.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (17,26,7,'iPad Pro','Замена АКБ','Ready','2026-05-06',1500.000000000000000000000000000000,1,'2026-05-11 21:02:54.511869',1200.000000000000000000000000000000,1500.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (18,4,2,'MacBook Air','Чистка от пыли','Ready','2026-05-08',1000.000000000000000000000000000000,1,'2026-05-11 21:03:44.772168',400.000000000000000000000000000000,200.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (19,5,7,'Nintendo Switch','Ремонт джойстиков','Ready','2026-05-09',1000.000000000000000000000000000000,1,'2026-05-11 21:04:29.273760',400.000000000000000000000000000000,200.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (20,26,2,'PlayStation 5','Замена термопасты','Ready','2026-05-10',3500.000000000000000000000000000000,1,'2026-05-10 15:00:00.000000',800.000000000000000000000000000000,300.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (21,26,7,'Утюг Polaris PIR 2820AK','Срочность: Стандартная. Проблема: Сгорел','Ready','2026-05-10',1000.000000000000000000000000000000,0,'2026-05-11 18:35:34.264248',NULL,0.000000000000000000000000000000,0.000000000000000000000000000000);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (22,34,7,'Ноутбук HUAWEI MateBook D 16 2024 MCLF-X','Срочность: Стандартная. Проблема: Тормозит компьютер','Ready','2026-05-11',1000.000000000000000000000000000000,0,'2026-05-11 14:52:59.191178',NULL,0.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (23,36,7,'Посудомоечная машина DEXP M6C7PD','Срочность: Стандартная. Проблема: Не работает','Ready','2026-05-11',1803.000000000000000000000000000000,0,'2026-05-15 03:20:39.743704',NULL,803.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (24,35,7,'Стиральная машина LG F1296NDS1','Срочность: Стандартная. Проблема: Не крутится барабан','Ready','2026-05-11',243.000000000000000000000000000000,0,'2026-05-15 01:09:02.518129',NULL,803.000000000000000000000000000000,NULL);
INSERT INTO `repairrequests` (`Id`, `ClientId`, `TechnicianId`, `Device`, `IssueDescription`, `Status`, `CreatedAt`, `Price`, `IsPaid`, `CompletedAt`, `MasterBonus`, `PartsCost`, `BonusesSubtracted`) VALUES (25,26,3,'Микроволновка DEXP  MB-70','Срочность: Стандартная. Проблема: Не включается','Ready','2026-05-14',1243.000000000000000000000000000000,1,'2026-05-15 03:46:29.304697',NULL,NULL,NULL);
/*!40000 ALTER TABLE `repairrequests` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_repairrequests_update` AFTER UPDATE ON `repairrequests` FOR EACH ROW BEGIN
     DECLARE total_spent_val DECIMAL(65,30);
     DECLARE cashback_val DECIMAL(65,30);
     DECLARE new_discount INT DEFAULT 0;
     DECLARE new_tier INT DEFAULT 0;
 
     -- Триггер срабатывает строго при переходе статуса в 'Ready'
     IF NEW.Status = 'Ready' AND (OLD.Status IS NULL OR OLD.Status != 'Ready') THEN
         
         -- 1. Считаем сумму всех выполненных ремонтов клиента (для уровня лояльности)
         SELECT COALESCE(SUM(Price), 0)
         INTO total_spent_val
         FROM repairrequests
         WHERE ClientId = NEW.ClientId AND Status = 'Ready';
 
         -- 2. Считаем сумму кэшбека (5% от стоимости ТЕКУЩЕГО ремонта)
         SET cashback_val = COALESCE(NEW.Price, 0) * 0.05;
 
         -- 3. Определяем новый уровень лояльности и процент скидки на основе TotalSpent
         IF total_spent_val >= 50000 THEN
             SET new_tier = 2;       -- Gold
             SET new_discount = 15;  -- 15%
         ELSEIF total_spent_val >= 10000 THEN
             SET new_tier = 1;       -- Silver
             SET new_discount = 10;  -- 10%
         ELSE
             SET new_tier = 0;       -- Bronze
             SET new_discount = 0;   -- 0%
         END IF;

         -- 4. Обновляем данные клиента в таблице users
         UPDATE users 
         SET 
             TotalSpent = total_spent_val,
             LoyaltyTier = new_tier,
             PersonalDiscount = new_discount,
             BonusPoints = BonusPoints + cashback_val - COALESCE(NEW.BonusesSubtracted, 0)
         WHERE Id = NEW.ClientId;
         
     END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `repairservices`
--

DROP TABLE IF EXISTS `repairservices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repairservices` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RepairRequestId` int NOT NULL,
  `ServiceId` int NOT NULL,
  `PriceAtTheTime` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_RepairServices_RepairRequestId` (`RepairRequestId`),
  KEY `IX_RepairServices_ServiceId` (`ServiceId`),
  CONSTRAINT `FK_RepairServices_RepairRequests_RepairRequestId` FOREIGN KEY (`RepairRequestId`) REFERENCES `repairrequests` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_RepairServices_Services_ServiceId` FOREIGN KEY (`ServiceId`) REFERENCES `services` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repairservices`
--

LOCK TABLES `repairservices` WRITE;
/*!40000 ALTER TABLE `repairservices` DISABLE KEYS */;
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (28,20,1,3500.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (29,21,1,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (30,22,1,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (39,2,2,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (53,1,3,4000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (54,11,2,13500.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (55,14,2,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (56,15,15,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (57,16,5,1200.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (58,17,3,1500.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (59,18,4,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (60,19,16,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (63,3,2,5000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (71,5,3,2500.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (72,23,1,1000.00);
INSERT INTO `repairservices` (`Id`, `RepairRequestId`, `ServiceId`, `PriceAtTheTime`) VALUES (75,25,17,1000.00);
/*!40000 ALTER TABLE `repairservices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Rating` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `IsApproved` tinyint(1) NOT NULL,
  `ParentId` int DEFAULT NULL,
  `RepairRequestId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Reviews_UserId` (`UserId`),
  KEY `IX_Reviews_ParentId` (`ParentId`),
  KEY `IX_Reviews_RepairRequestId` (`RepairRequestId`),
  CONSTRAINT `FK_Reviews_RepairRequests_RepairRequestId` FOREIGN KEY (`RepairRequestId`) REFERENCES `repairrequests` (`Id`),
  CONSTRAINT `FK_Reviews_Reviews_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `reviews` (`Id`),
  CONSTRAINT `FK_Reviews_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (28,35,'Обратился в сервис по поводу ремонта стиральной машины. При начале цикла начинало вонять нижним бельем на всю квартиру. Мастер приехал, в кратчайшие сроки провел диагностику и предоставил смету. Теперь моя квартира не воняет. Приношу огромные благодарности сервису за оперативный ремонт и профессионализм',5,'2026-05-09 13:58:08.837826',1,NULL,24);
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (37,34,'Раньше у меня стояла винда и комп работал стабильно. Потом же Мастера вашего сервиса после штатного обслуживание ноута накатили туда \'стабильную убунту\'. Она упала, зачистила диск и меня числанули по курсачу без разговоров. Сердечное спасибо вам, наконец траву потрогаю🙏🙏🤗',5,'2026-05-11 11:53:31.234675',1,NULL,22);
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (38,36,'Сразу можно сказать, ремонт хороший, скорее отличный. Сижу и думаю, какое впечатление оставил мастер.... но точно, зацепил. А это уже что-то значит. Этот ремонт моей посудомоечной машины оставляет послевкусие. Совершенно не жалко денег. Рекомендую!',5,'2026-05-11 11:59:13.734436',1,NULL,23);
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (43,8,'Большое спасибо, что нашли время поделиться впечатлениями! Будем рады видеть вас снова',0,'2026-05-11 12:13:49.318409',1,38,23);
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (44,8,'Большое спасибо, что нашли время поделиться впечатлениями! Будем рады видеть вас снова',0,'2026-05-11 12:14:05.985108',1,37,22);
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (46,8,'Большое спасибо, что нашли время поделиться впечатлениями! Будем рады видеть вас снова',0,'2026-05-11 12:14:15.969512',1,28,24);
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (48,26,'У меня сгорел утюг. Починили. Оч круто',5,'2026-05-09 13:58:08.837826',1,NULL,21);
INSERT INTO `reviews` (`Id`, `UserId`, `Body`, `Rating`, `CreatedAt`, `IsApproved`, `ParentId`, `RepairRequestId`) VALUES (49,8,'Большое спасибо, что нашли время поделиться впечатлениями! Будем рады видеть вас снова',0,'2026-05-11 12:23:37.640329',1,48,21);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Price` decimal(65,30) NOT NULL,
  `ImageUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (1,'Диагностика устройства','Полная проверка всех компонентов устройства на наличие неисправностей.',1000.000000000000000000000000000000,'/services/diagnose.jpg');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (2,'Замена экрана','Установка нового дисплейного модуля.',5000.000000000000000000000000000000,'/services/display.webp');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (3,'Замена аккумулятора','Установка новой батареи.',2500.000000000000000000000000000000,'/services/akk.jpg');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (4,'Чистка от пыли и влаги','Профессиональная чистка внутренних компонентов.',1500.000000000000000000000000000000,'/services/clean.jpg');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (5,'Обновление ПО','Установка последней версии операционной системы и программ.',1200.000000000000000000000000000000,'/services/update.jpg');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (14,'Замена фильтра в стиральной машине',NULL,1000.000000000000000000000000000000,'https://s1.hostingkartinok.com/uploads/images/2023/07/c8623d85e63b0f75786062eacd41df75.jpeg');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (15,'Замена разъёма','',1000.000000000000000000000000000000,'https://grokholsky.com/uploads/repair/zamina-roz-mu-zaryadki-29.jpg');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (16,'Ремонт геймпадов',NULL,1000.000000000000000000000000000000,'https://servicesirius.ru/d/remkomplekt_dlya_dzhojstika_ps5.jpg');
INSERT INTO `services` (`Id`, `Name`, `Description`, `Price`, `ImageUrl`) VALUES (17,'Ремонт микроволновки',NULL,1000.000000000000000000000000000000,'https://www.snta.ru/upload/iblock/4c2/4c2738e6566ac6d1a7cfcd35585a5c40.jpg');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spareparts`
--

DROP TABLE IF EXISTS `spareparts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spareparts` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `StockQuantity` int NOT NULL,
  `PurchasePrice` decimal(65,30) NOT NULL,
  `TypeId` int DEFAULT NULL,
  `MinimumThreshold` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `IX_SpareParts_TypeId` (`TypeId`),
  CONSTRAINT `FK_SpareParts_SparePartType_TypeId` FOREIGN KEY (`TypeId`) REFERENCES `spareparttype` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spareparts`
--

LOCK TABLES `spareparts` WRITE;
/*!40000 ALTER TABLE `spareparts` DISABLE KEYS */;
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (1,'Дисплей iPhone 13 Pro (Original)',16,12500.000000000000000000000000000000,1,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (2,'Аккумулятор Samsung S22 Ultra',1,2100.000000000000000000000000000000,2,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (3,'Термопаста Arctic MX-4 (4г)',50,850.000000000000000000000000000000,3,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (4,'Аккумуляторная батарея (АКБ) BL-5C 1020mAh для для Nokia',0,261.000000000000000000000000000000,2,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (5,'Аккумулятор Samsung',2,5.000000000000000000000000000000,2,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (6,'Защитное стекло Iphone',1,100.000000000000000000000000000000,4,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (7,'Терморегулятор для утюга Polaris PIR 2820AK',1,255.000000000000000000000000000000,5,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (8,'Фильтр тонкой очистки для ПММ ARISTON INDESIT 256571 C00256571 - 256571_UN',0,803.000000000000000000000000000000,6,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (9,'Разъём Samsung S21',1,500.000000000000000000000000000000,7,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (10,'Аккумулятор iPad Pro',1,1000.000000000000000000000000000000,2,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (11,'Экран Apple Watch Series 7',1,1000.000000000000000000000000000000,1,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (15,'Конденсатор высоковольтный для микроволновой печи',1,243.000000000000000000000000000000,19,0);
INSERT INTO `spareparts` (`Id`, `Name`, `StockQuantity`, `PurchasePrice`, `TypeId`, `MinimumThreshold`) VALUES (16,'Аккумулятор Poco',2,1000.000000000000000000000000000000,2,0);
/*!40000 ALTER TABLE `spareparts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spareparttype`
--

DROP TABLE IF EXISTS `spareparttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spareparttype` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name_UNIQUE` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spareparttype`
--

LOCK TABLES `spareparttype` WRITE;
/*!40000 ALTER TABLE `spareparttype` DISABLE KEYS */;
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (2,'Аккумулятор');
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (1,'Дисплей');
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (4,'Защитное стекло');
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (19,'Конденсатор');
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (7,'Разъём');
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (3,'Термопаста');
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (5,'Терморегулятор');
INSERT INTO `spareparttype` (`Id`, `Name`) VALUES (6,'Фильтр для посудомоечной машины');
/*!40000 ALTER TABLE `spareparttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stockmovements`
--

DROP TABLE IF EXISTS `stockmovements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stockmovements` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SparePartId` int NOT NULL,
  `Quantity` int NOT NULL,
  `Type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Date` datetime(6) NOT NULL,
  `Comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RemainingStock` int NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_StockMovements_SpareParts_SparePartId` (`SparePartId`),
  KEY `IX_StockMovements_UserId` (`UserId`),
  CONSTRAINT `FK_StockMovements_SpareParts_SparePartId` FOREIGN KEY (`SparePartId`) REFERENCES `spareparts` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_StockMovements_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stockmovements`
--

LOCK TABLES `stockmovements` WRITE;
/*!40000 ALTER TABLE `stockmovements` DISABLE KEYS */;
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (1,1,10,'Приход','2026-05-14 10:00:00.000000','Поставка от поставщика',10,2);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (2,3,-2,'Расход','2026-05-14 11:30:00.000000','Ремонт заказа №105',48,3);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (3,10,5,'Приход','2026-05-14 14:15:00.000000','Закупка',6,7);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (4,6,-1,'Расход','2026-05-14 16:45:00.000000','Продажа клиенту',0,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (5,15,1,'Приход','2026-05-14 21:08:12.712960','Закупка новой запчасти',1,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (6,15,1,'Приход','2026-05-14 22:23:00.079050','Корректировка при сохранении заявки №6',2,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (7,15,-1,'Расход','2026-05-14 22:23:00.081895','Использовано в заявке №6',1,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (8,15,-1,'Расход','2026-05-14 22:43:40.502457','Списание по заказу №5',0,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (9,15,1,'Приход','2026-05-14 22:51:46.635057','Возврат из заявки №5',1,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (10,15,-1,'Расход','2026-05-14 22:51:59.983350','Списание по заказу №5',0,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (11,15,1,'Приход','2026-05-14 22:52:20.475768','Возврат из заявки №5',1,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (12,15,10,'Приход','2026-05-14 10:00:00.000000','Поступление: Конденсаторы высокольтные (Партия #1)',10,2);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (13,1,5,'Приход','2026-05-14 10:05:00.000000','Поступление: Дисплеи iPhone 13 Pro',5,2);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (14,15,-1,'Расход','2026-05-14 11:20:00.000000','Установка в заказ №96 (Диагностика)',9,3);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (15,10,-1,'Расход','2026-05-14 14:15:00.000000','Установка в заказ №5 (В работе)',0,7);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (16,15,-1,'Расход','2026-05-15 09:00:00.000000','Установка в заказ №25 (В работе)',8,3);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (17,15,1,'Приход','2026-05-15 09:45:00.000000','Возврат из заказа №25: Замена на аналог',9,3);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (18,15,-1,'Расход','2026-05-15 10:00:00.000000','Установка в заказ №25 (Готов)',8,3);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (19,2,-1,'Расход','2026-05-15 11:30:00.000000','Установка в заказ №38 (Выдано)',0,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (20,16,1,'Приход','2026-05-14 23:06:52.298478','Закупка новой запчасти',1,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (21,16,-1,'Расход','2026-05-14 23:06:59.642588','Списание по заказу №5',0,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (22,8,0,'Приход','2026-05-15 00:19:02.090371','Возврат: удалена из заявки №23',0,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (23,8,1,'Приход','2026-05-15 00:19:52.457249','Ручное изменение количества',1,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (24,8,-1,'Расход','2026-05-15 00:20:39.742649','Списание по заказу №23',0,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (25,15,9,'Приход','2026-05-15 00:21:47.762017','Ручное изменение количества',10,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (26,15,-9,'Расход','2026-05-15 00:21:50.759576','Ручное изменение количества',1,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (27,2,1,'Приход','2026-05-15 00:29:15.030911','Ручное изменение количества',1,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (28,2,-1,'Расход','2026-05-15 00:29:30.840708','Ручное изменение количества',0,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (29,2,1,'Приход','2026-05-15 00:32:06.961459','Ручное изменение количества',1,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (30,16,2,'Приход','2026-05-15 00:32:56.471092','Ручное изменение количества',2,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (31,3,-48,'Расход','2026-05-15 00:33:13.404276','Ручное изменение количества',2,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (32,3,48,'Приход','2026-05-15 00:33:23.133013','Ручное изменение количества',50,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (33,1,-14,'Расход','2026-05-15 00:38:52.917076','Ручное изменение количества',2,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (34,1,14,'Приход','2026-05-15 00:39:12.618345','Ручное изменение количества',16,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (35,15,1,'Приход','2026-05-15 00:39:54.818731','Возврат: удалена из заявки №25',2,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (36,15,-1,'Расход','2026-05-15 00:40:23.296761','Списание по заказу №25',1,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (37,15,1,'Приход','2026-05-15 00:42:12.864859','Возврат: удалена из заявки №25',2,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (38,15,-1,'Расход','2026-05-15 00:42:59.014207','Списание по заказу №25',1,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (39,15,1,'Приход','2026-05-15 00:46:04.814563','Возврат: удалена из заявки №25',2,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (40,15,-1,'Расход','2026-05-15 00:46:29.304582','Списание по заказу №25',1,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (41,1,-15,'Расход','2026-05-15 00:52:20.862891','Ручное изменение количества',1,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (42,1,15,'Приход','2026-05-15 00:52:30.604578','Ручное изменение количества',16,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (43,1,-13,'Расход','2026-05-15 15:40:06.811791','Ручное изменение количества',3,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (44,1,13,'Приход','2026-05-15 15:40:17.974551','Ручное изменение количества',16,8);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (45,5,-1,'Расход','2026-05-15 17:31:23.478000','Списание по заказу №28',1,NULL);
INSERT INTO `stockmovements` (`Id`, `SparePartId`, `Quantity`, `Type`, `Date`, `Comment`, `RemainingStock`, `UserId`) VALUES (46,5,1,'Приход','2026-05-15 17:32:07.085672','Возврат: удалена заявка №28',2,NULL);
/*!40000 ALTER TABLE `stockmovements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Role` int NOT NULL DEFAULT '0',
  `IsVerified` tinyint(1) NOT NULL,
  `Phone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Avatar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `TelegramChatId` bigint DEFAULT NULL,
  `PushAuth` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PushEndpoint` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PushP256DH` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `BonusPoints` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `ClientNotes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PersonalDiscount` int NOT NULL,
  `TotalSpent` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `LoyaltyTier` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (2,'Иван Петров','ivan@smartfix.com','$2a$11$/hXp/.HUkZu8U3ug9t9OQexEP/VRMtwvq9uWYr1X.6pNAS17AiGvS',1,1,'+7 (921) 555-44-33','/avatars/95cd78c2-2b88-451e-9070-56aade8d445c.jpg',NULL,NULL,NULL,NULL,0.000000000000000000000000000000,NULL,0,0.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (3,'Сергей Сидоров','sergey@smartfix.com','$2a$11$KefJfNJcUTtnmhbtZU5yoehPWHYR06AAu3xIideH1o/8zgASaLi5m',1,1,NULL,'/avatars/7d88f607-fa02-4402-b17d-07c1b0400c48.jpg',NULL,NULL,NULL,NULL,0.000000000000000000000000000000,NULL,0,0.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (4,'Анна Кузнецова','anna@client.com','$2a$11$RCc/SXoJ1igQmcOvN1tkLeK8bSJ8q92w.KMf0R88DCzcf2ORQUYNq',0,1,'+7 (911) 123-45-67','avatars/e07ad0c1-ae2a-4005-b376-67f6bfe318fe.jpg',NULL,NULL,NULL,NULL,1175.000000000000000000000000000000,NULL,5,23500.000000000000000000000000000000,1);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (5,'Пётр Иванов','petr@client.com','$2a$11$5wN9eFFwc3A8oHUTAgoBPid8QWIFagDycJAvItLMmQZ',0,1,NULL,'/avatars/12e55ffe-7c1b-4c76-a9ed-3b3255514372.jpg',NULL,NULL,NULL,NULL,800.000000000000000000000000000000,NULL,5,16000.000000000000000000000000000000,1);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (6,'Алексей Иванов','alex@example.com','$2a$11$fii2vHs2TaoDlfnwzAfoFucBEGy.lCJDDmXOv3UJVnFlelgIvku9y',0,0,'+7 (999) 123-45-67','/avatars/5fe33f9c-b53a-46be-8e17-4393100dc204.png',NULL,NULL,NULL,NULL,0.000000000000000000000000000000,NULL,0,0.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (7,'Виталий Каспер','vk@gmail.com','$2a$11$MROnKva9hlOxMLn/QqCEBeczCswnHER5DX3W3FqPfaNL3/Mky9EqK',1,0,NULL,'data:image/jpeg;base64,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',NULL,NULL,NULL,NULL,0.000000000000000000000000000000,NULL,0,0.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (8,'Админ','admin@gmail.com','$2a$11$vctBwWC.BJ0NfSmUtW8pMeKlFXWL8buqzYWbzOiQcOjAuLJlnaLeO',2,0,'+9333231123','/avatars/90b17a76-d4c7-4d52-9165-95a889bfcfe4.jpg',1486826580,'Qw8ENejMjpBb6MlgHLIK_w','https://fcm.googleapis.com/fcm/send/ft_IS-LQKX0:APA91bHVQaxyfUIyi6ZogjMu4nkhN2hj64VVxOLXw_vvkUNl_9JEuHNQJAXswcQ6HEnrne1tuB30scwiJgAms9kmIIiyuUyYj0b0NVt1CdHrA4QieJKo-RC1CuQk4yl54GGpu12ybsCn','BKGtJbwx5kVcIWRhYwO9yLcXn-Tg0VYr7ZwnWAXGNr0PZydpDJV8rq3lFI2Q5qUcVvkIPSqscmZ5BYGtloN5L-w',0.000000000000000000000000000000,NULL,0,0.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (9,'Роман Шишкин','rv@gmail.com','$2a$11$NuZARBICIQDL1ufHFU9fNOgxAd5lXbIArt5/zW64IenZQ/HKTlyI.',0,0,NULL,'/avatars/6971afd7-70d1-4dce-9954-fe1cab3f0926.webp',1486826580,NULL,NULL,NULL,197.150000000000000000000000000000,NULL,0,3943.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (26,'Клиент Клиентов','client@gmail.com','$2a$11$D1R7mdrZxD.0oELEwYQ4qu0pmLH9Z.7VuEgaw3NgLgozqDG8HGzam',0,0,'','/avatars/8082e0ee-aed7-49f0-b6fe-1b6087c5c2dc.jpg',1486826580,'XphLqXj-PtYgpV78q7InwQ','https://fcm.googleapis.com/fcm/send/dFC4PyCV63E:APA91bFKC9yzXi-vjDnsbmh51f56ghF4aFo_RnWv7vN9yH36h-bX19M9G9V36ZNbUdfljEQz02BzL9ME55lmFBsfaVPjFx362ft5pIvsz7yHW0LFlaGcBeHuYXfpeh4XOkkU8O1OFxLc','BPbo1XYr8XE4HvKcrTsrtHSlae2uAvDe7BQkRjzKtYpEtYZ6FsDkc67SJ4beLm-WsG9fUzT2gfyQRY0nXCRTbNs',899.000000000000000000000000000000,NULL,5,20743.000000000000000000000000000000,1);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (27,'Анатолий Уфимов','test@gmail.com','$2a$11$6vMuP9gmvQFDRnWeEFl6Wu8llZ8QxAB9BqzU3/IfBGUa7q7iKNpYe',0,0,NULL,'/avatars/1761903a-f827-4da4-9662-852ca98e2e3b.jpg',NULL,NULL,NULL,NULL,0.000000000000000000000000000000,NULL,0,0.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (34,'Георгий Пименов','HouKyuo_XRP@gmail.com','$2a$11$9SohfeYl28.FPYwBv.YRP.98zMQk89SENU2T4Rl8wqod2bh1aRzjm',0,0,NULL,'/avatars/22d2a360-670c-4dfd-83ef-1ca7974616be.jpg',NULL,NULL,NULL,NULL,50.000000000000000000000000000000,NULL,0,1000.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (35,'direktor interneta','zemlyak_l@gmail.com','$2a$11$g8KsM8AkfbYixJo8VyuN2.bk6HMlEWbVBMyN9OG/RxLimlg1HUva6',0,0,NULL,'/avatars/3acc11d9-b72a-40ad-9516-dec112c589a5.jpg',NULL,NULL,NULL,NULL,12.150000000000000000000000000000,NULL,0,243.000000000000000000000000000000,0);
INSERT INTO `users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `Phone`, `Avatar`, `TelegramChatId`, `PushAuth`, `PushEndpoint`, `PushP256DH`, `BonusPoints`, `ClientNotes`, `PersonalDiscount`, `TotalSpent`, `LoyaltyTier`) VALUES (36,'Myarphanna','myr87ph@gmail.com','$2a$11$xbJBSTbBxSTASpP64XhcDu1Ky.yt5jcOrlte3zGM6vpraxUEXYg.2',0,0,NULL,'/avatars/4c8adf4f-aadf-408e-92bf-a39647baaf13.jpg',NULL,NULL,NULL,NULL,90.150000000000000000000000000000,NULL,0,1803.000000000000000000000000000000,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wikiarticles`
--

DROP TABLE IF EXISTS `wikiarticles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wikiarticles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `AuthorId` int NOT NULL,
  `CategoryId` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `IX_WikiArticles_AuthorId` (`AuthorId`),
  KEY `IX_WikiArticles_CategoryId` (`CategoryId`),
  CONSTRAINT `FK_WikiArticles_Users_AuthorId` FOREIGN KEY (`AuthorId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wikiarticles`
--

LOCK TABLES `wikiarticles` WRITE;
/*!40000 ALTER TABLE `wikiarticles` DISABLE KEYS */;
INSERT INTO `wikiarticles` (`Id`, `Title`, `Body`, `CreatedAt`, `AuthorId`, `CategoryId`) VALUES (1,'Типичные неисправности iPhone 13','<img src=\"https://lifehacker.ru/wp-content/uploads/2021/09/maxresdefault_1632748920.jpg\" width=\"800\" height=\"800\">\nНесмотря на высокую надежность, iPhone 13 спустя годы активной эксплуатации обзавелся списком \"характерных\" проблем. Некоторые из них вызваны естественным износом, другие — особенностями конструкции или программными сбоями.\n\n# 1. Проблемы с дисплеем\n\nЭкран — самая уязвимая часть любого современного смартфона. Для iPhone 13 характерны следующие неисправности:\n\n*   **Белый или зеленый экран (\"White/Green Screen of Death\"):** Встречается реже, чем у 13 Pro, но зафиксированы случаи, когда после обновления iOS или легкого удара дисплей полностью заливается однотонным цветом. Обычно это связано с повреждением шлейфа или дефектом самой OLED-матрицы.\n*   **Снижение яркости из-за перегрева:** При интенсивной нагрузке или зарядке система автоматически снижает яркость. Это защитный механизм, но со временем он может срабатывать слишком часто из-за деградации термопасты на процессоре.\n\n# 2. Аккумулятор и питание\n\nК 2026 году большинство iPhone 13 столкнулись с естественным износом батареи.\n\n*   **Быстрая разрядка:** Если емкость (Battery Health) упала ниже **80%**, производительность процессора может искусственно ограничиваться.\n*   **Проблемы с портом Lightning:** Грязь, ворс из карманов или использование некачественных кабелей приводят к тому, что зарядка идет только под определенным углом или пропадает вовсе.\n*   **Выход из строя контроллера питания:** Чаще всего случается из-за использования дешевых автомобильных зарядок. Смартфон перестает включаться или \"висит\" на яблоке.\n\n# 3. Камеры и Face ID\n\nМодули камер в iPhone 13 выступают из корпуса, что делает их мишенью для механических повреждений.\n\n*   **Дребезжание стабилизации (OIS):** При падении или сильной вибрации (например, на руле мотоцикла) стабилизатор может выйти из строя. Камера начинает шуметь, а изображение — \"плавать\".\n*   **Отказ Face ID:** Датчики системы TrueDepth крайне чувствительны к влаге. Даже если телефон сохранил герметичность, конденсат внутри может вывести из строя ИК-проектор.\n\n# 4. Проблемы со связью\n\niPhone 13 поддерживает 5G, но в наших реалиях пользователи чаще сталкиваются с другими проблемами:\n\n*   **Потеря сети Wi-Fi/Bluetooth:** Часто вызвано повреждением антенного модуля или отвалом микросхемы Wi-Fi после сильного падения.\n*   **Плохая слышимость при разговоре:** Верхний динамик часто забивается пылью и кожным жиром. Проблема решается профессиональной чисткой сетки, но иногда требуется замена самого динамика.\n\n## Таблица: Сложность и стоимость ремонта (ориентировочно)\n\n| Неисправность | Сложность | Требуется ли замена запчасти? |\n| :--- | :--- | :--- |\n| Замена аккумулятора | Низкая | Да |\n| Замена стекла экрана | Высокая | Да |\n| Чистка динамиков | Низкая | Нет |\n| Ремонт Face ID | Очень высокая | Часто неремонтопригодно |\n| Замена порта зарядки | Средняя | Да |\n\n> **Важное примечание:** iPhone 13 имеет высокую степень программной привязки деталей (сериализация). При замене экрана или аккумулятора в неавторизованном сервисе вы можете потерять функцию True Tone или получить сообщение о \"неизвестной детали\", даже если запчасть оригинальная.\n\n## Как продлить жизнь устройству?\n- 1 Используйте только сертифицированные кабели **MFi**.\n- 2 Не допускайте полного разряда батареи до 0%.\n- 3 Регулярно делайте резервные копии в iCloud.\n- 4 Избегайте использования смартфона в качестве навигатора под прямыми солнечными лучами.','2026-05-14 18:26:48.000000',2,1);
INSERT INTO `wikiarticles` (`Id`, `Title`, `Body`, `CreatedAt`, `AuthorId`, `CategoryId`) VALUES (2,'Инструкция по работе с паяльной станцией','Текст инструкции...','2026-05-14 18:26:48.000000',3,0);
INSERT INTO `wikiarticles` (`Id`, `Title`, `Body`, `CreatedAt`, `AuthorId`, `CategoryId`) VALUES (3,'Настройка ПО для программатора','Текст статьи про софт...','2026-05-14 18:26:48.000000',7,0);
INSERT INTO `wikiarticles` (`Id`, `Title`, `Body`, `CreatedAt`, `AuthorId`, `CategoryId`) VALUES (4,'Правила приема техники на ремонт','Ниже представлены основные регламенты и этапы процесса приема клиентских устройств на ремонт. Соблюдение этих правил минимизирует риски возникновения спорных ситуаций и повреждения оборудования.\n\n<img src=\"https://sobitie.com.ua/wp-content/uploads/2021/01/shirokiy_vybor_elektronnoy_tehniki_dlya_doma_i_ofisa.jpg\" width=\"600\">\n\n## 1. Первичный осмотр и фиксация состояния\nПеред оформлением документов необходимо провести детальный осмотр устройства в присутствии клиента.\n\n*   **Внешние повреждения:** Фиксируются царапины, сколы, трещины, следы падений или вскрытия.\n*   **Следы жидкостей:** Проверка индикаторов влаги и разъемов на наличие окисления.\n*   **Комплектация:** Укажите наличие зарядного устройства, коробки, SIM-карт или карт памяти.\n\n## 2. Программная и аппаратная диагностика\nНа этом этапе проверяется работоспособность основных узлов, если устройство включается.\n\n| Проверяемый узел | Действие |\n| :--- | :--- |\n| **Дисплей** | Проверка на наличие битых пикселей, пятен и работу тачскрина. |\n| **Аккумулятор** | Оценка циклов заряда и вздутия корпуса. |\n| **Звук** | Проверка динамиков и микрофона через системные утилиты. |\n| **Связь** | Тестирование Wi-Fi, Bluetooth и сотового модуля. |\n\n## 3. Юридическое оформление (Приемная квитанция)\nКаждое устройство должно сопровождаться документом, который содержит:\n1. **Данные об устройстве:** Модель, серийный номер (S/N) или IMEI.\n2. **Описание неисправности:** Со слов клиента (например, \"не включается\", \"залит\").\n3. **Ориентировочная стоимость:** Если предварительная оценка возможна сразу.\n4. **Согласие с условиями:** Клиент должен расписаться в том, что ознакомлен с рисками (например, возможная потеря данных при прошивке).\n\n## 4. Маркировка и хранение\nПосле приема техника должна быть правильно идентифицирована для исключения путаницы на складе.\n\n*   **Бирка:** На корпус клеится стикер с номером заказа.\n*   **Упаковка:** Использование антистатических пакетов или индивидуальных ячеек.\n\n## 5. Общие правила безопасности\n*   **Разборка:** Производится только с использованием специализированного инструмента (диэлектрические лопатки, присоски).\n*   **Электростатика:** Работа должна выполняться на антистатическом коврике с использованием браслета.\n\n> **Важно:** При приеме устройств с заблокированными аккаунтами (iCloud, Google) необходимо предупредить клиента о необходимости их удаления для полноценного тестирования после ремонта.','2026-05-14 18:26:48.000000',8,2);
INSERT INTO `wikiarticles` (`Id`, `Title`, `Body`, `CreatedAt`, `AuthorId`, `CategoryId`) VALUES (11,'Установка Windows 10','![Windows 10](https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/sds-windows10-laptop-fy24?scl=1)\n','2026-05-14 18:02:24.556535',8,3);
INSERT INTO `wikiarticles` (`Id`, `Title`, `Body`, `CreatedAt`, `AuthorId`, `CategoryId`) VALUES (12,'Как чинить телефон','Ремонт современного смартфона — это не только экономия средств, но и увлекательный процесс, требующий аккуратности, терпения и правильного инструментария. Если вы решили попробовать свои силы в восстановлении гаджета, эта инструкция поможет вам пройти путь от диагностики до финальной сборки.\n\n![](https://poznyaev.ru/wp-content/uploads/2023/12/vidy-telefonov.webp)\n\n## 1. Подготовка рабочего места и инструментов\n\nПрежде чем откручивать первый винт, необходимо организовать пространство. Статическое электричество и потерянные детали — главные враги мастера.\n\n**Минимальный набор инструментов:**\n\n* **Набор прецизионных отверток:** (Pentalobe для iPhone, Phillips и Torx для большинства Android-устройств).\n* **Диэлектрические лопатки (спуджеры):** Для безопасного отсоединения шлейфов.\n* **Присоска и пластиковые медиаторы:** Для вскрытия корпуса.\n* **Пинцет с тонкими концами.**\n* **Термофен или специальный мешочек с гелем:** Для размягчения клея.\n* **Магнитный коврик:** Чтобы не перепутать винты (они разной длины, и вкручивание длинного винта в короткое отверстие может убить материнскую плату).\n\n\n## 2. Диагностика: в чем проблема?\n\nПрежде чем заказывать запчасти, убедитесь, что вы правильно определили «виновника»:\n\n* **Разбитый экран:** Если изображение есть и сенсор работает — повреждено стекло. Если пятна или полосы — нужна замена всей дисплейной сборки.\n* **Быстрая разрядка:** Если телефону больше 2 лет, скорее всего, изношен аккумулятор.\n* **Не заряжается:** Проверьте разъем на наличие пыли. Часто обычная чистка зубочисткой заменяет ремонт.\n\n## 3. Процесс вскрытия\n\nБольшинство современных телефонов (включая модели Infinix или Samsung) держатся на клею.\n\n1. **Прогрев:** Равномерно прогрейте периметр задней крышки (или экрана) феном до **70–80°C**. Она должна быть горячей на ощупь, но не обжигать.\n2. **Создание щели:** Закрепите присоску и аккуратно потяните, вставляя медиатор в образовавшуюся щель.\n3. **Подрезка клея:** Медленно ведите медиатором по периметру. **Важно:** не погружайте медиатор глубоко, чтобы не порвать шлейфы (сканер отпечатков, кнопки громкости).\n\n## 4. Золотое правило: Отключите питание\n\nКак только вы получили доступ к внутренностям, **первым делом отсоедините шлейф аккумулятора**. Работа под напряжением может привести к короткому замыканию и выходу из строя контроллера питания или процессора.\n\n## 5. Замена компонентов\n\n* **Дисплей:** Обычно требует переброски мелких деталей (динамика, датчиков) со старого модуля на новый.\n* **Аккумулятор:** Приклеен на двусторонний скотч. Не используйте металлические предметы для его поддевания — прокол литиевого аккумулятора может привести к возгоранию. Используйте пластиковую лопатку и немного изопропилового спирта для размягчения клея.\n* **Камеры и динамики:** Обычно крепятся на защелках или паре винтов и легко заменяются.\n\n## 6. Сборка и проверка\n\nПеред финальной проклейкой корпуса:\n\n1. Временно подключите новый экран/аккумулятор.\n2. Включите телефон и проверьте все функции: сенсор, яркость, звук, зарядку, камеры.\n3. Если всё работает, удалите остатки старого клея, нанесите новый (например, B-7000) или используйте специальные проклейки.\n4. Зажмите корпус прищепками на 2–3 часа для надежной фиксации.\n\n## Меры предосторожности\n\n> **Внимание:** Самостоятельный ремонт лишает вас заводской гарантии. Если вы не уверены в своих силах, лучше доверить устройство профессионалам. Особенно это касается сложных работ, связанных с пайкой на материнской плате или заменой отдельных микросхем.\n\nПомните: аккуратность важнее скорости. Удачи в ремонте!','2026-05-14 18:10:16.568436',8,1);
/*!40000 ALTER TABLE `wikiarticles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wikicategories`
--

DROP TABLE IF EXISTS `wikicategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wikicategories` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Slug` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wikicategories`
--

LOCK TABLES `wikicategories` WRITE;
/*!40000 ALTER TABLE `wikicategories` DISABLE KEYS */;
INSERT INTO `wikicategories` (`Id`, `Name`, `Slug`, `Description`) VALUES (1,'Телефоны','smartphones','Ремонт телефонов');
INSERT INTO `wikicategories` (`Id`, `Name`, `Slug`, `Description`) VALUES (2,'Регламент','rules','Правила компании');
INSERT INTO `wikicategories` (`Id`, `Name`, `Slug`, `Description`) VALUES (3,'Компьютеры','компьютеры','');
/*!40000 ALTER TABLE `wikicategories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-17 17:34:34
