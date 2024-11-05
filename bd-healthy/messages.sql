CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT, -- 主鍵，自動遞增的消息ID
  sender_id INT, -- 發送者ID
  receiver_id INT, -- 接收者ID
  message TEXT, -- 消息內容
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間，預設為當前時間
  FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE, -- 外鍵，參照使用者表
  FOREIGN KEY (receiver_id) REFERENCES user(id) ON DELETE CASCADE -- 外鍵，參照使用者表
);
