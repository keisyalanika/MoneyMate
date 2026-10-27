import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { localStore } from './localStore';

dotenv.config();

let isMysqlOnline: boolean | null = null;

const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'moneymate_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection once asynchronously
(async () => {
  try {
    const conn = await mysqlPool.getConnection();
    conn.release();
    isMysqlOnline = true;
    console.log('✅ [Database] Connected to MySQL successfully (Port 3306).');
  } catch (err: any) {
    isMysqlOnline = false;
    console.log('⚡ [Database] MySQL server not detected. Running seamlessly in Local Storage Mode.');
  }
})();

// Helper to evaluate simple queries for the local store
function executeLocalQuery(sql: string, params: any[] = []): any {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');
  const upper = cleanSql.toUpperCase();
  const store = localStore.getData();

  // 1. INSERT INTO <table> (...) VALUES (...)
  if (upper.startsWith('INSERT INTO')) {
    const tableMatch = cleanSql.match(/INSERT\s+INTO\s+([a-zA-Z_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (tableMatch) {
      const tableName = tableMatch[1].toLowerCase() as keyof typeof store;
      const columns = tableMatch[2].split(',').map(c => c.trim().replace(/[`"']/g, ''));
      const table = localStore.getTable(tableName);

      const newRow: any = {};
      columns.forEach((col, idx) => {
        newRow[col] = params[idx] !== undefined ? params[idx] : null;
      });

      // Assign id
      const maxId = table.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0);
      newRow.id = maxId + 1;
      newRow.created_at = newRow.created_at || new Date().toISOString();
      if (newRow.updated_at !== undefined) newRow.updated_at = new Date().toISOString();

      table.push(newRow);
      localStore.save();

      return [{ insertId: newRow.id, affectedRows: 1 }, []];
    }
  }

  // 2. UPDATE <table> SET ... WHERE ...
  if (upper.startsWith('UPDATE')) {
    const updateMatch = cleanSql.match(/UPDATE\s+([a-zA-Z_]+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/i);
    if (updateMatch) {
      const tableName = updateMatch[1].toLowerCase() as keyof typeof store;
      const setClause = updateMatch[2];
      const whereClause = updateMatch[3];
      const table = localStore.getTable(tableName);

      // Parse SET fields
      const setParts = setClause.split(',').map(s => s.trim());
      let paramIdx = 0;
      const updates: Record<string, any> = {};

      for (const part of setParts) {
        const colMatch = part.match(/([a-zA-Z_0-9]+)\s*=\s*\?/);
        if (colMatch) {
          updates[colMatch[1]] = params[paramIdx++];
        } else {
          const directMatch = part.match(/([a-zA-Z_0-9]+)\s*=\s*(.+)/);
          if (directMatch) {
            const rawVal = directMatch[2].trim().replace(/['"]/g, '');
            updates[directMatch[1]] = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
          }
        }
      }

      // Filter rows by WHERE
      let affectedRows = 0;
      for (const row of table) {
        let matches = true;
        if (whereClause) {
          if (whereClause.includes('WHERE id = ?') || whereClause.includes('id = ?')) {
            const targetId = params[paramIdx];
            matches = Number(row.id) === Number(targetId);
          } else if (whereClause.includes('user_id = ?')) {
            const targetUserId = params[paramIdx];
            matches = Number(row.user_id) === Number(targetUserId);
          }
        }
        if (matches) {
          Object.assign(row, updates);
          if (row.updated_at) row.updated_at = new Date().toISOString();
          affectedRows++;
        }
      }

      localStore.save();
      return [{ affectedRows, changedRows: affectedRows }, []];
    }
  }

  // 3. DELETE FROM <table> WHERE ...
  if (upper.startsWith('DELETE FROM')) {
    const delMatch = cleanSql.match(/DELETE\s+FROM\s+([a-zA-Z_]+)(?:\s+WHERE\s+(.+))?$/i);
    if (delMatch) {
      const tableName = delMatch[1].toLowerCase() as keyof typeof store;
      const whereClause = delMatch[2];
      const table = localStore.getTable(tableName);

      let initialLen = table.length;
      if (whereClause && whereClause.includes('id = ?')) {
        const targetId = params[0];
        const filtered = table.filter(r => Number(r.id) !== Number(targetId));
        (store as any)[tableName] = filtered;
      }

      localStore.save();
      return [{ affectedRows: initialLen - localStore.getTable(tableName).length }, []];
    }
  }

  // 4. SELECT queries
  if (upper.startsWith('SELECT')) {
    // 4A. Count or Aggregations
    if (upper.includes('COUNT(*)') || upper.includes('COUNT(1)')) {
      const tableMatch = cleanSql.match(/FROM\s+([a-zA-Z_]+)/i);
      const tableName = tableMatch ? tableMatch[1].toLowerCase() : '';
      const table = localStore.getTable(tableName);

      let filtered = [...table];
      if (upper.includes('WHERE')) {
        if (upper.includes('USER_ID = ?')) {
          filtered = filtered.filter(r => Number(r.user_id) === Number(params[0]));
        }
        if (upper.includes('IS_ACTIVE = 1')) {
          filtered = filtered.filter(r => Number(r.is_active) === 1);
        }
        if (upper.includes('IS_COMPLETED = 0')) {
          filtered = filtered.filter(r => !r.is_completed);
        }
      }
      return [[{ total: filtered.length }], []];
    }

    if (upper.includes('SUM(AMOUNT)')) {
      const tableMatch = cleanSql.match(/FROM\s+([a-zA-Z_]+)/i);
      const tableName = tableMatch ? tableMatch[1].toLowerCase() : '';
      const table = localStore.getTable(tableName);

      let filtered = [...table];
      let pIdx = 0;
      if (upper.includes('USER_ID = ?')) {
        filtered = filtered.filter(r => Number(r.user_id) === Number(params[pIdx++]));
      }
      if (upper.includes("TYPE = 'INCOME'") || (upper.includes('TYPE = ?') && params.includes('income'))) {
        filtered = filtered.filter(r => String(r.type).toLowerCase() === 'income');
      } else if (upper.includes("TYPE = 'EXPENSE'") || (upper.includes('TYPE = ?') && params.includes('expense'))) {
        filtered = filtered.filter(r => String(r.type).toLowerCase() === 'expense');
      }

      const sum = filtered.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
      return [[{ total: sum }], []];
    }

    // 4B. Table resolution
    let tableName = '';
    const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z_]+)(?:\s+([a-zA-Z_]+))?/i);
    if (fromMatch) {
      tableName = fromMatch[1].toLowerCase();
    }

    let rows: any[] = JSON.parse(JSON.stringify(localStore.getTable(tableName)));

    // Process Joined fields (for transactions, budgets, goals, etc.)
    if (tableName === 'transactions') {
      const categories = store.categories || [];
      const users = store.users || [];
      const wallets = store.wallets || [];
      const incomeSources = store.income_sources || [];

      rows = rows.map(t => {
        const cat = categories.find(c => Number(c.id) === Number(t.category_id));
        const usr = users.find(u => Number(u.id) === Number(t.user_id));
        const wlt = wallets.find(w => Number(w.id) === Number(t.wallet_id));
        const ins = incomeSources.find(i => Number(i.id) === Number(t.income_source_id));
        return {
          ...t,
          category_name: cat ? cat.name : 'Umum',
          category_icon: cat ? cat.icon : 'tag',
          category_color: cat ? (cat.color || '#3B82F6') : '#3B82F6',
          user_name: usr ? usr.name : 'Pengguna',
          user_email: usr ? usr.email : '',
          user_avatar: usr ? usr.avatar_url : '',
          wallet_name: wlt ? wlt.name : 'Dompet Utama',
          income_source_name: ins ? ins.source_name : null,
        };
      });
    }

    if (tableName === 'budgets') {
      const categories = store.categories || [];
      const users = store.users || [];
      const transactions = store.transactions || [];

      rows = rows.map(b => {
        const cat = categories.find(c => Number(c.id) === Number(b.category_id));
        const usr = users.find(u => Number(u.id) === Number(b.user_id));
        // calculate spent amount in current month/year
        const spent = transactions
          .filter(t => Number(t.user_id) === Number(b.user_id) &&
                       Number(t.category_id) === Number(b.category_id) &&
                       String(t.type).toLowerCase() === 'expense')
          .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

        return {
          ...b,
          category_name: cat ? cat.name : 'Kategori',
          category_icon: cat ? cat.icon : 'tag',
          user_name: usr ? usr.name : 'Mahasiswa',
          spent_amount: spent,
          percentage: Number(b.amount) > 0 ? Math.round((spent / Number(b.amount)) * 100) : 0
        };
      });
    }

    // Process WHERE filters
    let pIdx = 0;
    if (upper.includes('WHERE')) {
      const wherePart = cleanSql.slice(upper.indexOf('WHERE') + 5).split(/ORDER BY|LIMIT/i)[0];
      const condRegex = /([a-zA-Z_0-9.]+)\s*(=|!=|LIKE|>=|<=|>|<)\s*\?/gi;
      let match;

      while ((match = condRegex.exec(wherePart)) !== null && pIdx < params.length) {
        const fullCol = match[1].toLowerCase();
        const col = fullCol.includes('.') ? fullCol.split('.')[1] : fullCol;
        const op = match[2].toUpperCase();
        const paramVal = params[pIdx++];

        rows = rows.filter(r => {
          const rowVal = r[col];
          if (paramVal === undefined) return true;

          if (op === '=') {
            if (col === 'user_id' && wherePart.toLowerCase().includes('user_id is null or user_id = ?')) {
              return rowVal === null || rowVal === undefined || Number(rowVal) === Number(paramVal);
            }
            if (typeof paramVal === 'string') {
              return String(rowVal || '').toLowerCase() === paramVal.toLowerCase();
            }
            return Number(rowVal) === Number(paramVal);
          } else if (op === 'LIKE') {
            const cleanPattern = String(paramVal || '').replace(/%/g, '').toLowerCase();
            return String(rowVal || '').toLowerCase().includes(cleanPattern);
          } else if (op === '>=') {
            return String(rowVal) >= String(paramVal);
          } else if (op === '<=') {
            return String(rowVal) <= String(paramVal);
          }
          return true;
        });
      }
    }

    // Process ORDER BY
    if (upper.includes('ORDER BY')) {
      if (upper.includes('CREATED_AT DESC') || upper.includes('DATE DESC')) {
        rows.sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());
      } else if (upper.includes('IS_PINNED DESC')) {
        rows.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
      }
    }

    // Process LIMIT / OFFSET
    if (upper.includes('LIMIT ?')) {
      const limit = Number(params[pIdx++]) || 100;
      let offset = 0;
      if (upper.includes('OFFSET ?')) {
        offset = Number(params[pIdx++]) || 0;
      }
      rows = rows.slice(offset, offset + limit);
    }

    return [rows, []];
  }

  return [[], []];
}

// Unified Database Adapter Pool
const pool = {
  async query<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
    if (isMysqlOnline === true) {
      try {
        return await mysqlPool.query(sql, params) as [T, any];
      } catch (err: any) {
        console.warn('[Database] MySQL query failed, falling back to Local Storage:', err.message);
        isMysqlOnline = false;
        return executeLocalQuery(sql, params);
      }
    } else {
      return executeLocalQuery(sql, params);
    }
  },

  async execute<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
    return this.query<T>(sql, params);
  },

  async getConnection() {
    if (isMysqlOnline === true) {
      return await mysqlPool.getConnection();
    }
    return {
      release: () => {},
      query: (sql: string, params: any[]) => executeLocalQuery(sql, params)
    };
  }
};

export default pool;
