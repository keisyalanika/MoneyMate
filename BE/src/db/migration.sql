-- ============================================
-- MoneyMate Database Migration
-- Database: moneymate_db
-- ============================================

CREATE DATABASE IF NOT EXISTS moneymate_db;
USE moneymate_db;

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 2. CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 3. INCOME SOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS income_sources (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  source_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 4. TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category_id INT(11) NOT NULL,
  income_source_id INT(11),
  date DATE NOT NULL,
  note TEXT,
  receipt_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (income_source_id) REFERENCES income_sources(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- ============================================
-- 5. BUDGETS
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  category_id INT(11) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  month INT(11) NOT NULL,
  year INT(11) NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  UNIQUE KEY unique_budget (user_id, category_id, month, year)
) ENGINE=InnoDB;

-- ============================================
-- 6. GOALS
-- ============================================
CREATE TABLE IF NOT EXISTS goals (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  title VARCHAR(100) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0.00,
  icon VARCHAR(50),
  deadline DATE,
  is_completed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 7. GOAL FUNDS
-- ============================================
CREATE TABLE IF NOT EXISTS goal_funds (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  goal_id INT(11) NOT NULL,
  user_id INT(11) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 8. AI INSIGHTS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_insights (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  insight_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 9. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================
-- 10. REPORTS
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11),
  generated_by INT(11) NOT NULL,
  report_type ENUM('monthly', 'weekly', 'custom', 'annual') NOT NULL,
  title VARCHAR(150),
  period_start DATE,
  period_end DATE,
  file_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (generated_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================
-- 11. USER SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL UNIQUE,
  currency ENUM('IDR', 'USD') DEFAULT 'IDR',
  language ENUM('id', 'en') DEFAULT 'id',
  theme ENUM('light', 'dark') DEFAULT 'light',
  notification_enabled TINYINT(1) DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 12. AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  admin_id INT(11) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_table VARCHAR(50),
  target_id INT(11),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE INDEX idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- ============================================
-- SEED DATA: Default Categories
-- ============================================
INSERT INTO categories (name, type, icon) VALUES
  ('Gaji Bulanan', 'income', 'wallet'),
  ('Freelance', 'income', 'laptop'),
  ('Beasiswa', 'income', 'award'),
  ('Transfer Orang Tua', 'income', 'heart'),
  ('Investasi', 'income', 'trending-up'),
  ('Lainnya (Pemasukan)', 'income', 'plus-circle'),
  ('Makanan & Minuman', 'expense', 'utensils'),
  ('Transportasi', 'expense', 'bus'),
  ('Belanja', 'expense', 'shopping-cart'),
  ('Tagihan & Utilitas', 'expense', 'file-text'),
  ('Pendidikan', 'expense', 'book'),
  ('Hiburan', 'expense', 'music'),
  ('Kesehatan', 'expense', 'activity'),
  ('Lainnya (Pengeluaran)', 'expense', 'minus-circle');

-- ============================================
-- SEED DATA: Default Admin User (password: admin123)
-- ============================================
INSERT INTO users (name, email, password, role) VALUES
  ('Admin MoneyMate', 'admin@moneymate.com', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'admin');
