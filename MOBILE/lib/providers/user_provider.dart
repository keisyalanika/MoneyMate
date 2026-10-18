import 'package:flutter/material.dart';
import '../services/database_service.dart';

/// ============================================================
/// UserProvider — State Management untuk data pengguna
/// Menggunakan Stream reaktif dari Drift agar UI auto-update
/// ============================================================
class UserProvider extends ChangeNotifier {
  final AppDatabase _db;

  UserProvider(this._db);

  // Stream reaktif dari Drift — UI otomatis ter-update saat DB berubah
  Stream<List<AppUser>> get usersStream => _db.watchAllUsers();

  // Fetch data dari Backend lalu simpan ke DB lokal (Database Transaction)
  Future<void> fetchAndSaveUsers() async {
    final fetchedDataFromApi = [
      AppUser(
        id: 1,
        name: 'Keisya Lanika',
        email: 'keisya@moneymate.com',
        lastFetched: DateTime.now().millisecondsSinceEpoch,
      ),
      AppUser(
        id: 2,
        name: 'Budi Santoso',
        email: 'budi@moneymate.com',
        lastFetched: DateTime.now().millisecondsSinceEpoch,
      ),
    ];

    await _db.saveUsersFromApi(fetchedDataFromApi);
    // Karena .watch() dari Drift, tidak perlu notifyListeners()
  }
}
