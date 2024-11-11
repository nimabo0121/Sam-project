CREATE TABLE batch_label (
  id INT PRIMARY KEY AUTO_INCREMENT,         -- 批次ID，自動遞增
  label_id INT,                              -- 用戶ID，外鍵
  label_name VARCHAR(255),                   -- 標籤name
  FOREIGN KEY (label_id) REFERENCES user(id) ON DELETE CASCADE -- 外鍵，參照user表中的ID
);
