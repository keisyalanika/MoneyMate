import 'package:flutter/material.dart';
import '../services/database_service.dart';
import '../services/offline_first_service.dart';
import '../services/preferences_service.dart';
import '../models/transaction_model.dart';
import '../models/category_model.dart';
import '../models/budget_model.dart';

/// ============================================================
/// DataProvider — State Management utama untuk data keuangan
/// Mengintegrasikan offline-first sync dengan UI state
/// ============================================================
class DataProvider extends ChangeNotifier {
  final AppDatabase db;
  final OfflineFirstService offlineService;
  final PreferencesService prefs;

  bool _isSyncing = false;
  String _syncStatus = 'idle';

  DataProvider({
    required this.db,
    required this.offlineService,
    required this.prefs,
  });

  bool get isSyncing => _isSyncing;
  String get syncStatus => _syncStatus;

  // ========= REACTIVE STREAMS dari Drift (Auto-Update UI) =========
  Stream<List<CachedTransaction>> get transactionsStream => db.watchAllTransactions();
  Stream<List<CachedCategory>> get categoriesStream => db.watchAllCategories();
  Stream<List<CachedBudget>> get budgetsStream => db.watchAllBudgets();
  Stream<List<AppUser>> get usersStream => db.watchAllUsers();

  // ========= FINANCIAL SNAPSHOT dari SharedPreferences =========
  double get saldoSnapshot => prefs.getSaldoSnapshot();
  double get incomeSnapshot => prefs.getIncomeSnapshot();
  double get expenseSnapshot => prefs.getExpenseSnapshot();
  String get lastSyncFormatted => prefs.getLastSyncFormatted();
  int get lastSyncTime => prefs.getLastSyncTime();

  // ========= SYNC ALL DATA (Offline-First) =========
  Future<void> syncAllData() async {
    _isSyncing = true;
    _syncStatus = 'Menyinkronkan data...';
    notifyListeners();

    try {
      await offlineService.syncAll();
      _syncStatus = 'Sinkronisasi berhasil!';
    } catch (e) {
      _syncStatus = 'Gagal sinkron. Data lokal tetap tersedia.';
    }

    _isSyncing = false;
    notifyListeners();
  }

  // ========= SYNC INDIVIDUAL =========
  Future<void> syncTransactions() async {
    _isSyncing = true;
    notifyListeners();
    await offlineService.syncTransactions();
    _isSyncing = false;
    notifyListeners();
  }

  Future<void> syncCategories() async {
    _isSyncing = true;
    notifyListeners();
    await offlineService.syncCategories();
    _isSyncing = false;
    notifyListeners();
  }

  Future<void> syncBudgets() async {
    _isSyncing = true;
    notifyListeners();
    await offlineService.syncBudgets();
    _isSyncing = false;
    notifyListeners();
  }

  // ========= ADD TRANSACTION (OFFLINE-FIRST) =========
  Future<bool> addTransaction(Map<String, dynamic> payload) async {
    return await offlineService.addTransactionOfflineFirst(payload);
  }

  // ========= GET CACHED DATA =========
  Future<List<TransactionModel>> getCachedTransactions() =>
      offlineService.getCachedTransactions();

  Future<List<CategoryModel>> getCachedCategories() =>
      offlineService.getCachedCategories();

  Future<List<BudgetModel>> getCachedBudgets() =>
      offlineService.getCachedBudgets();

  // ========= STORAGE INFO =========
  Future<Map<String, int>> getStorageStats() async {
    final txCount = (await db.getAllTransactions()).length;
    final catCount = (await db.getAllCategories()).length;
    final budgetCount = (await db.getAllBudgets()).length;
    final userCount = (await db.getAllUsers()).length;
    return {
      'transactions': txCount,
      'categories': catCount,
      'budgets': budgetCount,
      'users': userCount,
      'total': txCount + catCount + budgetCount + userCount,
    };
  }

  // ========= CLEAR CACHE =========
  Future<void> clearAllCache() async {
    await db.clearAllCache();
    await prefs.saveLastSyncTime(0);
    notifyListeners();
  }
}
