import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  // Konfigurasi enkripsi hardware platform
  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
      resetOnError: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock,
    ),
  );

  // Key penyimpanan rahasia
  static const String _keyAccessToken = 'auth_jwt_access_token';
  static const String _keyRefreshToken = 'auth_jwt_refresh_token';
  static const String _keyUserId = 'auth_logged_in_user_id';
  static const String _keyUserPin = 'auth_security_pin';

  // 1. Simpan & Baca Access Token (JWT)
  static Future<void> saveAccessToken(String token) async {
    await _storage.write(key: _keyAccessToken, value: token);
  }

  static Future<String?> getAccessToken() async {
    return await _storage.read(key: _keyAccessToken);
  }

  // 2. Simpan & Baca Refresh Token
  static Future<void> saveRefreshToken(String token) async {
    await _storage.write(key: _keyRefreshToken, value: token);
  }

  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _keyRefreshToken);
  }

  // 3. Simpan & Baca User ID Kredensial
  static Future<void> saveUserId(String userId) async {
    await _storage.write(key: _keyUserId, value: userId);
  }

  static Future<String?> getUserId() async {
    return await _storage.read(key: _keyUserId);
  }

  // 4. Simpan PIN Transaksi / Keamanan
  static Future<void> saveUserPin(String pin) async {
    await _storage.write(key: _keyUserPin, value: pin);
  }

  static Future<String?> getUserPin() async {
    return await _storage.read(key: _keyUserPin);
  }

  // 5. Hapus Seluruh Kredensial Rahasia Saat Logout
  static Future<void> clearAllSecrets() async {
    await _storage.delete(key: _keyAccessToken);
    await _storage.delete(key: _keyRefreshToken);
    await _storage.delete(key: _keyUserId);
    await _storage.delete(key: _keyUserPin);
  }
}
