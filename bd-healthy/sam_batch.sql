CREATE TABLE healthy_batch (
  id INT PRIMARY KEY AUTO_INCREMENT,         -- 批次ID，自動遞增
  healthy_id INT,                            -- 用戶ID，外鍵
  batch_name VARCHAR(255),                   -- 批次名稱或描述
  batch_date date,                           -- 批次時間
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 批次創建時間
  FOREIGN KEY (healthy_id) REFERENCES user(id) ON DELETE CASCADE -- 外鍵，參照user表中的ID
);
