CREATE DATABASE  IF NOT EXISTS `seeds` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `seeds`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: seeds
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `role_page_permission`
--

DROP TABLE IF EXISTS `role_page_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_page_permission` (
  `id` varchar(36) NOT NULL,
  `idRole` varchar(36) DEFAULT NULL,
  `idPage` varchar(36) DEFAULT NULL,
  `idPermission` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idPermission` (`idPermission`),
  CONSTRAINT `role_page_permission_ibfk_1` FOREIGN KEY (`idPermission`) REFERENCES `permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_page_permission`
--

LOCK TABLES `role_page_permission` WRITE;
/*!40000 ALTER TABLE `role_page_permission` DISABLE KEYS */;
INSERT INTO `role_page_permission` VALUES ('11446294-2a0e-4d3c-a773-c766cf531e8d','d3933888-f81e-48fc-9d34-407cf79a4174','68b0d4b3-d00d-4fec-9f04-ed0e64e6d4bf','cb075ff7-60f6-11f0-bb46-005056c00001'),('756fb840-1a49-46a3-90bc-5aa1f91a0621','d3933888-f81e-48fc-9d34-407cf79a4174','a70705cf-7e86-469a-a586-9e833edfef27','cb075ff7-60f6-11f0-bb46-005056c00001'),('785bada3-53fa-4cd7-9e38-3d8a55743605','d3933888-f81e-48fc-9d34-407cf79a4174','68b0d4b3-d00d-4fec-9f04-ed0e64e6d4bf','c32093af-60f6-11f0-bb46-005056c00001'),('925b58fd-47b3-4c5c-9b2f-05e65ea57547','d3933888-f81e-48fc-9d34-407cf79a4174','a70705cf-7e86-469a-a586-9e833edfef27','d2f825c6-60f6-11f0-bb46-005056c00001'),('aa6a2354-01ae-4ce1-a1b7-000e62f9c4ff','d3933888-f81e-48fc-9d34-407cf79a4174','68b0d4b3-d00d-4fec-9f04-ed0e64e6d4bf','04c9c06a-60f7-11f0-bb46-005056c00001'),('b61ae51b-4926-4e90-9801-aebd18692522','d3933888-f81e-48fc-9d34-407cf79a4174','a70705cf-7e86-469a-a586-9e833edfef27','04c9c06a-60f7-11f0-bb46-005056c00001'),('c3efc73e-5369-485b-a7ce-01452a7faaa9','d3933888-f81e-48fc-9d34-407cf79a4174','a70705cf-7e86-469a-a586-9e833edfef27','c32093af-60f6-11f0-bb46-005056c00001'),('d233b5a7-53e2-4efa-8598-15c55c0405ad','d3933888-f81e-48fc-9d34-407cf79a4174','68b0d4b3-d00d-4fec-9f04-ed0e64e6d4bf','d2f825c6-60f6-11f0-bb46-005056c00001');
/*!40000 ALTER TABLE `role_page_permission` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-15 17:21:10
