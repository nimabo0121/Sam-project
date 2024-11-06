CREATE TABLE healthy (
  id INT PRIMARY KEY AUTO_INCREMENT,         -- 主鍵，自動遞增的ID
  healthy_id INT,                            -- 用戶ID，外鍵
  healthy_name VARCHAR(255),                 -- 食物名稱
  healthy_calories INT,                      -- 食物熱量
  healthy_num int,                           -- 數量
  healthy_sum  int,                          -- 熱量總和
  notes TEXT,                                -- 備註
  record_date DATE,                          -- 記錄日期
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間，預設為當前時間
  FOREIGN KEY (healthy_id) REFERENCES user(id) ON DELETE CASCADE  -- 外鍵，參照user表中的ID
);
