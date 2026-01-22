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
-- Table structure for table `page`
--

DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page` (
  `id` varchar(36) NOT NULL,
  `idModule` varchar(36) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idModule` (`idModule`),
  CONSTRAINT `page_ibfk_1` FOREIGN KEY (`idModule`) REFERENCES `module` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page`
--

LOCK TABLES `page` WRITE;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` VALUES ('2ff1688d-c23b-44e5-a5f1-aeab0a162556','cadfa8bf-cb09-4605-a215-6e2d3eb35647','inventory','Inventario','/tool-loans/inventory','Inventario de Herramientas'),('37482415-ab5b-4006-810e-9654f30c544b','cadfa8bf-cb09-4605-a215-6e2d3eb35647','users','Usuarios','/tool-loans/users','Gestión de Usuarios'),('54a249ca-d06d-4e3a-a173-1d2892a82ec6','cadfa8bf-cb09-4605-a215-6e2d3eb35647','loans','Préstamos','/tool-loans/loans','Gestión de Préstamos'),('5b9a376e-b73c-4e83-907c-0777a4b52079','cadfa8bf-cb09-4605-a215-6e2d3eb35647','availability','Disponibilidad','/tool-loans/availability','Disponibilidad de Herramientas'),('6220c88c-be5d-4560-8b7e-fb185edd4b5f','0d8f1b5b-563b-4be4-afa1-e8fa0132a481','permissions','Permisos','/settings/permissions','Gestión de permisos'),('68b0d4b3-d00d-4fec-9f04-ed0e64e6d4bf','cadfa8bf-cb09-4605-a215-6e2d3eb35647','home','Inicio','/tool-loans/home','Dashboard'),('961f4803-7165-4239-9d48-76e9a42dbdde','0d8f1b5b-563b-4be4-afa1-e8fa0132a481','users','Usuarios','settings/user-management','Gestión de Usuarios'),('a70705cf-7e86-469a-a586-9e833edfef27','491c5afc-b1a0-4346-b777-d3b8b8fd0419','computerInventory','Inventario de Computo','/inventory/computerInventory','Inventario de Equipo informático');
/*!40000 ALTER TABLE `page` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-15 17:21:11
