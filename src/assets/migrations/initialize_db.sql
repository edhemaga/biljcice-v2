CREATE DATABASE IF NOT EXISTS biljcice;

USE biljcice;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    status INT CHECK(status IN (1, 2, 3)),
    isDeleted BOOLEAN DEFAULT false,
    createdOn DATETIME DEFAULT (CURRENT_DATE()),
    updatedOn DATETIME,
    name VARCHAR(255),
    surname VARCHAR(255),
    type INT CHECK(type IN (1, 2)),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(255),
    country VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS activeLogins (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255),
    expires DATETIME DEFAULT (NOW())
);

CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    status INT CHECK(status IN (1, 2, 3)),
    isDeleted BOOLEAN DEFAULT false,
    createdOn DATETIME DEFAULT (NOW()),
    updatedOn DATETIME,
    geoLocation TEXT,
    activatedOn DATETIME,
    userId VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sensors (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    status INT CHECK(status IN (1, 2, 3)),
    isDeleted BOOLEAN DEFAULT false,
    createdOn DATETIME DEFAULT (NOW()),
    updatedOn DATETIME,
    name VARCHAR(255),
    manufacturer VARCHAR(255),
    price DECIMAL(10, 2),
    type INT CHECK(type IN (1, 2, 3)),
    serialNumber VARCHAR(255),
    high DECIMAL(10, 2),
    low DECIMAL(10, 2),
    deviceId VARCHAR(255),
    FOREIGN KEY (deviceId) REFERENCES devices(id)
);

CREATE TABLE IF NOT EXISTS configurations (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    status INT CHECK(status IN (1, 2, 3)),
    isDeleted BOOLEAN DEFAULT false,
    createdOn DATETIME DEFAULT (NOW()),
    updatedOn DATETIME,
    name VARCHAR(255),
    deviceId VARCHAR(255),
    FOREIGN KEY (deviceId) REFERENCES devices(id)
);

CREATE TABLE IF NOT EXISTS readings (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    isDeleted BOOLEAN DEFAULT false,
    createdOn DATETIME DEFAULT(NOW()),
    value DECIMAL(10, 2),
    sensorId VARCHAR(255),
    high DECIMAL(10, 2),
    low DECIMAL(10, 2),
    FOREIGN KEY (sensorId) REFERENCES sensors(id)
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    severity INT CHECK(severity IN (1, 2, 3)),
    notified BOOLEAN DEFAULT false,
    readingId VARCHAR(255)
);

SET sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '');

DELIMITER //
CREATE TRIGGER after_reading_insert_high
AFTER INSERT
ON readings FOR EACH ROW

BEGIN
    DECLARE alertSeverity INT;

    DECLARE percentDiff DECIMAL(10, 2);
    IF NEW.value > NEW.high THEN
        SET percentDiff = ((NEW.value / NEW.high) * 100) - 100;

        IF percentDiff > 50 THEN
            SET alertSeverity = 3; -- High severity
        ELSEIF percentDiff > 15 THEN
            SET alertSeverity = 2; -- Medium severity
        ELSE
            SET alertSeverity = 1; -- Low severity
        END IF;

        INSERT INTO alerts (id, severity, notified, readingId)
        VALUES (UUID(), alertSeverity, false, NEW.id);
    END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_reading_insert_low
AFTER INSERT
ON readings FOR EACH ROW

BEGIN
    DECLARE alertSeverity INT;

    DECLARE percentDiff DECIMAL(10, 2);
    
    DECLARE low DECIMAL(10, 2);

    IF NEW.value < NEW.low THEN
        
        IF NEW.value < 1 THEN 
            SET low = 1;
        ELSE
            SET low = NEW.value; -- Low severity
        END IF;

        SET percentDiff = (( NEW.low / low) * 100) - 100;

        IF percentDiff > 50 THEN
            SET alertSeverity = 3; -- High severity
        ELSEIF percentDiff > 15 THEN
            SET alertSeverity = 2; -- Medium severity
        ELSE
            SET alertSeverity = 1; -- Low severity
        END IF;

        INSERT INTO alerts (id, severity, notified, readingId)
        VALUES (UUID(), alertSeverity, false, NEW.id);
    END IF;
END;
//
DELIMITER ;
