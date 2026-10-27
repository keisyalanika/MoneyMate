import 'package:flutter/material.dart';
import '../core/storage/preferences_service.dart';

/// Provider Pengaturan Aplikasi (Settings Provider)
/// Mengelola data aplikasi kecil dan non-sensitif menggunakan `shared_preferences`
class SettingsProvider with ChangeNotifier {
  final PreferencesService _prefs = PreferencesService();

  bool _isDarkMode = false;
  bool _isNotificationEnabled = true;
  String _currency = 'IDR';
  String _defaultFilter = 'Semua';
  bool _isLoaded = false;

  bool get isDarkMode => _isDarkMode;
  bool get isNotificationEnabled => _isNotificationEnabled;
  String get currency => _currency;
  String get defaultFilter => _defaultFilter;
  bool get isLoaded => _isLoaded;

  SettingsProvider() {
    loadSettings();
  }

  Future<void> loadSettings() async {
    _isDarkMode = await _prefs.isDarkMode();
    _isNotificationEnabled = await _prefs.isNotificationEnabled();
    _currency = await _prefs.getCurrency();
    _defaultFilter = await _prefs.getDefaultFilterRange();
    _isLoaded = true;
    notifyListeners();
  }

  Future<void> toggleDarkMode(bool value) async {
    _isDarkMode = value;
    notifyListeners();
    await _prefs.setDarkMode(value);
  }

  Future<void> toggleNotification(bool value) async {
    _isNotificationEnabled = value;
    notifyListeners();
    await _prefs.setNotificationEnabled(value);
  }

  Future<void> setCurrency(String currencyCode) async {
    _currency = currencyCode;
    notifyListeners();
    await _prefs.setCurrency(currencyCode);
  }

  Future<void> setDefaultFilter(String filter) async {
    _defaultFilter = filter;
    notifyListeners();
    await _prefs.setDefaultFilterRange(filter);
  }
}
