import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Service khusus untuk menyimpan DATA SENSITIF & KREDENSIAL PENGGUNA.
/// Menggunakan package `flutter_secure_storage` (iOS Keychain / Android EncryptedSharedPreferences).
/// 
/// ATURAN KETAT:
/// - DILARANG menyimpan token/kredensial ke dalam SharedPreferences.
/// - Semua access token, refresh token, dan kredensial wajib disimpan lewat service ini.
class SecureStorageService {
  static final SecureStorageService _instance = SecureStorageService._internal();
  factory SecureStorageService() => _instance;
  SecureStorageService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const String _keyToken = 'auth_token';
  static const String _keyRefreshToken = 'refresh_token';
  static const String _keyUserEmail = 'user_email';
  static const String _keyUserName = 'user_name';
  static const String _keyUserRole = 'user_role';

  /// Simpan sesi autentikasi secara aman terenkripsi
  Future<void> saveAuthSession({
    required String token,
    String? refreshToken,
    required String email,
    required String name,
    required String role,
  }) async {
    await _storage.write(key: _keyToken, value: token);
    if (refreshToken != null) {
      await _storage.write(key: _keyRefreshToken, value: refreshToken);
    }
    await _storage.write(key: _keyUserEmail, value: email);
    await _storage.write(key: _keyUserName, value: name);
    await _storage.write(key: _keyUserRole, value: role);
  }

  /// Ambil access token
  Future<String?> getToken() => _storage.read(key: _keyToken);

  /// Ambil refresh token
  Future<String?> getRefreshToken() => _storage.read(key: _keyRefreshToken);

  /// Ambil email pengguna
  Future<String?> getUserEmail() => _storage.read(key: _keyUserEmail);

  /// Ambil nama pengguna
  Future<String?> getUserName() => _storage.read(key: _keyUserName);

  /// Ambil role pengguna
  Future<String?> getUserRole() => _storage.read(key: _keyUserRole);

  /// Hapus seluruh sesi autentikasi & kredensial (misal saat logout)
  Future<void> clearAuthSession() async {
    await _storage.delete(key: _keyToken);
    await _storage.delete(key: _keyRefreshToken);
    await _storage.delete(key: _keyUserEmail);
    await _storage.delete(key: _keyUserName);
    await _storage.delete(key: _keyUserRole);
  }
}
