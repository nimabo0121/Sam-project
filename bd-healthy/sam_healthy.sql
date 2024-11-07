CREATE TABLE healthy_batch (
  id INT PRIMARY KEY AUTO_INCREMENT,         -- 批次ID，自動遞增
  healthy_id INT,                            -- 用戶ID，外鍵
  batch_sum INT,                             -- 總熱量
  batch_name VARCHAR(255),                   -- 批次名稱或描述
  batch_date date,                           -- 批次時間
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 批次創建時間
  FOREIGN KEY (healthy_id) REFERENCES user(id) ON DELETE CASCADE -- 外鍵，參照user表中的ID
);


CREATE TABLE healthy (
  id INT PRIMARY KEY AUTO_INCREMENT,         -- 主鍵，自動遞增的ID
  healthy_id INT,                            -- 用戶ID，外鍵
  batch_id INT,                              -- 批次編號，用來區分該用戶當下儲存的所有資訊
  healthy_name VARCHAR(255),                 -- 食物名稱
  healthy_calories INT,                      -- 食物熱量
  healthy_sum INT,                           -- 熱量總和
  notes TEXT,                                -- 備註
  record_date DATE,                          -- 記錄日期
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間，預設為當前時間
  FOREIGN KEY (healthy_id) REFERENCES user(id) ON DELETE CASCADE, -- 外鍵，參照user表中的ID
  FOREIGN KEY (batch_id) REFERENCES healthy_batch(id) ON DELETE CASCADE  -- 外鍵，參照healthy_batch表中的ID
);
