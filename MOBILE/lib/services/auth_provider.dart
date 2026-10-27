import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'api_service.dart';
import '../core/storage/secure_storage_service.dart';
import '../data/repositories/offline_first_repository.dart';

class AuthProvider with ChangeNotifier {
  final SecureStorageService _secureStorage = SecureStorageService();
  final OfflineFirstRepository _repo = OfflineFirstRepository();

  bool _isLoggedIn = false;
  String _userName = 'Keisya Exa Haniyah';
  String _role = 'user';
  String? _token;

  double _saldo = 2450000.0;
  double _sisaBudget = 850000.0;

  String? _errorMessage;
  bool _isLoading = false;

  bool get isLoggedIn => _isLoggedIn;
  String get userName => _userName;
  String get role => _role;
  String? get token => _token;
  double get saldo => _saldo;
  double get sisaBudget => _sisaBudget;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _isLoading;

  // Inisialisasi sesi dari FlutterSecureStorage (bukan shared_preferences)
  Future<void> initSession() async {
    final savedToken = await _secureStorage.getToken();
    final savedName = await _secureStorage.getUserName();
    final savedRole = await _secureStorage.getUserRole();

    if (savedToken != null && savedToken.isNotEmpty) {
      _token = savedToken;
      _userName = savedName ?? 'Keisya Exa Haniyah';
      _role = savedRole ?? 'user';
      _isLoggedIn = true;
      ApiService.token = _token;
      notifyListeners();

      // Sinkronisasi data offline-first secara background
      _repo.syncAll();
    }
  }

  // Simpan akun pengguna yang terdaftar secara lokal untuk pengujian / offline fallback
  final Map<String, Map<String, String>> _registeredUsers = {
    'keisyaexahaniyah@gmail.com': {
      'name': 'Keisya Exa Haniyah',
      'password': 'Admin123',
      'role': 'user',
    },
    'admin@moneymate.com': {
      'name': 'Admin MoneyMate',
      'password': 'admin123',
      'role': 'admin',
    },
  };

  void updateUserName(String name) {
    _userName = name;
    notifyListeners();
  }

  void setSaldo(double saldo) {
    _saldo = saldo;
    notifyListeners();
  }

  void setSisaBudget(double budget) {
    _sisaBudget = budget;
    notifyListeners();
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    _errorMessage = null;
    _isLoading = true;
    notifyListeners();
    final normalizedEmail = email.trim().toLowerCase();

    // 1. Coba kirim ke Backend API
    try {
      final response = await http
          .post(
            Uri.parse('${ApiService.baseUrl}/auth/register'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'name': name.trim(),
              'email': normalizedEmail,
              'password': password,
              'phone': phone?.trim(),
            }),
          )
          .timeout(const Duration(seconds: 4));

      _isLoading = false;
      if (response.statusCode == 200 || response.statusCode == 201) {
        _registeredUsers[normalizedEmail] = {
          'name': name.trim(),
          'password': password,
          'role': 'user',
        };
        notifyListeners();
        return {'success': true, 'message': 'Pendaftaran berhasil! Silakan masuk.'};
      } else {
        try {
          final data = jsonDecode(response.body);
          _errorMessage = data['message'] ?? 'Pendaftaran gagal.';
        } catch (_) {
          _errorMessage = 'Pendaftaran gagal (${response.statusCode})';
        }
        notifyListeners();
        return {'success': false, 'message': _errorMessage};
      }
    } catch (e) {
      _isLoading = false;
      debugPrint('Register with API failed/offline, registering locally: $e');

      // Offline / Fallback registration
      if (_registeredUsers.containsKey(normalizedEmail)) {
        notifyListeners();
        return {'success': false, 'message': 'Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk.'};
      }

      _registeredUsers[normalizedEmail] = {
        'name': name.trim(),
        'password': password,
        'role': 'user',
      };
      notifyListeners();

      return {
        'success': true,
        'message': 'Akun berhasil dibuat! Silakan masuk dengan email dan kata sandi Anda.',
      };
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    _errorMessage = null;
    _isLoading = true;
    notifyListeners();
    final normalizedEmail = email.trim().toLowerCase();

    // Skenario simulasi dev jika email kosong
    if (normalizedEmail.isEmpty && password.isEmpty) {
      _isLoggedIn = true;
      _userName = 'Keisya Exa Haniyah';
      _role = 'user';
      _token = 'token_local_${DateTime.now().millisecondsSinceEpoch}';
      ApiService.token = _token;
      _isLoading = false;

      // Simpan kredensial dan token ke FlutterSecureStorage
      await _secureStorage.saveAuthSession(
        token: _token!,
        email: 'keisyaexahaniyah@gmail.com',
        name: _userName,
        role: _role,
      );

      _repo.syncAll();
      notifyListeners();
      return {'success': true, 'message': 'Login berhasil (simulasi)'};
    }

    // 1. Coba login ke Backend API
    try {
      final response = await http
          .post(
            Uri.parse('${ApiService.baseUrl}/auth/login'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'email': normalizedEmail, 'password': password}),
          )
          .timeout(const Duration(seconds: 4));

      _isLoading = false;
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _isLoggedIn = true;
        _userName = data['name'] ?? 'Keisya Exa Haniyah';
        _role = data['role'] ?? 'user';
        _token = data['token'];
        ApiService.token = _token;

        // Simpan token & rahasia secara aman di FlutterSecureStorage
        await _secureStorage.saveAuthSession(
          token: _token!,
          refreshToken: data['refreshToken'],
          email: normalizedEmail,
          name: _userName,
          role: _role,
        );

        _repo.syncAll();
        notifyListeners();
        return {'success': true, 'message': 'Login berhasil'};
      } else {
        try {
          final data = jsonDecode(response.body);
          _errorMessage = data['message'] ?? 'Email atau kata sandi salah.';
        } catch (_) {
          _errorMessage = 'Email atau kata sandi salah.';
        }
        notifyListeners();
        return {'success': false, 'message': _errorMessage};
      }
    } catch (e) {
      _isLoading = false;
      debugPrint('Login with API failed/offline, checking registered users: $e');

      // 2. Periksa akun yang sudah terdaftar secara lokal
      if (_registeredUsers.containsKey(normalizedEmail)) {
        final userData = _registeredUsers[normalizedEmail]!;
        if (userData['password'] == password) {
          _isLoggedIn = true;
          _userName = userData['name'] ?? 'Keisya Exa Haniyah';
          _role = userData['role'] ?? 'user';
          _token = 'token_local_${DateTime.now().millisecondsSinceEpoch}';
          ApiService.token = _token;

          await _secureStorage.saveAuthSession(
            token: _token!,
            email: normalizedEmail,
            name: _userName,
            role: _role,
          );

          _repo.syncAll();
          notifyListeners();
          return {
            'success': true,
            'message': 'Login berhasil! Selamat datang, $_userName.',
          };
        } else {
          _errorMessage = 'Kata sandi yang Anda masukkan salah.';
          notifyListeners();
          return {'success': false, 'message': _errorMessage};
        }
      }

      // Fallback offline jika kata sandi terisi
      if (password.isNotEmpty) {
        _isLoggedIn = true;
        _userName = normalizedEmail.split('@').first;
        if (_userName.isEmpty) _userName = 'Keisya Exa Haniyah';
        _role = 'user';
        _token = 'token_local_${DateTime.now().millisecondsSinceEpoch}';
        ApiService.token = _token;

        await _secureStorage.saveAuthSession(
          token: _token!,
          email: normalizedEmail,
          name: _userName,
          role: _role,
        );

        _repo.syncAll();
        notifyListeners();
        return {
          'success': true,
          'message': 'Login berhasil! Selamat datang, $_userName.',
        };
      }

      _errorMessage = 'Akun dengan email ini belum terdaftar. Silakan daftar akun terlebih dahulu!';
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    }
  }

  Future<void> logout() async {
    _isLoggedIn = false;
    _userName = 'Keisya Exa Haniyah';
    _role = 'user';
    _token = null;
    ApiService.token = null;
    _errorMessage = null;

    // Bersihkan sesi rahasia dari flutter_secure_storage
    await _secureStorage.clearAuthSession();
    notifyListeners();
  }
}
