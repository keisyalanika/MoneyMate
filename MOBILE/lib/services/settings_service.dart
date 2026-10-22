import 'package:shared_preferences/shared_preferences.dart';

class SettingsService {
  static const String _keyThemeMode = 'app_theme_mode'; // 'light' | 'dark'
  static const String _keyOnboardingDone = 'onboarding_completed';
  static const String _keyLastActiveTab = 'last_active_tab_index';
  static const String _keyDefaultCurrency = 'preferred_currency'; // 'IDR' | 'USD'
  static const String _keyEnableNotification = 'enable_push_notification';

  static final SettingsService instance = SettingsService._internal();
  SettingsService._internal();

  // 1. Status Onboarding (Flag boolean)
  Future<void> setOnboardingCompleted(bool isDone) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyOnboardingDone, isDone);
  }

  Future<bool> isOnboardingCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyOnboardingDone) ?? false;
  }

  // 2. Tema Aplikasi (Pengaturan UI: Dark/Light Mode)
  Future<void> setThemeMode(String mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyThemeMode, mode);
  }

  Future<String> getThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyThemeMode) ?? 'light';
  }

  // 3. Tab Terakhir yang Diakses Pengguna
  Future<void> setLastActiveTab(int tabIndex) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyLastActiveTab, tabIndex);
  }

  Future<int> getLastActiveTab() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyLastActiveTab) ?? 0;
  }

  // 4. Preferensi Mata Uang (IDR / USD)
  Future<void> setPreferredCurrency(String currency) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyDefaultCurrency, currency);
  }

  Future<String> getPreferredCurrency() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyDefaultCurrency) ?? 'IDR';
  }

  // 5. Preferensi Notifikasi
  Future<void> setNotificationEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyEnableNotification, enabled);
  }

  Future<bool> isNotificationEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyEnableNotification) ?? true;
  }
}
