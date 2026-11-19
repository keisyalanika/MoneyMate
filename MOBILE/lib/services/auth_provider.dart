import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:io';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'dart:convert';
import 'api_service.dart';
import 'preferences_service.dart';
import 'secure_storage_service.dart';

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  bool _isInitialized = false;
  late final Future<void> _initFuture;
  String _userName = 'Guest';
  String _userNickname = '';
  String _userEmail = '';
  String _userPhone = '';
  String _avatarUrl = '';
  String _role = 'user';
  String? _token;
  
  double _saldo = 0;
  double _sisaBudget = 0;

  String? _errorMessage;

  AuthProvider() {
    _initFuture = _loadFromPreferences();
  }

  Future<void> initialize() => _initFuture;

  bool get isInitialized => _isInitialized;
  bool get isLoggedIn => _isLoggedIn;
  String get userName => _userName;
  String get userNickname => _userNickname.isNotEmpty 
      ? _userNickname 
      : (_userName.isNotEmpty && _userName != 'Guest' ? _userName.split(' ').first : 'Pengguna');
  String get userEmail => _userEmail;
  String get currentUserEmail => _userEmail;
  String get userPhone => _userPhone;
  String get avatarUrl => _avatarUrl;
  String get userInitial => (userNickname.isNotEmpty 
      ? userNickname[0] 
      : (userName.isNotEmpty && userName != 'Guest' ? userName[0] : 'U')).toUpperCase();
  String get role => _role;
  String? get token => _token;
  double get saldo => _saldo;
  double get sisaBudget => _sisaBudget;
  String? get errorMessage => _errorMessage;

  Future<void> _loadFromPreferences() async {
    try {
      final prefs = await PreferencesService.getInstance();
      final savedName = prefs.getUserName();
      _token = prefs.getAuthToken();
      if (_token == null || _token!.isEmpty) {
        _token = await SecureStorageService.getInstance().getAccessToken();
      }
      if (_token != null && _token!.isNotEmpty) {
        ApiService.token = _token;
      }
      // Sesi hanya dianggap valid jika token akses ada.
      final hasToken = _token != null && _token!.isNotEmpty;
      final hasSavedSession = hasToken &&
          (prefs.isSessionActive() || (savedName != 'Guest' && savedName.isNotEmpty));
      if (hasSavedSession && savedName != 'Guest' && savedName.isNotEmpty) {
        _userName = savedName;
        _userNickname = prefs.getUserNickname();
        _userEmail = prefs.getUserEmail();
        _userPhone = prefs.getUserPhone();
        _avatarUrl = prefs.getUserAvatar();
        _role = prefs.getUserRole();
        _isLoggedIn = true;
        _saldo = prefs.getSaldoSnapshot();
        _sisaBudget = prefs.getSisaBudgetSnapshot();
        await prefs.saveSessionActive(true);
        if (_token != null && _token!.isNotEmpty) {
          await SecureStorageService.getInstance().saveAccessToken(_token!);
        }
        // Background sync profil, wallet, budget, dan transaksi dari backend
        refreshProfile();
        refreshFinance();
      }
    } catch (e) {
      debugPrint('[AuthProvider] loadFromPreferences error: $e');
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  Future<void> _saveSessionToPrefs() async {
    try {
      final prefs = await PreferencesService.getInstance();
      await prefs.saveUserName(_userName);
      await prefs.saveUserNickname(_userNickname);
      await prefs.saveUserEmail(_userEmail);
      await prefs.saveUserPhone(_userPhone);
      await prefs.saveUserAvatar(_avatarUrl);
      await prefs.saveUserRole(_role);
      if (_token != null && _token!.isNotEmpty) {
        await prefs.saveAuthToken(_token!);
        await SecureStorageService.getInstance().saveAccessToken(_token!);
      }
      await prefs.saveSessionActive(true);
    } catch (e) {
      debugPrint('[AuthProvider] saveSession error: $e');
    }
  }

  Future<Map<String, dynamic>> register({
    required String name,
    String? nickname,
    required String email,
    required String password,
    String? phone,
  }) async {
    _errorMessage = null;
    final normalizedEmail = email.trim().toLowerCase();
    final cleanName = name.trim();

    // Kirim ke Backend API
    try {
      final response = await http
          .post(
            Uri.parse('${ApiService.baseUrl}/auth/register'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'name': cleanName,
              'email': normalizedEmail,
              'password': password,
              'phone': phone?.trim(),
            }),
          )
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return {'success': true, 'message': 'Pendaftaran berhasil! Silakan masuk.'};
      } else {
        try {
          final data = jsonDecode(response.body);
          _errorMessage = data['message'] ?? 'Pendaftaran gagal.';
        } catch (_) {
          _errorMessage = 'Pendaftaran gagal (${response.statusCode})';
        }
        return {'success': false, 'message': _errorMessage};
      }
    } catch (e) {
      debugPrint('Register API error: $e');
      _errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
      return {'success': false, 'message': _errorMessage};
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    _errorMessage = null;
    final normalizedEmail = email.trim().toLowerCase();

    try {
      final response = await http
          .post(
            Uri.parse('${ApiService.baseUrl}/auth/login'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'email': normalizedEmail, 'password': password}),
          )
          .timeout(const Duration(seconds: 8));

      final Map<String, dynamic> data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        _isLoggedIn = true;
        _userName = (data['name'] ?? 'Pengguna').toString();
        _userNickname = (data['nickname'] ?? _userName.split(' ').first).toString();
        _userEmail = (data['email'] ?? normalizedEmail).toString();
        _userPhone = (data['phone'] ?? '').toString();
        _avatarUrl = (data['avatar_url'] ?? '').toString();
        _role = (data['role'] ?? 'user').toString();
        _token = data['token']?.toString();
        ApiService.token = _token;

        await _saveSessionToPrefs();
        await refreshFinance();
        notifyListeners();
        return {'success': true, 'message': 'Login berhasil'};
      }

      _errorMessage = data['message']?.toString() ?? 'Email atau kata sandi salah.';
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    } catch (e) {
      debugPrint('Login API error: $e');
      _errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    }
  }

  Future<Map<String, dynamic>> loginWithGoogle() async {
    _errorMessage = null;

    try {
      final GoogleSignIn googleSignIn = GoogleSignIn(
        serverClientId: const String.fromEnvironment(
          'GOOGLE_SERVER_CLIENT_ID',
          defaultValue: '232019089703-d2879d4vns88hou8sh5q1hddonbb6m0e.apps.googleusercontent.com',
        ),
        scopes: ['email', 'profile'],
      );

      // Sign out akun sebelumnya agar pemilih akun Google selalu muncul
      try {
        await googleSignIn.signOut();
      } catch (_) {}

      final GoogleSignInAccount? account = await googleSignIn.signIn();

      if (account == null) {
        // User membatalkan proses sign-in
        return {
          'success': false,
          'cancelled': true,
          'message': 'Login dengan Google dibatalkan.',
        };
      }

      final GoogleSignInAuthentication auth = await account.authentication;
      final String? idToken = auth.idToken;
      final String email = account.email;
      final String name = account.displayName ?? 'Pengguna Google';
      final String? photoUrl = account.photoUrl;

      final res = await ApiService.loginWithGoogle(
        idToken: idToken,
        email: email,
        name: name,
        avatarUrl: photoUrl,
      );

      if (res['success'] == true && res['data'] != null) {
        final Map<String, dynamic> data = res['data'];
        _isLoggedIn = true;
        _userName = (data['name'] ?? name).toString();
        _userNickname = (data['nickname'] ?? _userName.split(' ').first).toString();
        _userEmail = (data['email'] ?? email).toString();
        _userPhone = (data['phone'] ?? '').toString();
        _avatarUrl = (data['avatar_url'] ?? photoUrl ?? '').toString();
        _role = (data['role'] ?? 'user').toString();
        _token = data['token']?.toString();
        ApiService.token = _token;

        await _saveSessionToPrefs();
        await refreshFinance();
        notifyListeners();

        return {
          'success': true,
          'isNewUser': data['isNewUser'] == true,
          'message': res['message'] ?? 'Login dengan Google berhasil',
        };
      }

      _errorMessage = res['message']?.toString() ?? 'Gagal masuk dengan Google.';
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    } on PlatformException catch (e) {
      debugPrint('[AuthProvider] Google Sign-In PlatformException: ${e.code} - ${e.message}');
      String userMsg = 'Gagal masuk dengan Google (${e.code}).';
      if (e.code == 'sign_in_canceled' || e.code == 'canceled') {
        return {
          'success': false,
          'cancelled': true,
          'message': 'Login dengan Google dibatalkan.',
        };
      } else if (e.code == 'network_error') {
        userMsg = 'Koneksi internet bermasalah saat menghubungkan ke Google.';
      } else if (e.code == 'sign_in_failed') {
        userMsg = 'Konfigurasi Google Sign-In (SHA-1 / Client ID) belum cocok di project.';
      }
      _errorMessage = userMsg;
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    } on SocketException catch (_) {
      _errorMessage = 'Tidak dapat terhubung ke internet. Periksa koneksi Anda.';
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    } catch (e) {
      debugPrint('[AuthProvider] Google Sign-In error: $e');
      _errorMessage = 'Terjadi kendala saat login dengan Google. Silakan coba lagi.';
      notifyListeners();
      return {'success': false, 'message': _errorMessage};
    }
  }

  Future<void> refreshProfile() async {
    final data = await ApiService.fetchProfile();
    if (data == null) return;

    if (data['name'] != null && data['name'].toString().isNotEmpty) {
      _userName = data['name'].toString();
    }
    if (data['email'] != null && data['email'].toString().isNotEmpty) {
      _userEmail = data['email'].toString();
    }
    if (data['phone'] != null) {
      _userPhone = data['phone'].toString();
    }
    _avatarUrl = (data['avatar_url'] ?? '').toString();

    await _saveSessionToPrefs();
    notifyListeners();
  }

  Future<Map<String, dynamic>> uploadAvatar(String filePath) async {
    final result = await ApiService.uploadAvatar(filePath);
    if (result['success'] == true) {
      _avatarUrl = result['avatar_url']?.toString() ?? _avatarUrl;
      await _saveSessionToPrefs();
      notifyListeners();
    }
    return result;
  }

  Future<void> updateProfileData({
    String? name,
    String? nickname,
    String? email,
    String? phone,
  }) async {
    if (name != null && name.trim().isNotEmpty) {
      _userName = name.trim();
    }
    if (nickname != null && nickname.trim().isNotEmpty) {
      _userNickname = nickname.trim();
    } else if (name != null && name.trim().isNotEmpty && _userNickname.isEmpty) {
      _userNickname = _userName.split(' ').first;
    }
    if (email != null && email.trim().isNotEmpty) {
      _userEmail = email.trim();
    }
    if (phone != null) {
      _userPhone = phone.trim();
    }

    // Sinkronisasi update profil langsung ke Backend API
    try {
      await ApiService.updateProfile({
        'name': _userName,
        'phone': _userPhone,
      });
    } catch (e) {
      debugPrint('[AuthProvider] updateProfile API error: $e');
    }

    await _saveSessionToPrefs();
    notifyListeners();
  }

  Future<void> logout() async {
    _isLoggedIn = false;
    _userName = 'Guest';
    _userNickname = '';
    _userEmail = '';
    _userPhone = '';
    _avatarUrl = '';
    _role = 'user';
    _token = null;
    ApiService.token = null;
    _errorMessage = null;

    try {
      final prefs = await PreferencesService.getInstance();
      await prefs.clearUserSession();
      final secure = SecureStorageService.getInstance();
      await secure.deleteAccessToken();
      await secure.deleteRefreshToken();
      await secure.deleteUserId();
    } catch (_) {}

    notifyListeners();
  }

  // ================= SALDO & WALLET INTEGRATION =================
  Future<void> fetchWallets() async {
    try {
      final res = await ApiService.fetchWallets();
      if (res['success'] == true) {
        if (res['totalBalance'] != null) {
          _saldo = (res['totalBalance'] as num).toDouble();
        } else if (res['data'] is List && (res['data'] as List).isNotEmpty) {
          final list = res['data'] as List;
          double total = 0;
          for (var item in list) {
            total += (item['balance'] as num? ?? 0).toDouble();
          }
          _saldo = total;
        }
        notifyListeners();
        final prefs = await PreferencesService.getInstance();
        await prefs.saveSaldoSnapshot(_saldo);
      }
    } catch (e) {
      debugPrint('[AuthProvider] fetchWallets error: $e');
    }
  }

  /// Sisa budget = total sisa limit kategori pada bulan berjalan.
  Future<void> fetchBudgetRemaining() async {
    try {
      final now = DateTime.now();
      final budgets = await ApiService.fetchBudgets(month: now.month, year: now.year);
      if (budgets == null) return;

      double remaining = 0;
      for (final budget in budgets) {
        final sisa = budget.limitAmount - budget.spentAmount;
        if (sisa > 0) remaining += sisa;
      }
      _sisaBudget = remaining;
      notifyListeners();

      final prefs = await PreferencesService.getInstance();
      await prefs.saveSisaBudgetSnapshot(_sisaBudget);
    } catch (e) {
      debugPrint('[AuthProvider] fetchBudgetRemaining error: $e');
    }
  }

  /// Tarik ulang saldo, sisa budget, dan transaksi supaya semua tampilan sinkron.
  Future<void> refreshFinance() async {
    ApiService.lastAuthFailed = false;
    await Future.wait([
      fetchWallets(),
      fetchBudgetRemaining(),
      fetchTransactions(),
    ]);

    if (ApiService.lastAuthFailed) {
      await logout();
    }
  }

  Future<Map<String, dynamic>> adjustBalance({
    required bool isAdd,
    required double amount,
    String? note,
  }) async {
    // 1. Update saldo lokal secara instan (Optimistic UI)
    final prevSaldo = _saldo;
    final newBalance = isAdd ? _saldo + amount : (_saldo - amount < 0 ? 0.0 : _saldo - amount);
    _saldo = newBalance;
    notifyListeners();

    // 2. Kirim update ke Backend API
    try {
      final walletsResult = await ApiService.fetchWallets();
      int walletId = 1;

      if (walletsResult['success'] == true &&
          walletsResult['data'] is List &&
          (walletsResult['data'] as List).isNotEmpty) {
        final list = walletsResult['data'] as List;
        final defaultWallet = list.firstWhere(
          (w) => w['is_default'] == 1 || w['is_default'] == true,
          orElse: () => list.first,
        );
        walletId = defaultWallet['id'] ?? 1;
      } else {
        // Setup initial default wallet di backend jika belum ada
        final initResult = await ApiService.setupInitialWalletBalance(prevSaldo);
        if (initResult['data'] != null && initResult['data']['id'] != null) {
          walletId = initResult['data']['id'];
        }
      }

      final res = await ApiService.adjustWalletBalance(
        walletId: walletId,
        type: isAdd ? 'add' : 'subtract',
        amount: amount,
        note: note,
      );

      if (res['success'] == true && res['data'] != null) {
        if (res['data']['balance'] != null) {
          _saldo = (res['data']['balance'] as num).toDouble();
        }
        await refreshFinance();
        notifyListeners();
        return {
          'success': true,
          'balance': _saldo,
          'message': res['message'] ?? 'Saldo berhasil diperbarui',
        };
      } else {
        _saldo = prevSaldo;
        notifyListeners();
        return {
          'success': false,
          'balance': _saldo,
          'message': res['message'] ?? 'Gagal menyimpan saldo ke server.',
        };
      }
    } catch (e) {
      debugPrint('[AuthProvider] adjustBalance API error: $e');
      _saldo = prevSaldo;
      notifyListeners();
      return {
        'success': false,
        'balance': _saldo,
        'message': 'Gagal menyimpan saldo. Periksa koneksi ke server.',
      };
    }
  }

  // ================= LUPA KATA SANDI & RESET PASSWORD =================
  String? _recoveryEmail;
  String? _lastGeneratedOtp;

  String? get recoveryEmail => _recoveryEmail;
  String? get lastGeneratedOtp => _lastGeneratedOtp;

  Future<Map<String, dynamic>> sendForgotPasswordOtp(String email) async {
    final normalized = email.trim().toLowerCase();
    _recoveryEmail = normalized;
    final res = await ApiService.sendForgotPasswordOtp(normalized);
    // Simpan OTP jika backend mengembalikannya (mode dev / EMAIL_MOCK=true).
    if (res['success'] == true && res['otp'] != null) {
      _lastGeneratedOtp = res['otp'].toString();
    }
    return res;
  }

  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    final normalized = email.trim().toLowerCase();
    return ApiService.verifyOtp(normalized, otp);
  }

  Future<Map<String, dynamic>> resetPassword({
    required String email,
    required String newPassword,
    required String otp,
  }) async {
    return ApiService.resetPassword(
      email: email.trim().toLowerCase(),
      newPassword: newPassword,
      otp: otp,
    );
  }

  Future<Map<String, dynamic>> updatePassword(
    String newPassword, {
    required String currentPassword,
  }) async {
    final res = await ApiService.changePassword(
      currentPassword: currentPassword,
      newPassword: newPassword,
    );
    notifyListeners();
    return res;
  }

  // ================= TRANSACTIONS INTEGRATION =================
  List<Map<String, dynamic>> _transactions = [];
  bool _isLoadingTransactions = false;

  List<Map<String, dynamic>> get transactions => _transactions;
  bool get isLoadingTransactions => _isLoadingTransactions;

  Future<void> fetchTransactions() async {
    _isLoadingTransactions = true;
    notifyListeners();
    try {
      final list = await ApiService.fetchTransactions();
      if (ApiService.lastTransactionsOk) {
        _transactions = list.map((tx) => {
          'id': tx.id,
          'title': tx.title,
          'amount': tx.amount,
          'type': tx.type.toLowerCase(),
          'isExpense': tx.type.toLowerCase() == 'expense',
          'category': tx.categoryName,
          'date': tx.date,
          'note': tx.notes ?? '',
          'time': 'Hari ini',
        }).toList();
      }
    } catch (e) {
      debugPrint('[AuthProvider] fetchTransactions error: $e');
    } finally {
      _isLoadingTransactions = false;
      notifyListeners();
    }
  }

  Future<bool> addTransaction({
    required String type,
    required double amount,
    required String category,
    required String date,
    String? note,
  }) async {
    final bool isExpense = type.toLowerCase() == 'expense';
    final double prevSaldo = _saldo;
    final double prevSisaBudget = _sisaBudget;
    final prevTransactions = List<Map<String, dynamic>>.from(_transactions);

    // 1. Optimistic UI: Update saldo dan sisa budget lokal secara instan
    if (isExpense) {
      _saldo = (_saldo - amount).clamp(0.0, double.infinity);
      _sisaBudget = (_sisaBudget - amount).clamp(0.0, double.infinity);
    } else {
      _saldo += amount;
    }

    // 2. Tambahkan transaksi ke daftar paling atas
    final newTx = {
      'id': 'tx-${DateTime.now().millisecondsSinceEpoch}',
      'title': category,
      'amount': amount,
      'type': type.toLowerCase(),
      'isExpense': isExpense,
      'category': category,
      'date': date,
      'note': note ?? '',
      'time': DateFormat('HH:mm').format(DateTime.now()),
    };
    _transactions.insert(0, newTx);
    notifyListeners();

    // 3. Kirim ke Backend API
    try {
      final success = await ApiService.addTransaction({
        'type': type.toLowerCase(),
        'amount': amount,
        'category_name': category,
        'date': date,
        'note': note ?? '',
      });

      if (success) {
        await refreshFinance();
        return true;
      }

      // Gagal tersimpan di server -> kembalikan state optimistis.
      _saldo = prevSaldo;
      _sisaBudget = prevSisaBudget;
      _transactions = prevTransactions;
      notifyListeners();
      return false;
    } catch (e) {
      debugPrint('[AuthProvider] addTransaction error: $e');
      _saldo = prevSaldo;
      _sisaBudget = prevSisaBudget;
      _transactions = prevTransactions;
      notifyListeners();
      return false;
    }
  }
}
