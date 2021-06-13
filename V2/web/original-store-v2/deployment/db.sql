CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELETE FROM users WHERE username="admin";
INSERT INTO users (username, password) VALUES ("admin", "V3ryStr0ngP4ssw0rdF0rN0Cr4ckTh1sT1m3V2Ch4llP4ss");
