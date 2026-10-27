import 'dart:async';
import 'package:flutter/foundation.dart';
import '../data/repositories/offline_first_repository.dart';
import '../models/transaction_model.dart';
import '../models/category_model.dart';
import '../models/budget_model.dart';

/// Global State Management (Provider) untuk Keuangan & Transaksi
/// Terhubung secara REAKTIF dengan Stream Drift Database (.watch())
class FinanceProvider with ChangeNotifier {
  final OfflineFirstRepository _repository = OfflineFirstRepository();

  List<TransactionModel> _transactions = [];
  List<CategoryModel> _categories = [];
  List<BudgetModel> _budgets = [];

  double _totalBalance = 0.0;
  double _totalIncome = 0.0;
  double _totalExpense = 0.0;
  int _lastFetchedMillis = 0;

  bool _isLoading = false;
  String _activeTypeFilter = 'Semua'; // 'Semua' | 'INCOME' | 'EXPENSE'

  StreamSubscription? _txSub;
  StreamSubscription? _catSub;
  StreamSubscription? _budgetSub;
  StreamSubscription? _summarySub;

  FinanceProvider() {
    _initStreams();
    refreshFromBackend();
  }

  // Getters
  List<TransactionModel> get transactions => _transactions;
  List<CategoryModel> get categories => _categories;
  List<BudgetModel> get budgets => _budgets;

  double get totalBalance => _totalBalance;
  double get totalIncome => _totalIncome;
  double get totalExpense => _totalExpense;
  int get lastFetchedMillis => _lastFetchedMillis;
  DateTime get lastFetchedDate => DateTime.fromMillisecondsSinceEpoch(_lastFetchedMillis);

  bool get isLoading => _isLoading;
  String get activeTypeFilter => _activeTypeFilter;

  /// Daftar transaksi terfilter secara instan di berbagai Screen
  List<TransactionModel> get filteredTransactions {
    if (_activeTypeFilter == 'Semua') {
      return _transactions;
    }
    return _transactions.where((t) => t.type == _activeTypeFilter).toList();
  }

  void setFilter(String filter) {
    _activeTypeFilter = filter;
    notifyListeners();
  }

  /// Langganan ke Reactive Streams dari Drift Database
  void _initStreams() {
    // 1. Reactive Transactions Stream
    _txSub = _repository.watchTransactions().listen((data) {
      _transactions = data;
      notifyListeners();
    });

    // 2. Reactive Categories Stream
    _catSub = _repository.watchCategories().listen((data) {
      _categories = data;
      notifyListeners();
    });

    // 3. Reactive Budgets Stream
    _budgetSub = _repository.watchBudgets().listen((data) {
      _budgets = data;
      notifyListeners();
    });

    // 4. Reactive Wallet Summary Stream
    _summarySub = _repository.watchWalletSummary().listen((summary) {
      _totalBalance = (summary['totalBalance'] as num?)?.toDouble() ?? 0.0;
      _totalIncome = (summary['totalIncome'] as num?)?.toDouble() ?? 0.0;
      _totalExpense = (summary['totalExpense'] as num?)?.toDouble() ?? 0.0;
      _lastFetchedMillis = (summary['lastFetched'] as num?)?.toInt() ?? 0;
      notifyListeners();
    });
  }

  /// Sinkronisasi backend -> Drift database lokal
  Future<void> refreshFromBackend() async {
    _isLoading = true;
    notifyListeners();

    await _repository.syncAll();

    _isLoading = false;
    notifyListeners();
  }

  /// Tambah transaksi secara atomik dan optimistik
  Future<bool> addTransaction({
    required String title,
    required double amount,
    required String type,
    required String categoryId,
    required String categoryName,
    required String categoryIcon,
    required String date,
    String? notes,
  }) async {
    final success = await _repository.createTransaction(
      title: title,
      amount: amount,
      type: type,
      categoryId: categoryId,
      categoryName: categoryName,
      categoryIcon: categoryIcon,
      date: date,
      notes: notes,
    );
    return success;
  }

  @override
  void dispose() {
    _txSub?.cancel();
    _catSub?.cancel();
    _budgetSub?.cancel();
    _summarySub?.cancel();
    super.dispose();
  }
}
