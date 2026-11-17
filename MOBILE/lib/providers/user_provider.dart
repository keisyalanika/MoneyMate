import 'package:flutter/material.dart';
import '../services/api_service.dart';
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
    final users = await ApiService.fetchUsers();
    final fetchedDataFromApi = users.map((user) {
      return AppUser(
        id: (user['id'] as num?)?.toInt() ?? 0,
        name: (user['name'] ?? '-').toString(),
        email: (user['email'] ?? '-').toString(),
        lastFetched: DateTime.now().millisecondsSinceEpoch,
      );
    }).toList();

    await _db.clearUsers();
    await _db.saveUsersFromApi(fetchedDataFromApi);
  }
}
