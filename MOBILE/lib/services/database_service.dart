import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'database_service.g.dart';

// ============================================================
// TABEL 1: AppUsers — Data profil pengguna (structured/relational)
// Tipe Storage: SQLite (Drift) — cocok untuk data relational yang
// perlu di-query, di-join, dan diakses secara offline.
// ============================================================
class AppUsers extends Table {
  IntColumn get id => integer()();
  TextColumn get name => text()();
  TextColumn get email => text()();
  IntColumn get lastFetched => integer()(); // epoch millis — penanda cache
  @override
  Set<Column> get primaryKey => {id};
}

// ============================================================
// TABEL 2: CachedTransactions — Cache transaksi dari API
// Tipe Storage: SQLite (Drift) — data tabular besar yang perlu
// filter, sort, dan aggregate query secara offline.
// ============================================================
class CachedTransactions extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
  RealColumn get amount => real()();
  TextColumn get type => text()(); // INCOME | EXPENSE
  TextColumn get categoryId => text().withDefault(const Constant(''))();
  TextColumn get categoryName =>
      text().withDefault(const Constant('Lainnya'))();
  TextColumn get categoryIcon => text().withDefault(const Constant('tag'))();
  TextColumn get date => text()();
  TextColumn get notes => text().nullable()();
  IntColumn get lastFetched => integer()();
  @override
  Set<Column> get primaryKey => {id};
}

// ============================================================
// TABEL 3: CachedCategories — Cache kategori transaksi
// Tipe Storage: SQLite (Drift) — data referensi statis yang
// perlu diakses cepat tanpa koneksi internet.
// ============================================================
class CachedCategories extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get type => text()(); // INCOME | EXPENSE
  TextColumn get icon => text()();
  TextColumn get color => text()();
  IntColumn get lastFetched => integer()();
  @override
  Set<Column> get primaryKey => {id};
}

// ============================================================
// TABEL 4: CachedBudgets — Cache data anggaran
// Tipe Storage: SQLite (Drift) — data numerik yang perlu
// di-aggregate (SUM, AVG) untuk reporting offline.
// ============================================================
class CachedBudgets extends Table {
  TextColumn get id => text()();
  TextColumn get categoryId => text()();
  TextColumn get categoryName => text()();
  RealColumn get limitAmount => real()();
  RealColumn get spentAmount => real()();
  RealColumn get percentage => real()();
  IntColumn get lastFetched => integer()();
  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(
    tables: [AppUsers, CachedTransactions, CachedCategories, CachedBudgets])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // ======================== USERS ========================
  // Stream reaktif: UI otomatis update saat data berubah
  Stream<List<AppUser>> watchAllUsers() => select(appUsers).watch();

  Future<List<AppUser>> getAllUsers() => select(appUsers).get();

  // Database Transaction: Penulisan batch data dari API
  Future<void> saveUsersFromApi(List<AppUser> usersFromApi) async {
    await transaction(() async {
      for (final user in usersFromApi) {
        await into(appUsers).insert(user, mode: InsertMode.insertOrReplace);
      }
    });
  }

  Future<void> clearUsers() => delete(appUsers).go();

  // ======================== TRANSACTIONS ========================
  Stream<List<CachedTransaction>> watchAllTransactions() {
    return (select(cachedTransactions)
          ..orderBy([(t) => OrderingTerm.desc(t.date)]))
        .watch();
  }

  Future<List<CachedTransaction>> getAllTransactions() {
    return (select(cachedTransactions)
          ..orderBy([(t) => OrderingTerm.desc(t.date)]))
        .get();
  }

  Future<void> saveTransactionsFromApi(List<CachedTransaction> txList) async {
    await transaction(() async {
      for (final tx in txList) {
        await into(cachedTransactions)
            .insert(tx, mode: InsertMode.insertOrReplace);
      }
    });
  }

  Future<void> insertTransaction(CachedTransaction tx) async {
    await into(cachedTransactions).insert(tx, mode: InsertMode.insertOrReplace);
  }

  Future<void> deleteTransaction(String txId) async {
    await (delete(cachedTransactions)..where((t) => t.id.equals(txId))).go();
  }

  Future<void> clearTransactions() => delete(cachedTransactions).go();

  // ======================== CATEGORIES ========================
  Stream<List<CachedCategory>> watchAllCategories() =>
      select(cachedCategories).watch();

  Future<List<CachedCategory>> getAllCategories() =>
      select(cachedCategories).get();

  Future<void> saveCategoriesFromApi(List<CachedCategory> cats) async {
    await transaction(() async {
      for (final cat in cats) {
        await into(cachedCategories)
            .insert(cat, mode: InsertMode.insertOrReplace);
      }
    });
  }

  Future<void> clearCategories() => delete(cachedCategories).go();

  // ======================== BUDGETS ========================
  Stream<List<CachedBudget>> watchAllBudgets() => select(cachedBudgets).watch();

  Future<List<CachedBudget>> getAllBudgets() => select(cachedBudgets).get();

  Future<void> saveBudgetsFromApi(List<CachedBudget> budgets) async {
    await transaction(() async {
      for (final b in budgets) {
        await into(cachedBudgets).insert(b, mode: InsertMode.insertOrReplace);
      }
    });
  }

  Future<void> clearBudgets() => delete(cachedBudgets).go();

  // ======================== CLEAR ALL ========================
  Future<void> clearAllCache() async {
    await transaction(() async {
      await clearUsers();
      await clearTransactions();
      await clearCategories();
      await clearBudgets();
    });
  }
}

// Membuka koneksi SQLite
LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'moneymate_db.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
