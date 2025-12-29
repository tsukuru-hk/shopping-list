-- データベースの使用
USE resource_planner;

-- ユーザーの作成（既に環境変数で作成されている場合でもエラーにならないように）
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';

-- ユーザーに権限を付与
GRANT ALL PRIVILEGES ON resource_planner.* TO 'app_user'@'%';

-- 権限の反映
FLUSH PRIVILEGES;

-- numberテーブルの作成
CREATE TABLE IF NOT EXISTS number (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

