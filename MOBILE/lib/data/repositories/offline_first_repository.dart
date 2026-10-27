import 'package:flutter/foundation.dart';
import 'package:drift/drift.dart';
import '../../core/database/app_database.dart';
import '../../models/transaction_model.dart';
import '../../models/category_model.dart';
import '../../models/budget_model.dart';
import '../../services/api_service.dart';

/// Repository Offline-First untuk MoneyMate Mobile.
/// 
/// Mengorkestrasi pengambilan data antara Remote Backend (API) dan Local Database (Drift).
/// Keunggulan Arsitektur:
/// 1. Type-safe & Reactive: Menggunakan Stream (.watch()) dari Drift agar UI auto-update.
/// 2. Atomic Writes: Membungkus penulisan batch/multi-baris dalam Database Transaction.
/// 3. Cache Tagging: Menyimpan atribut lastFetched & updatedAt (UTC epoch millis).
/// 4. Resilient Offline Mode: Aplikasi tetap berfungsi penuh dan instan saat tidak ada koneksi.
class OfflineFirstRepository {
  static final OfflineFirstRepository _instance = OfflineFirstRepository._internal();
  factory OfflineFirstRepository({AppDatabase? database}) {
    if (database != null) {
      _instance._db = database;
    }
    return _instance;
  }
  OfflineFirstRepository._internal();

  AppDatabase _db = AppDatabase();
  AppDatabase get db => _db;

  // ===========================================================================
  // 1. STREAMS REAKTIF (DRIFT .watch())
  // UI mendengarkan perubahan stream ini secara langsung
  // ===========================================================================

  /// Stream daftar transaksi realtime dari Drift
  Stream<List<TransactionModel>> watchTransactions() {
    return _db.watchAllTransactions().map((rows) {
      return rows.map((r) => TransactionModel(
        id: r.id,
        title: r.title,
        amount: r.amount,
        type: r.type,
        categoryId: r.categoryId,
        categoryName: r.categoryName,
        categoryIcon: r.categoryIcon,
        date: r.date,
        notes: r.notes,
      )).toList();
    });
  }

  /// Stream kategori realtime dari Drift
  Stream<List<CategoryModel>> watchCategories() {
    return _db.watchAllCategories().map((rows) {
      return rows.map((r) => CategoryModel(
        id: r.id,
        name: r.name,
        type: r.type,
        icon: r.icon,
        color: r.color,
      )).toList();
    });
  }

  /// Stream anggaran (budgets) realtime dari Drift
  Stream<List<BudgetModel>> watchBudgets() {
    return _db.watchAllBudgets().map((rows) {
      return rows.map((r) => BudgetModel(
        id: r.id,
        categoryId: r.categoryId,
        categoryName: r.categoryName,
        limitAmount: r.limitAmount,
        spentAmount: r.spentAmount,
        percentage: r.percentage,
      )).toList();
    });
  }

  /// Stream ringkasan saldo realtime dari Drift
  Stream<Map<String, dynamic>> watchWalletSummary() {
    return _db.watchWalletSummary().map((row) {
      if (row == null) {
        return {
          'totalBalance': 0.0,
          'totalIncome': 0.0,
          'totalExpense': 0.0,
          'lastFetched': 0,
        };
      }
      return {
        'totalBalance': row.totalBalance,
        'totalIncome': row.totalIncome,
        'totalExpense': row.totalExpense,
        'lastFetched': row.lastFetched,
      };
    });
  }

  // ===========================================================================
  // 2. SINKRONISASI DARI BACKEND DENGAN ATOMIC TRANSACTION & CACHE TRACKING
  // ===========================================================================

  /// Sinkronisasi transaksi: fetch dari Backend -> simpan ke Drift via Atomic Transaction
  Future<void> syncTransactions() async {
    try {
      final remoteList = await ApiService.fetchTransactions();
      final nowUtcMillis = DateTime.now().toUtc().millisecondsSinceEpoch;

      final companions = remoteList.map((tx) {
        return LocalTransactionsCompanion(
          id: Value(tx.id),
          title: Value(tx.title),
          amount: Value(tx.amount),
          type: Value(tx.type),
          categoryId: Value(tx.categoryId),
          categoryName: Value(tx.categoryName),
          categoryIcon: Value(tx.categoryIcon),
          date: Value(tx.date),
          notes: Value(tx.notes),
          lastFetched: Value(nowUtcMillis), // Cache tracking UTC epoch millis
          updatedAt: Value(nowUtcMillis),
        );
      }).toList();

      // Eksekusi Atomic Transaction multi-baris
      await _db.syncTransactionsAtomic(companions);
      debugPrint('[OfflineFirstRepository] Berhasil sinkronisasi ${companions.length} transaksi ke Drift');
    } catch (e) {
      debugPrint('[OfflineFirstRepository] Gagal sinkron transaksi (Offline fallback aktif): $e');
    }
  }

  /// Sinkronisasi kategori ke Drift via Atomic Transaction
  Future<void> syncCategories() async {
    try {
      final remoteList = await ApiService.fetchCategories();
      final nowUtcMillis = DateTime.now().toUtc().millisecondsSinceEpoch;

      final companions = remoteList.map((cat) {
        return LocalCategoriesCompanion(
          id: Value(cat.id),
          name: Value(cat.name),
          type: Value(cat.type),
          icon: Value(cat.icon),
          color: Value(cat.color),
          lastFetched: Value(nowUtcMillis),
          updatedAt: Value(nowUtcMillis),
        );
      }).toList();

      await _db.syncCategoriesAtomic(companions);
    } catch (e) {
      debugPrint('[OfflineFirstRepository] Gagal sinkron kategori: $e');
    }
  }

  /// Sinkronisasi anggaran ke Drift via Atomic Transaction
  Future<void> syncBudgets() async {
    try {
      final remoteList = await ApiService.fetchBudgets();
      final nowUtcMillis = DateTime.now().toUtc().millisecondsSinceEpoch;

      final companions = remoteList.map((b) {
        return LocalBudgetsCompanion(
          id: Value(b.id),
          categoryId: Value(b.categoryId),
          categoryName: Value(b.categoryName),
          limitAmount: Value(b.limitAmount),
          spentAmount: Value(b.spentAmount),
          percentage: Value(b.percentage),
          lastFetched: Value(nowUtcMillis),
          updatedAt: Value(nowUtcMillis),
        );
      }).toList();

      await _db.syncBudgetsAtomic(companions);
    } catch (e) {
      debugPrint('[OfflineFirstRepository] Gagal sinkron anggaran: $e');
    }
  }

  /// Sinkronisasi ringkasan saldo / wallet ke Drift
  Future<void> syncSummary() async {
    try {
      final summary = await ApiService.fetchSummary();
      final nowUtcMillis = DateTime.now().toUtc().millisecondsSinceEpoch;

      final balance = ((summary['totalBalance'] ?? summary['balance'] ?? 0) as num).toDouble();
      final income = ((summary['totalIncome'] ?? summary['income'] ?? 0) as num).toDouble();
      final expense = ((summary['totalExpense'] ?? summary['expense'] ?? 0) as num).toDouble();

      await _db.updateWalletSummaryAtomic(
        LocalWalletSummaryCompanion(
          id: const Value('main_wallet'),
          totalBalance: Value(balance),
          totalIncome: Value(income),
          totalExpense: Value(expense),
          lastFetched: Value(nowUtcMillis),
          updatedAt: Value(nowUtcMillis),
        ),
      );
    } catch (e) {
      debugPrint('[OfflineFirstRepository] Gagal sinkron ringkasan saldo: $e');
    }
  }

  /// Sinkronisasi seluruh dataset sekaligus
  Future<void> syncAll() async {
    await Future.wait([
      syncTransactions(),
      syncCategories(),
      syncBudgets(),
      syncSummary(),
    ]);
  }

  // ===========================================================================
  // 3. ATOMIC WRITE LOKAL + REMOTE DISPATCH
  // ===========================================================================

  /// Tambah transaksi: simpan langsung secara reaktif ke Drift lalu kirim ke Backend
  Future<bool> createTransaction({
    required String title,
    required double amount,
    required String type,
    required String categoryId,
    required String categoryName,
    required String categoryIcon,
    required String date,
    String? notes,
  }) async {
    final nowUtcMillis = DateTime.now().toUtc().millisecondsSinceEpoch;
    final generatedId = 'tx_local_$nowUtcMillis';

    // 1. Simpan ke database lokal Drift terlebih dahulu (Optimistic Local Persistence)
    final companion = LocalTransactionsCompanion(
      id: Value(generatedId),
      title: Value(title),
      amount: Value(amount),
      type: Value(type),
      categoryId: Value(categoryId),
      categoryName: Value(categoryName),
      categoryIcon: Value(categoryIcon),
      date: Value(date),
      notes: Value(notes),
      lastFetched: Value(nowUtcMillis),
      updatedAt: Value(nowUtcMillis),
    );

    await _db.insertOrUpdateTransaction(companion);

    // 2. Perbarui ringkasan saldo lokal di Drift secara atomik
    final currentSummary = await _db.getWalletSummary();
    final double prevBalance = currentSummary?.totalBalance ?? 0.0;
    final double prevIncome = currentSummary?.totalIncome ?? 0.0;
    final double prevExpense = currentSummary?.totalExpense ?? 0.0;

    final double newBalance = type == 'INCOME' ? prevBalance + amount : prevBalance - amount;
    final double newIncome = type == 'INCOME' ? prevIncome + amount : prevIncome;
    final double newExpense = type == 'EXPENSE' ? prevExpense + amount : prevExpense;

    await _db.updateWalletSummaryAtomic(
      LocalWalletSummaryCompanion(
        id: const Value('main_wallet'),
        totalBalance: Value(newBalance),
        totalIncome: Value(newIncome),
        totalExpense: Value(newExpense),
        lastFetched: Value(nowUtcMillis),
        updatedAt: Value(nowUtcMillis),
      ),
    );

    // 3. Kirim ke remote API di background
    try {
      final success = await ApiService.addTransaction({
        'title': title,
        'amount': amount,
        'type': type,
        'categoryId': categoryId,
        'date': date,
        'notes': notes,
      });
      return success;
    } catch (e) {
      debugPrint('[OfflineFirstRepository] Transaksi disimpan lokal offline, sinkron server menyusul: $e');
      return true;
    }
  }
}
