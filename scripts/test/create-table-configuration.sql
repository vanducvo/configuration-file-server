CREATE TABLE IF NOT EXISTS configuration (
	id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON,
    user_id INT NOT NULL,
    FOREIGN KEY 
		(user_id) 
    REFERENCES user(id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);