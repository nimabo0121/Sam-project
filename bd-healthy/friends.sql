CREATE TABLE friends (
  id INT PRIMARY KEY AUTO_INCREMENT, -- 主鍵，自動遞增的好友關係ID
  user_id INT, -- 使用者ID，表示發起好友請求的一方
  friend_id INT, -- 好友ID，表示被添加為好友的一方
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending', -- 好友狀態，預設為待處理（'pending'），其他狀態包括接受（'accepted'）和封鎖（'blocked'）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間，預設為當前時間
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE, -- 外鍵，參照users表中的ID，若使用者被刪除則關聯好友記錄也會刪除
  FOREIGN KEY (friend_id) REFERENCES user(id) ON DELETE CASCADE -- 外鍵，參照users表中的ID，若好友被刪除則關聯記錄也會刪除
);
