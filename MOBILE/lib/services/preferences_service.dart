import 'package:shared_preferences/shared_preferences.dart';

/// ============================================================
/// PreferencesService — Penyimpanan data ringan (Key-Value)
/// Tipe Storage: SharedPreferences
/// Cocok untuk: pengaturan pengguna, flag boolean, preferensi UI
/// Data bersifat NON-SENSITIF dan ringan (string, int, bool, double)
/// ============================================================
class PreferencesService {
  static PreferencesService? _instance;
  static SharedPreferences? _prefs;

  PreferencesService._();

  static Future<PreferencesService> getInstance() async {
    if (_instance == null) {
      _instance = PreferencesService._();
      _prefs = await SharedPreferences.getInstance();
    }
    return _instance!;
  }

  // =============== TEMA APLIKASI ===============
  Future<void> saveTheme(bool isDarkMode) async {
    await _prefs?.setBool('is_dark_mode', isDarkMode);
  }

  bool getTheme() {
    return _prefs?.getBool('is_dark_mode') ?? false;
  }

  // =============== ONBOARDING STATUS ===============
  Future<void> setOnboardingComplete(bool complete) async {
    await _prefs?.setBool('onboarding_complete', complete);
  }

  bool isOnboardingComplete() {
    return _prefs?.getBool('onboarding_complete') ?? false;
  }

  // =============== USER SESSION INFO (NON-SENSITIF) ===============
  Future<void> saveUserName(String name) async {
    await _prefs?.setString('user_name', name);
  }

  String getUserName() {
    return _prefs?.getString('user_name') ?? 'Guest';
  }

  Future<void> saveUserNickname(String nickname) async {
    await _prefs?.setString('user_nickname', nickname);
  }

  String getUserNickname() {
    return _prefs?.getString('user_nickname') ?? '';
  }

  Future<void> saveUserEmail(String email) async {
    await _prefs?.setString('user_email', email);
  }

  String getUserEmail() {
    return _prefs?.getString('user_email') ?? '';
  }

  Future<void> saveUserPhone(String phone) async {
    await _prefs?.setString('user_phone', phone);
  }

  String getUserPhone() {
    return _prefs?.getString('user_phone') ?? '';
  }

  Future<void> saveUserRole(String role) async {
    await _prefs?.setString('user_role', role);
  }

  String getUserRole() {
    return _prefs?.getString('user_role') ?? 'user';
  }

  Future<void> clearUserSession() async {
    await _prefs?.remove('user_name');
    await _prefs?.remove('user_nickname');
    await _prefs?.remove('user_email');
    await _prefs?.remove('user_phone');
    await _prefs?.remove('user_role');
  }

  // =============== PENGATURAN MATA UANG ===============
  Future<void> saveCurrency(String currency) async {
    await _prefs?.setString('currency', currency);
  }

  String getCurrency() {
    return _prefs?.getString('currency') ?? 'IDR';
  }

  // =============== PENGATURAN BAHASA ===============
  Future<void> saveLanguage(String lang) async {
    await _prefs?.setString('language', lang);
  }

  String getLanguage() {
    return _prefs?.getString('language') ?? 'id';
  }

  // =============== NOTIFIKASI ===============
  Future<void> setNotificationEnabled(bool enabled) async {
    await _prefs?.setBool('notification_enabled', enabled);
  }

  bool isNotificationEnabled() {
    return _prefs?.getBool('notification_enabled') ?? true;
  }

  // =============== CACHE TIMESTAMP ===============
  Future<void> saveLastSyncTime(int epochMillis) async {
    await _prefs?.setInt('last_sync_time', epochMillis);
  }

  int getLastSyncTime() {
    return _prefs?.getInt('last_sync_time') ?? 0;
  }

  String getLastSyncFormatted() {
    final ts = getLastSyncTime();
    if (ts == 0) return 'Belum pernah';
    final dt = DateTime.fromMillisecondsSinceEpoch(ts);
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 1) return 'Baru saja';
    if (diff.inMinutes < 60) return '${diff.inMinutes} menit lalu';
    if (diff.inHours < 24) return '${diff.inHours} jam lalu';
    return '${diff.inDays} hari lalu';
  }

  // =============== SALDO SNAPSHOT ===============
  Future<void> saveSaldoSnapshot(double saldo) async {
    await _prefs?.setDouble('saldo_snapshot', saldo);
  }

  double getSaldoSnapshot() {
    return _prefs?.getDouble('saldo_snapshot') ?? 0.0;
  }

  Future<void> saveIncomeSnapshot(double income) async {
    await _prefs?.setDouble('income_snapshot', income);
  }

  double getIncomeSnapshot() {
    return _prefs?.getDouble('income_snapshot') ?? 0.0;
  }

  Future<void> saveExpenseSnapshot(double expense) async {
    await _prefs?.setDouble('expense_snapshot', expense);
  }

  double getExpenseSnapshot() {
    return _prefs?.getDouble('expense_snapshot') ?? 0.0;
  }

  // =============== CLEAR ALL ===============
  Future<void> clearAll() async {
    await _prefs?.clear();
  }
}
