import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'app_database.g.dart';

class Transactions extends Table {
  // Primary Key unik transaksi dari server
  TextColumn get id => text()();
  TextColumn get title => text()();
  RealColumn get amount => real()();
  TextColumn get type => text()(); // 'INCOME' | 'EXPENSE'
  TextColumn get categoryId => text()();
  TextColumn get categoryName => text()();
  TextColumn get categoryIcon => text()();
  TextColumn get date => text()();
  TextColumn get notes => text().nullable()();

  IntColumn get lastFetched => integer()();
  IntColumn get updatedAt => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [Transactions])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  Stream<List<Transaction>> watchAllTransactions() {
    return (select(transactions)
          ..orderBy([
            (t) => OrderingTerm(expression: t.updatedAt, mode: OrderingMode.desc)
          ]))
        .watch();
  }

  // Ambil data satu kali (One-off Query)
  Future<List<Transaction>> getAllTransactions() => select(transactions).get();

  Future<void> cacheTransactionsFromBackend(List<Map<String, dynamic>> remoteList) async {
    final nowUtcMillis = DateTime.now().toUtc().millisecondsSinceEpoch;

    // Membuka blok transaksi atomik
    await transaction(() async {
      for (final item in remoteList) {
        await into(transactions).insertOnConflictUpdate(
          TransactionsCompanion(
            id: Value(item['id']?.toString() ?? ''),
            title: Value(item['note'] ?? item['title'] ?? 'Transaksi'),
            amount: Value((item['amount'] as num).toDouble()),
            type: Value(item['type']?.toString().toUpperCase() ?? 'EXPENSE'),
            categoryId: Value((item['category_id'] ?? item['categoryId'])?.toString() ?? ''),
            categoryName: Value(item['category_name'] ?? item['categoryName'] ?? 'Lainnya'),
            categoryIcon: Value(item['category_icon'] ?? item['categoryIcon'] ?? 'tag'),
            date: Value(item['date']?.toString() ?? ''),
            notes: Value(item['note'] ?? item['notes']),
            // Set penanda cache waktu terkini (UTC millis)
            lastFetched: Value(nowUtcMillis),
            updatedAt: Value(nowUtcMillis),
          ),
        );
      }
    });
  }

  // Hapus semua data cache lokal (misalnya saat logout)
  Future<void> clearAllCache() async {
    await delete(transactions).go();
  }
}

// Helper koneksi file database lokal di storage perangkat
LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'moneymate_local.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
