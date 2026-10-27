import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'app_database.g.dart';

/// 1. Tabel Transaksi Lokal
@DataClassName('LocalTransaction')
class LocalTransactions extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
  RealColumn get amount => real()();
  TextColumn get type => text()(); // 'INCOME' | 'EXPENSE'
  TextColumn get categoryId => text()();
  TextColumn get categoryName => text()();
  TextColumn get categoryIcon => text()();
  TextColumn get date => text()();
  TextColumn get notes => text().nullable()();

  // Atribut penanda cache sesuai requirement
  IntColumn get lastFetched => integer()(); // UTC epoch millis
  IntColumn get updatedAt => integer()();   // UTC epoch millis

  @override
  Set<Column> get primaryKey => {id};
}

/// 2. Tabel Kategori Lokal
@DataClassName('LocalCategory')
class LocalCategories extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get type => text()(); // 'INCOME' | 'EXPENSE'
  TextColumn get icon => text()();
  TextColumn get color => text()();

  // Atribut penanda cache
  IntColumn get lastFetched => integer()();
  IntColumn get updatedAt => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// 3. Tabel Anggaran (Budget) Lokal
@DataClassName('LocalBudget')
class LocalBudgets extends Table {
  TextColumn get id => text()();
  TextColumn get categoryId => text()();
  TextColumn get categoryName => text()();
  RealColumn get limitAmount => real()();
  RealColumn get spentAmount => real()();
  RealColumn get percentage => real()();

  // Atribut penanda cache
  IntColumn get lastFetched => integer()();
  IntColumn get updatedAt => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// 4. Tabel Ringkasan Dompet / Saldo Lokal
@DataClassName('LocalWalletSummaryData')
class LocalWalletSummary extends Table {
  TextColumn get id => text()(); // e.g. 'main_wallet'
  RealColumn get totalBalance => real()();
  RealColumn get totalIncome => real()();
  RealColumn get totalExpense => real()();

  // Atribut penanda cache
  IntColumn get lastFetched => integer()();
  IntColumn get updatedAt => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [
  LocalTransactions,
  LocalCategories,
  LocalBudgets,
  LocalWalletSummary,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? e]) : super(e ?? _openConnection());

  @override
  int get schemaVersion => 1;

  // ==========================================
  // Fitur Stream Reaktif (Metode .watch() Drift)
  // Memastikan UI langsung terupdate otomatis saat ada perubahan data lokal
  // ==========================================
  Stream<List<LocalTransaction>> watchAllTransactions() {
    return (select(localTransactions)
          ..orderBy([
            (t) => OrderingTerm(expression: t.date, mode: OrderingMode.desc),
            (t) => OrderingTerm(expression: t.updatedAt, mode: OrderingMode.desc),
          ]))
        .watch();
  }

  Stream<List<LocalCategory>> watchAllCategories() {
    return (select(localCategories)..orderBy([(t) => OrderingTerm.asc(t.name)])).watch();
  }

  Stream<List<LocalBudget>> watchAllBudgets() {
    return select(localBudgets).watch();
  }

  Stream<LocalWalletSummaryData?> watchWalletSummary() {
    return (select(localWalletSummary)..where((tbl) => tbl.id.equals('main_wallet')))
        .watchSingleOrNull();
  }

  // ==========================================
  // Operasi Get Sekali Baca (Future)
  // ==========================================
  Future<List<LocalTransaction>> getAllTransactions() => select(localTransactions).get();
  Future<List<LocalCategory>> getAllCategories() => select(localCategories).get();
  Future<List<LocalBudget>> getAllBudgets() => select(localBudgets).get();
  Future<LocalWalletSummaryData?> getWalletSummary() =>
      (select(localWalletSummary)..where((tbl) => tbl.id.equals('main_wallet'))).getSingleOrNull();

  // ==========================================
  // Database Transaction untuk Operasi Penulisan Multi-baris Atomik
  // (Atomic Write mencegah kerusakan integritas data saat penulisan list API)
  // ==========================================
  Future<void> syncTransactionsAtomic(List<LocalTransactionsCompanion> items) {
    return transaction(() async {
      for (final item in items) {
        await into(localTransactions).insertOnConflictUpdate(item);
      }
    });
  }

  Future<void> syncCategoriesAtomic(List<LocalCategoriesCompanion> items) {
    return transaction(() async {
      for (final item in items) {
        await into(localCategories).insertOnConflictUpdate(item);
      }
    });
  }

  Future<void> syncBudgetsAtomic(List<LocalBudgetsCompanion> items) {
    return transaction(() async {
      for (final item in items) {
        await into(localBudgets).insertOnConflictUpdate(item);
      }
    });
  }

  Future<void> updateWalletSummaryAtomic(LocalWalletSummaryCompanion summary) {
    return transaction(() async {
      await into(localWalletSummary).insertOnConflictUpdate(summary);
    });
  }

  // Operasi CRUD satuan
  Future<int> insertOrUpdateTransaction(LocalTransactionsCompanion item) {
    return into(localTransactions).insertOnConflictUpdate(item);
  }

  Future<int> deleteTransactionById(String id) {
    return (delete(localTransactions)..where((tbl) => tbl.id.equals(id))).go();
  }

  Future<void> clearAllData() {
    return transaction(() async {
      await delete(localTransactions).go();
      await delete(localCategories).go();
      await delete(localBudgets).go();
      await delete(localWalletSummary).go();
    });
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'moneymate_offline.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
