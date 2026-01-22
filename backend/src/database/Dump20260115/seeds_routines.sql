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
-- Dumping events for database 'seeds'
--

--
-- Dumping routines for database 'seeds'
--
/*!50003 DROP PROCEDURE IF EXISTS `pGetModules` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pGetModules`(IN idUser varchar(36))
BEGIN

drop table if exists tRolePagePermission;
create temporary table tRolePagePermission (
	id varchar(36),
    idRole varchar(36),
    idPage varchar(36),
    idPermission varchar(36)
);

drop table if exists tRole;
create temporary table tRole (
    id varchar(36)
);

drop table if exists tPage;
create temporary table tPage (
	id varchar(36),
    idModule varchar(36),
    label varchar(50),
    description varchar(250)
);

drop table if exists tPermission;
create temporary table tPermission (
	id varchar(36),
    label varchar(50)
);

drop table if exists tUser;
create temporary table tUser (
	id varchar(36),
    idRole varchar(36)
);

drop table if exists tModule;
create temporary table tModule (
	id varchar(36),
    label varchar(50)
);

insert into tUser
select u.id, u.idRole from seeds.user u where u.id = idUser;

insert into tRole
select r.id from seeds.role r where r.id in (select u.idRole from tUser u);

insert into tRolePagePermission
select rpp.id, rpp.idRole, rpp.idPage, rpp.idPermission from seeds.role_page_permission rpp where rpp.idRole in (select r.id from tRole r);

insert into tPage
select p.id, p.idModule, p.label, p.description from seeds.page p where p.id in (select rpp.idPage from tRolePagePermission rpp);

insert into tModule
select m.id, m.label from seeds.module m where m.id in (select p.idModule from tPage p);

insert into tPermission
select p.id, p.label from seeds.permission p where p.id in (select rpp.idPermission from tRolePagePermission rpp);

SELECT 
    m.label 'module', p.label 'page', p.description 'pageDescription', pp.label 'permission'
FROM
    tUser u
        INNER JOIN
    tRole r ON u.idRole = r.id
        INNER JOIN
    tRolePagePermission rpp ON rpp.idRole = r.id
        INNER JOIN
    tPage p ON p.id = rpp.idPage
        INNER JOIN
    tPermission pp ON pp.id = rpp.idPermission
        INNER JOIN
    tModule m ON m.id = p.idModule;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pGetPermissions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pGetPermissions`(IN idUser varchar(36))
BEGIN

drop table if exists tRolePagePermission;
create temporary table tRolePagePermission (
	id varchar(36),
    idRole varchar(36),
    idPage varchar(36),
    idPermission varchar(36)
);

drop table if exists tRole;
create temporary table tRole (
    id varchar(36)
);

drop table if exists tPage;
create temporary table tPage (
	id varchar(36),
    idModule varchar(36),
    label varchar(50),
    description varchar(250)
);

drop table if exists tPermission;
create temporary table tPermission (
	id varchar(36),
    label varchar(50)
);

drop table if exists tUser;
create temporary table tUser (
	id varchar(36),
    idRole varchar(36)
);

drop table if exists tModule;
create temporary table tModule (
	id varchar(36),
    label varchar(50)
);

insert into tUser
select u.id, u.idRole from seeds.user u where u.id = idUser;

insert into tRole
select r.id from seeds.role r where r.id in (select u.idRole from tUser u);

insert into tRolePagePermission
select rpp.id, rpp.idRole, rpp.idPage, rpp.idPermission from seeds.role_page_permission rpp where rpp.idRole in (select r.id from tRole r);

insert into tPage
select p.id, p.idModule, p.label, p.description from seeds.page p where p.id in (select rpp.idPage from tRolePagePermission rpp);

insert into tModule
select m.id, m.label from seeds.module m where m.id in (select p.idModule from tPage p);

insert into tPermission
select p.id, p.label from seeds.permission p where p.id in (select rpp.idPermission from tRolePagePermission rpp);

SELECT 
    m.label 'module', p.label 'page', p.description 'pageDescription', pp.label 'permission'
FROM
    tUser u
        INNER JOIN
    tRole r ON u.idRole = r.id
        INNER JOIN
    tRolePagePermission rpp ON rpp.idRole = r.id
        INNER JOIN
    tPage p ON p.id = rpp.idPage
        INNER JOIN
    tPermission pp ON pp.id = rpp.idPermission
        INNER JOIN
    tModule m ON m.id = p.idModule;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-15 17:21:11
