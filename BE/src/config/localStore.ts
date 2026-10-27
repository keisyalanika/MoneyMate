import fs from 'fs';
import path from 'path';

export interface LocalStoreData {
  users: any[];
  wallets: any[];
  categories: any[];
  income_sources: any[];
  transactions: any[];
  budgets: any[];
  goals: any[];
  goal_funds: any[];
  ai_insights: any[];
  notifications: any[];
  reports: any[];
  user_settings: any[];
  audit_logs: any[];
  otp_codes: any[];
}

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'moneymate_store.json');

const INITIAL_SEED: LocalStoreData = {
  users: [
    {
      id: 1,
      name: 'Admin MoneyMate',
      email: 'admin@moneymate.com',
      phone: '081122334455',
      // bcrypt hash for 'admin123'
      password: '$2b$10$YvwgKwpIEQ8PYLJYyvqViu4ESQMumlBDDXBzVxuVsuYeh4SA6I2Mm',
      role: 'admin',
      is_active: 1,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      birth_date: '1998-05-12',
      bio: 'Administrator Utama Portal Keuangan Kampus MoneyMate',
      created_at: new Date('2026-08-01T08:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Keisya Exa Haniyah',
      email: 'keisyaexahaniyah@gmail.com',
      phone: '081234567890',
      // bcrypt hash for 'Admin123'
      password: '$2b$10$ywFIMhPR.GYD.G2gGybpjOoKfDnqiSYH0GKMk.imNGZJtGnbwfIiu',
      role: 'student',
      is_active: 1,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      birth_date: '2003-08-15',
      bio: 'Mahasiswa Pengguna Aktif MoneyMate',
      created_at: new Date('2026-08-15T09:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Bima Santoso',
      email: 'bima.santoso@gmail.com',
      phone: '081345678901',
      password: '$2b$10$ywFIMhPR.GYD.G2gGybpjOoKfDnqiSYH0GKMk.imNGZJtGnbwfIiu',
      role: 'student',
      is_active: 1,
      created_at: new Date('2026-09-01T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Aulia Rahma',
      email: 'aulia.rahma@gmail.com',
      phone: '081456789012',
      password: '$2b$10$ywFIMhPR.GYD.G2gGybpjOoKfDnqiSYH0GKMk.imNGZJtGnbwfIiu',
      role: 'student',
      is_active: 1,
      created_at: new Date('2026-09-02T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  wallets: [
    {
      id: 1,
      user_id: 2,
      name: 'Dompet Utama (Cash)',
      balance: 1500000,
      currency: 'IDR',
      is_default: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      name: 'Rekening Bank BCA',
      balance: 850000,
      currency: 'IDR',
      is_default: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      user_id: 2,
      name: 'E-Wallet GoPay',
      balance: 100000,
      currency: 'IDR',
      is_default: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  categories: [
    { id: 1, user_id: null, name: 'Gaji Bulanan', type: 'income', icon: 'wallet', color: '#10B981', is_pinned: 1, created_at: new Date().toISOString() },
    { id: 2, user_id: null, name: 'Freelance', type: 'income', icon: 'laptop', color: '#059669', is_pinned: 0, created_at: new Date().toISOString() },
    { id: 3, user_id: null, name: 'Beasiswa', type: 'income', icon: 'award', color: '#3B82F6', is_pinned: 1, created_at: new Date().toISOString() },
    { id: 4, user_id: null, name: 'Transfer Orang Tua', type: 'income', icon: 'heart', color: '#EC4899', is_pinned: 1, created_at: new Date().toISOString() },
    { id: 5, user_id: null, name: 'Investasi', type: 'income', icon: 'trending-up', color: '#8B5CF6', is_pinned: 0, created_at: new Date().toISOString() },
    { id: 6, user_id: null, name: 'Lainnya (Pemasukan)', type: 'income', icon: 'plus-circle', color: '#6B7280', is_pinned: 0, created_at: new Date().toISOString() },
    { id: 7, user_id: null, name: 'Makanan & Minuman', type: 'expense', icon: 'utensils', color: '#EF4444', is_pinned: 1, created_at: new Date().toISOString() },
    { id: 8, user_id: null, name: 'Transportasi', type: 'expense', icon: 'bus', color: '#F59E0B', is_pinned: 1, created_at: new Date().toISOString() },
    { id: 9, user_id: null, name: 'Belanja', type: 'expense', icon: 'shopping-cart', color: '#6366F1', is_pinned: 1, created_at: new Date().toISOString() },
    { id: 10, user_id: null, name: 'Tagihan & Utilitas', type: 'expense', icon: 'file-text', color: '#8B5CF6', is_pinned: 0, created_at: new Date().toISOString() },
    { id: 11, user_id: null, name: 'Pendidikan', type: 'expense', icon: 'book', color: '#06B6D4', is_pinned: 0, created_at: new Date().toISOString() },
    { id: 12, user_id: null, name: 'Hiburan', type: 'expense', icon: 'music', color: '#EC4899', is_pinned: 0, created_at: new Date().toISOString() },
    { id: 13, user_id: null, name: 'Kesehatan', type: 'expense', icon: 'activity', color: '#10B981', is_pinned: 0, created_at: new Date().toISOString() },
    { id: 14, user_id: null, name: 'Lainnya (Pengeluaran)', type: 'expense', icon: 'minus-circle', color: '#6B7280', is_pinned: 0, created_at: new Date().toISOString() }
  ],
  income_sources: [
    { id: 1, user_id: 2, source_name: 'Transfer Orang Tua', created_at: new Date().toISOString() },
    { id: 2, user_id: 2, source_name: 'Beasiswa KIP-K', created_at: new Date().toISOString() },
    { id: 3, user_id: 2, source_name: 'Gaji Magang / Freelance', created_at: new Date().toISOString() }
  ],
  transactions: [
    {
      id: 1,
      user_id: 2,
      wallet_id: 1,
      type: 'income',
      amount: 3500000,
      category_id: 4,
      income_source_id: 1,
      date: '2026-10-01',
      note: 'Kiriman Uang Bulanan dari Orang Tua',
      receipt_image_url: null,
      created_at: new Date('2026-10-01T08:00:00Z').toISOString()
    },
    {
      id: 2,
      user_id: 2,
      wallet_id: 1,
      type: 'expense',
      amount: 45000,
      category_id: 7,
      income_source_id: null,
      date: '2026-10-02',
      note: 'Makan Siang Kantin Kampus',
      receipt_image_url: null,
      created_at: new Date('2026-10-02T12:30:00Z').toISOString()
    },
    {
      id: 3,
      user_id: 2,
      wallet_id: 2,
      type: 'expense',
      amount: 80000,
      category_id: 8,
      income_source_id: null,
      date: '2026-10-03',
      note: 'Bensin & Transportasi Minggu Ini',
      receipt_image_url: null,
      created_at: new Date('2026-10-03T16:00:00Z').toISOString()
    },
    {
      id: 4,
      user_id: 2,
      wallet_id: 3,
      type: 'expense',
      amount: 125000,
      category_id: 9,
      income_source_id: null,
      date: '2026-10-05',
      note: 'Beli Buku Catatan Kuliah & Perlengkapan',
      receipt_image_url: null,
      created_at: new Date('2026-10-05T14:15:00Z').toISOString()
    }
  ],
  budgets: [
    {
      id: 1,
      user_id: 2,
      category_id: 7,
      amount: 1200000,
      month: 10,
      year: 2026,
      is_active: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      category_id: 8,
      amount: 400000,
      month: 10,
      year: 2026,
      is_active: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      user_id: 2,
      category_id: 9,
      amount: 500000,
      month: 10,
      year: 2026,
      is_active: 1,
      created_at: new Date().toISOString()
    }
  ],
  goals: [
    {
      id: 1,
      user_id: 2,
      title: 'Laptop Baru Coding',
      target_amount: 12000000,
      current_amount: 4500000,
      icon: 'laptop',
      deadline: '2026-12-31',
      is_completed: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      title: 'Dana Darurat Mahasiswa',
      target_amount: 3000000,
      current_amount: 1800000,
      icon: 'shield',
      deadline: '2026-11-30',
      is_completed: 0,
      created_at: new Date().toISOString()
    }
  ],
  goal_funds: [
    { id: 1, goal_id: 1, user_id: 2, amount: 2000000, note: 'Tabungan Awal', created_at: new Date().toISOString() },
    { id: 2, goal_id: 1, user_id: 2, amount: 2500000, note: 'Gaji Freelance Desain', created_at: new Date().toISOString() },
    { id: 3, goal_id: 2, user_id: 2, amount: 1800000, note: 'Alokasi Awal Dana Darurat', created_at: new Date().toISOString() }
  ],
  ai_insights: [
    {
      id: 1,
      user_id: 2,
      insight_type: 'spending_habit',
      content: 'Pengeluaran nongkrong/kopi minggu ini mencapai Rp 185.000. Coba kurangi 1 gelas seminggu untuk hemat Rp 80.000.',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      insight_type: 'saving_streak',
      content: 'Hebat! Anda konsisten menabung selama 3 minggu berturut-turut untuk target Dana Darurat.',
      created_at: new Date().toISOString()
    }
  ],
  notifications: [
    {
      id: 1,
      user_id: 2,
      title: 'Peringatan Anggaran',
      message: 'Pengeluaran Kebutuhan Pokok sudah mencapai 80% dari limit bulanan.',
      is_read: 0,
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
      id: 2,
      user_id: 2,
      title: 'Laporan Finansial Siap',
      message: 'Ringkasan pengeluaran & pemasukan minggu ini sudah siap dianalisis.',
      is_read: 1,
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: 3,
      user_id: 2,
      title: 'Goal Hampir Tercapai! 🎯',
      message: 'Goal "Dana Darurat" sudah mencapai 60%. Terus pertahankan kedisiplinan!',
      is_read: 1,
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    }
  ],
  reports: [
    {
      id: 1,
      user_id: 2,
      generated_by: 1,
      report_type: 'monthly',
      title: 'Laporan Arus Kas Oktober 2026',
      period_start: '2026-10-01',
      period_end: '2026-10-31',
      file_url: null,
      created_at: new Date().toISOString()
    }
  ],
  user_settings: [
    {
      id: 1,
      user_id: 2,
      currency: 'IDR',
      language: 'id',
      theme: 'light',
      notification_enabled: 1,
      default_budget_limit: 2500000,
      ews_enabled: 1,
      updated_at: new Date().toISOString()
    }
  ],
  audit_logs: [
    {
      id: 1,
      admin_id: 1,
      action: 'INIT_SYSTEM',
      target_table: 'system',
      target_id: 1,
      description: 'System initialization completed',
      created_at: new Date().toISOString()
    }
  ],
  otp_codes: []
};

class LocalDatabaseStore {
  private data: LocalStoreData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): LocalStoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all collections exist
        return {
          ...INITIAL_SEED,
          ...parsed,
          users: parsed.users || INITIAL_SEED.users,
          wallets: parsed.wallets || INITIAL_SEED.wallets,
          categories: parsed.categories || INITIAL_SEED.categories,
          income_sources: parsed.income_sources || INITIAL_SEED.income_sources,
          transactions: parsed.transactions || INITIAL_SEED.transactions,
          budgets: parsed.budgets || INITIAL_SEED.budgets,
          goals: parsed.goals || INITIAL_SEED.goals,
          goal_funds: parsed.goal_funds || INITIAL_SEED.goal_funds,
          ai_insights: parsed.ai_insights || INITIAL_SEED.ai_insights,
          notifications: parsed.notifications || INITIAL_SEED.notifications,
          reports: parsed.reports || INITIAL_SEED.reports,
          user_settings: parsed.user_settings || INITIAL_SEED.user_settings,
          audit_logs: parsed.audit_logs || INITIAL_SEED.audit_logs,
          otp_codes: parsed.otp_codes || []
        };
      }
    } catch (e) {
      console.warn('[LocalDB] Could not read existing store file, initializing with defaults');
    }
    return JSON.parse(JSON.stringify(INITIAL_SEED));
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[LocalDB] Failed to save store file:', e);
    }
  }

  public getData(): LocalStoreData {
    return this.data;
  }

  public getTable(tableName: string): any[] {
    const key = tableName.toLowerCase().trim() as keyof LocalStoreData;
    if (this.data[key]) {
      return this.data[key];
    }
    return [];
  }
}

export const localStore = new LocalDatabaseStore();
