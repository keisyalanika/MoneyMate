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
  birth_date VARCHAR(50),
  bio TEXT,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 1B. OTP CODES (Forgot & Reset Password)
-- ============================================
CREATE TABLE IF NOT EXISTS otp_codes (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL,
  is_used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 1C. WALLETS (Dompet & Saldo Pengguna)
-- ============================================
CREATE TABLE IF NOT EXISTS wallets (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  name VARCHAR(100) NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 2. CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NULL,
  name VARCHAR(50) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20) DEFAULT '#3B82F6',
  is_pinned TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  wallet_id INT(11) NULL,
  type ENUM('income', 'expense') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category_id INT(11) NOT NULL,
  income_source_id INT(11),
  date DATE NOT NULL,
  note TEXT,
  receipt_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (income_source_id) REFERENCES income_sources(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
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
  default_budget_limit DECIMAL(12,2) DEFAULT 2500000.00,
  ews_enabled TINYINT(1) DEFAULT 1,
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
INSERT INTO categories (name, type, icon, color, is_pinned) VALUES
  ('Gaji Bulanan', 'income', 'wallet', '#10B981', 1),
  ('Freelance', 'income', 'laptop', '#059669', 0),
  ('Beasiswa', 'income', 'award', '#3B82F6', 1),
  ('Transfer Orang Tua', 'income', 'heart', '#EC4899', 1),
  ('Investasi', 'income', 'trending-up', '#8B5CF6', 0),
  ('Lainnya (Pemasukan)', 'income', 'plus-circle', '#6B7280', 0),
  ('Makanan & Minuman', 'expense', 'utensils', '#EF4444', 1),
  ('Transportasi', 'expense', 'bus', '#F59E0B', 1),
  ('Belanja', 'expense', 'shopping-cart', '#6366F1', 1),
  ('Tagihan & Utilitas', 'expense', 'file-text', '#8B5CF6', 0),
  ('Pendidikan', 'expense', 'book', '#06B6D4', 0),
  ('Hiburan', 'expense', 'music', '#EC4899', 0),
  ('Kesehatan', 'expense', 'activity', '#10B981', 0),
  ('Lainnya (Pengeluaran)', 'expense', 'minus-circle', '#6B7280', 0);

-- ============================================
-- SEED DATA: Default Admin User (password: admin123)
-- ============================================
INSERT INTO users (name, email, password, role, birth_date, bio) VALUES
  ('Admin MoneyMate', 'admin@moneymate.com', '$2b$10$YvwgKwpIEQ8PYLJYyvqViu4ESQMumlBDDXBzVxuVsuYeh4SA6I2Mm', 'admin', '1998-05-12', 'Administrator Utama MoneyMate'),
  ('Keisya Exa Haniyah', 'keisyaexahaniyah@gmail.com', '$2b$10$ywFIMhPR.GYD.G2gGybpjOoKfDnqiSYH0GKMk.imNGZJtGnbwfIiu', 'student', '2003-08-15', 'Mahasiswa Pengguna Aktif MoneyMate');

-- ============================================
-- SEED DATA: Default Wallets for Keisya
-- ============================================
INSERT INTO wallets (user_id, name, balance, currency, is_default) VALUES
  (2, 'Dompet Utama (Cash)', 1500000.00, 'IDR', 1),
  (2, 'Rekening Bank BCA', 850000.00, 'IDR', 0),
  (2, 'E-Wallet GoPay', 100000.00, 'IDR', 0);
