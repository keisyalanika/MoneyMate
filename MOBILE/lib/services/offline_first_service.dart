import 'package:flutter/foundation.dart';
import 'database_service.dart';
import 'api_service.dart';
import 'preferences_service.dart';
import '../models/transaction_model.dart';
import '../models/category_model.dart';
import '../models/budget_model.dart';

/// ============================================================
/// OfflineFirstService — Orchestrator pola Offline-First
/// Mengatur alur: Cache Lokal → API → Simpan ke Cache
///
/// Strategi:
/// 1. BACA dari cache SQLite lokal terlebih dahulu (instan)
/// 2. FETCH dari API di background (async)
/// 3. SIMPAN hasil API ke cache lokal (SQLite + SharedPreferences)
/// 4. UI otomatis ter-update via Drift Stream (reaktif)
/// ============================================================
class OfflineFirstService {
  final AppDatabase _db;
  final PreferencesService _prefs;

  OfflineFirstService(this._db, this._prefs);

  // ===================== SYNC TRANSACTIONS =====================
  Future<void> syncTransactions() async {
    try {
      final apiTransactions = await ApiService.fetchTransactions();
      final now = DateTime.now().millisecondsSinceEpoch;

      final cachedList = apiTransactions.map((tx) => CachedTransaction(
            id: tx.id,
            title: tx.title,
            amount: tx.amount,
            type: tx.type,
            categoryId: tx.categoryId,
            categoryName: tx.categoryName,
            categoryIcon: tx.categoryIcon,
            date: tx.date,
            notes: tx.notes,
            lastFetched: now,
          )).toList();

      await _db.saveTransactionsFromApi(cachedList);
      await _prefs.saveLastSyncTime(now);
      if (kDebugMode) debugPrint('[OfflineFirst] Transactions synced: ${cachedList.length} items');
    } catch (e) {
      if (kDebugMode) debugPrint('[OfflineFirst] Sync transactions failed (offline mode): $e');
    }
  }

  // ===================== SYNC CATEGORIES =====================
  Future<void> syncCategories() async {
    try {
      final apiCategories = await ApiService.fetchCategories();
      final now = DateTime.now().millisecondsSinceEpoch;

      final cachedList = apiCategories.map((cat) => CachedCategory(
            id: cat.id,
            name: cat.name,
            type: cat.type,
            icon: cat.icon,
            color: cat.color,
            lastFetched: now,
          )).toList();

      await _db.saveCategoriesFromApi(cachedList);
      if (kDebugMode) debugPrint('[OfflineFirst] Categories synced: ${cachedList.length} items');
    } catch (e) {
      if (kDebugMode) debugPrint('[OfflineFirst] Sync categories failed (offline mode): $e');
    }
  }

  // ===================== SYNC BUDGETS =====================
  Future<void> syncBudgets() async {
    try {
      final apiBudgets = await ApiService.fetchBudgets();
      final now = DateTime.now().millisecondsSinceEpoch;

      final cachedList = apiBudgets.map((b) => CachedBudget(
            id: b.id,
            categoryId: b.categoryId,
            categoryName: b.categoryName,
            limitAmount: b.limitAmount,
            spentAmount: b.spentAmount,
            percentage: b.percentage,
            lastFetched: now,
          )).toList();

      await _db.saveBudgetsFromApi(cachedList);
      if (kDebugMode) debugPrint('[OfflineFirst] Budgets synced: ${cachedList.length} items');
    } catch (e) {
      if (kDebugMode) debugPrint('[OfflineFirst] Sync budgets failed (offline mode): $e');
    }
  }

  // ===================== SYNC SUMMARY =====================
  Future<void> syncSummary() async {
    try {
      final summary = await ApiService.fetchSummary();
      await _prefs.saveSaldoSnapshot((summary['totalBalance'] ?? 0).toDouble());
      await _prefs.saveIncomeSnapshot((summary['totalIncome'] ?? 0).toDouble());
      await _prefs.saveExpenseSnapshot((summary['totalExpense'] ?? 0).toDouble());
      if (kDebugMode) debugPrint('[OfflineFirst] Summary synced');
    } catch (e) {
      if (kDebugMode) debugPrint('[OfflineFirst] Sync summary failed (offline mode): $e');
    }
  }

  // ===================== SYNC ALL =====================
  Future<void> syncAll() async {
    await Future.wait([
      syncTransactions(),
      syncCategories(),
      syncBudgets(),
      syncSummary(),
    ]);
    await _prefs.saveLastSyncTime(DateTime.now().millisecondsSinceEpoch);
  }

  // ===================== ADD TRANSACTION (OFFLINE-FIRST) =====================
  Future<bool> addTransactionOfflineFirst(Map<String, dynamic> payload) async {
    final now = DateTime.now();
    final localId = 'local-${now.millisecondsSinceEpoch}';

    // 1. Simpan ke cache lokal DULU (instan)
    final localTx = CachedTransaction(
      id: localId,
      title: payload['title'] ?? 'Transaksi',
      amount: (payload['amount'] as num).toDouble(),
      type: payload['type'] ?? 'EXPENSE',
      categoryId: payload['categoryId'] ?? '',
      categoryName: payload['categoryName'] ?? 'Lainnya',
      categoryIcon: payload['categoryIcon'] ?? 'tag',
      date: now.toIso8601String(),
      notes: payload['notes'],
      lastFetched: now.millisecondsSinceEpoch,
    );
    await _db.insertTransaction(localTx);

    // 2. Coba kirim ke API di background
    final success = await ApiService.addTransaction(payload);
    if (success) {
      // Sync ulang agar ID dari server ter-update
      await syncTransactions();
    }
    return true; // Selalu sukses karena sudah disimpan lokal
  }

  // ===================== HELPER: Get dari cache =====================
  Future<List<TransactionModel>> getCachedTransactions() async {
    final cached = await _db.getAllTransactions();
    return cached.map((c) => TransactionModel(
          id: c.id,
          title: c.title,
          amount: c.amount,
          type: c.type,
          categoryId: c.categoryId,
          categoryName: c.categoryName,
          categoryIcon: c.categoryIcon,
          date: c.date,
          notes: c.notes,
        )).toList();
  }

  Future<List<CategoryModel>> getCachedCategories() async {
    final cached = await _db.getAllCategories();
    return cached.map((c) => CategoryModel(
          id: c.id,
          name: c.name,
          type: c.type,
          icon: c.icon,
          color: c.color,
        )).toList();
  }

  Future<List<BudgetModel>> getCachedBudgets() async {
    final cached = await _db.getAllBudgets();
    return cached.map((c) => BudgetModel(
          id: c.id,
          categoryId: c.categoryId,
          categoryName: c.categoryName,
          limitAmount: c.limitAmount,
          spentAmount: c.spentAmount,
          percentage: c.percentage,
        )).toList();
  }
}
