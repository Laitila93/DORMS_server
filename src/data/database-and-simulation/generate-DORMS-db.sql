CREATE DATABASE dorms_db;
USE dorms_db;

-- Existing Tables
CREATE TABLE dorms (
  dormID INT NOT NULL AUTO_INCREMENT,
  address VARCHAR(100) NOT NULL,
  username VARCHAR(45) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  xp INT NOT NULL,
  PRIMARY KEY (dormID)
);

CREATE TABLE fishes (
  fishID INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  rarity VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  PRIMARY KEY (fishID)
);

CREATE TABLE hats (
  hatID INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  PRIMARY KEY (hatID)
);

CREATE TABLE specials (
  specialID INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  PRIMARY KEY (specialID)
);

-- Corridor tables for unlocked items
CREATE TABLE corridor_fishes (
  unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  fishID INT NOT NULL,
  dormID INT NOT NULL,
  PRIMARY KEY (fishID, dormID),
  FOREIGN KEY (fishID) REFERENCES fishes(fishID),
  FOREIGN KEY (dormID) REFERENCES dorms(dormID)
);

CREATE TABLE corridor_specials (
  unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  specialID INT NOT NULL,
  dormID INT NOT NULL,
  PRIMARY KEY (specialID, dormID),
  FOREIGN KEY (specialID) REFERENCES specials(specialID),
  FOREIGN KEY (dormID) REFERENCES dorms(dormID)
);

CREATE TABLE corridor_hats (
  unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  dormID INT NOT NULL,
  hatID INT NOT NULL,
  PRIMARY KEY (dormID, hatID),
  FOREIGN KEY (dormID) REFERENCES dorms(dormID),
  FOREIGN KEY (hatID) REFERENCES hats(hatID)
);

-- Equipped fishes (max 6 per dorm)
CREATE TABLE equipped_fishes (
  dormID INT NOT NULL,
  fishID INT NOT NULL,
  position INT NOT NULL, -- 1-10 slot index
  PRIMARY KEY (dormID, position),
  FOREIGN KEY (dormID) REFERENCES dorms(dormID),
  FOREIGN KEY (fishID) REFERENCES fishes(fishID)
);

-- Equipped hat per fish (optional)
CREATE TABLE equipped_fish_hats (
  dormID INT NOT NULL,
  position INT NOT NULL,
  hatID INT,
  PRIMARY KEY (dormID, position),
  FOREIGN KEY (dormID, position) REFERENCES equipped_fishes(dormID, position),
  FOREIGN KEY (hatID) REFERENCES hats(hatID)
);

-- Equipped special (1 per dorm)
CREATE TABLE equipped_special (
  dormID INT NOT NULL,
  specialID INT NOT NULL,
  PRIMARY KEY (dormID),
  FOREIGN KEY (dormID) REFERENCES dorms(dormID),
  FOREIGN KEY (specialID) REFERENCES specials(specialID)
);

-- Equipped background (1 per dorm)
CREATE TABLE equipped_background (
  dormID INT NOT NULL,
  background VARCHAR(255) NOT NULL,
  PRIMARY KEY (dormID),
  FOREIGN KEY (dormID) REFERENCES dorms(dormID)
);

-- Experience log

CREATE TABLE xp_log (
dormID INT NOT NULL,
xp INT NOT NULL,
logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
FOREIGN KEY (dormID) REFERENCES dorms(dormID),
PRIMARY KEY (logged_at, dormID)
);


