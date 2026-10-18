import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// ============================================================
/// SecureStorageService — Penyimpanan data SENSITIF (Encrypted)
/// Tipe Storage: Flutter Secure Storage (Keychain iOS / Keystore Android)
/// Cocok untuk: token akses, refresh token, PIN, kunci enkripsi
/// Data dienkripsi secara otomatis oleh platform OS
/// ============================================================
class SecureStorageService {
  static SecureStorageService? _instance;
  final FlutterSecureStorage _storage;

  SecureStorageService._()
      : _storage = const FlutterSecureStorage(
          aOptions: AndroidOptions(resetOnError: true),
        );

  static SecureStorageService getInstance() {
    _instance ??= SecureStorageService._();
    return _instance!;
  }

  // =============== ACCESS TOKEN ===============
  Future<void> saveAccessToken(String token) async {
    await _storage.write(key: 'access_token', value: token);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: 'access_token');
  }

  Future<void> deleteAccessToken() async {
    await _storage.delete(key: 'access_token');
  }

  // =============== REFRESH TOKEN ===============
  Future<void> saveRefreshToken(String token) async {
    await _storage.write(key: 'refresh_token', value: token);
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: 'refresh_token');
  }

  Future<void> deleteRefreshToken() async {
    await _storage.delete(key: 'refresh_token');
  }

  // =============== USER ID ===============
  Future<void> saveUserId(String userId) async {
    await _storage.write(key: 'user_id', value: userId);
  }

  Future<String?> getUserId() async {
    return await _storage.read(key: 'user_id');
  }

  // =============== PIN / BIOMETRIC FLAG ===============
  Future<void> savePin(String pin) async {
    await _storage.write(key: 'user_pin', value: pin);
  }

  Future<String?> getPin() async {
    return await _storage.read(key: 'user_pin');
  }

  Future<void> setBiometricEnabled(bool enabled) async {
    await _storage.write(key: 'biometric_enabled', value: enabled.toString());
  }

  Future<bool> isBiometricEnabled() async {
    final val = await _storage.read(key: 'biometric_enabled');
    return val == 'true';
  }

  // =============== SESSION STATUS ===============
  Future<bool> hasActiveSession() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }

  // =============== CLEAR ALL (LOGOUT) ===============
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
