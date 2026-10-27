import 'package:shared_preferences/shared_preferences.dart';

/// Service untuk data PENGATURAN (Settings) & PREFERENSI aplikasi yang KECIL dan NON-SENSITIF.
/// Menggunakan package `shared_preferences`.
/// 
/// CATATAN PENTING:
/// Sesuai requirement, DILARANG KERAS menyimpan access token, refresh token,
/// atau kredensial pengguna di shared_preferences! Gunakan `SecureStorageService`.
class PreferencesService {
  static final PreferencesService _instance = PreferencesService._internal();
  factory PreferencesService() => _instance;
  PreferencesService._internal();

  static const String _keyDarkMode = 'setting_dark_mode';
  static const String _keyNotificationEnabled = 'setting_notification_enabled';
  static const String _keyCurrency = 'setting_currency';
  static const String _keyHasSeenOnboarding = 'setting_onboarding_seen';
  static const String _keyDefaultFilterRange = 'setting_filter_range';

  // Tema Aplikasi (Dark Mode vs Light Mode)
  Future<bool> isDarkMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyDarkMode) ?? false;
  }

  Future<void> setDarkMode(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyDarkMode, value);
  }

  // Notifikasi Aplikasi
  Future<bool> isNotificationEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyNotificationEnabled) ?? true;
  }

  Future<void> setNotificationEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyNotificationEnabled, value);
  }

  // Mata Uang Pilihan (IDR, USD, dll)
  Future<String> getCurrency() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyCurrency) ?? 'IDR';
  }

  Future<void> setCurrency(String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyCurrency, value);
  }

  // Status Onboarding
  Future<bool> hasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyHasSeenOnboarding) ?? false;
  }

  Future<void> setHasSeenOnboarding(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyHasSeenOnboarding, value);
  }

  // Filter default transaksi (Semua, Bulan Ini, Hari Ini)
  Future<String> getDefaultFilterRange() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyDefaultFilterRange) ?? 'Semua';
  }

  Future<void> setDefaultFilterRange(String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyDefaultFilterRange, value);
  }
}
