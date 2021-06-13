# Challenge name: Original Store
# Solution: WRITEUP.md
# Deployment details: 

Bird i'm sorry to be giving you more work but please dockerize this :( 

## MAIN APP SETUP 

1. Set the mysql root password to:
	`mu?"$bqt=WA#6}V,` according to the config.php file.
  i modified the password burd to make my life a little easy

2. Execute these MySQL queries:

```sql
CREATE DATABASE original_shop;

USE original_shop;

CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password) VALUES ("admin", "V3ryStr0ngP4ssw0rdF0rN0Cr4ck");
exit;
```

3. Use apache to host the files at files/original_store/ 

## ADMIN BOT SETUP

```sh
1. Make your current directory have the files inside files/admin_bot/
2. sudo apt install firefox
3. PUPPETEER_PRODUCT=firefox sudo npm install puppeteer
4. export DISPLAY=:0.0
5. firefox --headless &
6. export PUPPETEER_EXECUTABLE_PATH='/usr/bin/firefox'
7. sudo npm install 
8. sudo node server.js
``` 

Thanks finch <3 .

