import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/transaction_model.dart';
import '../models/category_model.dart';
import '../models/budget_model.dart';

class ApiService {
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  // Use 10.0.2.2 for Android Emulator, localhost for iOS / Desktop / Web
  static String get baseUrl {
    if (_envBaseUrl.isNotEmpty) return _envBaseUrl;
    if (kIsWeb) return 'http://localhost:5000/api';
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
  }
  static String? token;

  static Map<String, String> get headers {
    final map = {'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) {
      map['Authorization'] = 'Bearer $token';
    }
    return map;
  }

  static Future<Map<String, dynamic>> fetchSummary() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/summary'), headers: headers);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['data'];
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('API Error fetchSummary: $e');
      }
    }
    return {
      'totalBalance': 12500000,
      'totalIncome': 18000000,
      'totalExpense': 5500000,
    };
  }

  static Future<List<TransactionModel>> fetchTransactions() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/transactions'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'];
        return list.map((e) => TransactionModel.fromJson(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('API Error fetchTransactions: $e');
      }
    }
    return [
      TransactionModel(
        id: 'tx-001',
        title: 'Gaji Bulanan Software Engineer',
        amount: 15000000,
        type: 'INCOME',
        categoryId: 'cat-inc-1',
        categoryName: 'Gaji',
        categoryIcon: 'wallet',
        date: DateTime.now().toIso8601String(),
        notes: 'Transfer Gaji Pokok',
      ),
      TransactionModel(
        id: 'tx-002',
        title: 'Makan Siang Resto SE',
        amount: 125000,
        type: 'EXPENSE',
        categoryId: 'cat-exp-1',
        categoryName: 'Makanan & Minuman',
        categoryIcon: 'utensils',
        date: DateTime.now().toIso8601String(),
        notes: 'Makan bersama tim',
      ),
    ];
  }

  static Future<bool> addTransaction(Map<String, dynamic> payload) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/transactions'),
        headers: headers,
        body: json.encode(payload),
      );
      return response.statusCode == 201;
    } catch (e) {
      if (kDebugMode) {
        debugPrint('API Error addTransaction: $e');
      }
      return false;
    }
  }

  static Future<List<CategoryModel>> fetchCategories() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/categories'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'];
        return list.map((e) => CategoryModel.fromJson(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('API Error fetchCategories: $e');
      }
    }
    return [
      CategoryModel(id: 'cat-inc-1', name: 'Gaji', type: 'INCOME', icon: 'wallet', color: '#10B981'),
      CategoryModel(id: 'cat-exp-1', name: 'Makanan & Minuman', type: 'EXPENSE', icon: 'utensils', color: '#EF4444'),
    ];
  }

  static Future<List<BudgetModel>> fetchBudgets() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/budgets'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'];
        return list.map((e) => BudgetModel.fromJson(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('API Error fetchBudgets: $e');
      }
    }
    return [
      BudgetModel(id: 'bg-001', categoryId: 'cat-exp-1', categoryName: 'Makanan & Minuman', limitAmount: 3000000, spentAmount: 125000, percentage: 4.17),
    ];
  }

  // ================= GOALS (OFFLINE-FIRST DENGAN LOCAL STORAGE & SYNC API) =================
  static const String _goalsKey = 'moneymate_goals_storage';
  static String? lastGoalError;

  static String _goalIdString(dynamic id) => id?.toString() ?? '';

  static bool _isServerGoalId(dynamic id) =>
      RegExp(r'^\d+$').hasMatch(_goalIdString(id));

  static String _goalFundsKey(dynamic goalId) =>
      'moneymate_goal_funds_${_goalIdString(goalId)}';

  static Future<List<Map<String, dynamic>>> _getLocalGoals() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? str = prefs.getString(_goalsKey);
      if (str != null && str.trim().isNotEmpty) {
        final List<dynamic> decoded = json.decode(str);
        return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<void> _setLocalGoals(List<Map<String, dynamic>> goals) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_goalsKey, json.encode(goals));
    } catch (_) {}
  }

  static Future<List<Map<String, dynamic>>> _getLocalFunds(dynamic goalId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? str = prefs.getString(_goalFundsKey(goalId));
      if (str != null && str.trim().isNotEmpty) {
        final List<dynamic> decoded = json.decode(str);
        return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
      }
    } catch (_) {}
    return [];
  }

  static Future<void> _setLocalFunds(
    dynamic goalId,
    List<Map<String, dynamic>> funds,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_goalFundsKey(goalId), json.encode(funds));
    } catch (_) {}
  }

  static Future<void> _replaceLocalGoal(Map<String, dynamic> item) async {
    final current = await _getLocalGoals();
    final idx = current.indexWhere(
      (g) => _goalIdString(g['id']) == _goalIdString(item['id']),
    );
    if (idx >= 0) {
      current[idx] = item;
    } else {
      current.insert(0, item);
    }
    await _setLocalGoals(current);
  }

  static Future<double> _applyLocalFund({
    required dynamic goalId,
    required double amount,
    String? note,
    double? forcedAmount,
    bool? completed,
    bool pendingSync = false,
  }) async {
    final current = await _getLocalGoals();
    final idx = current.indexWhere(
      (g) => _goalIdString(g['id']) == _goalIdString(goalId),
    );

    double updatedAmount = forcedAmount ?? amount;
    bool isCompleted = completed ?? false;

    if (idx >= 0) {
      final double curr =
          double.tryParse('${current[idx]['current_amount'] ?? 0}') ?? 0.0;
      final double target =
          double.tryParse('${current[idx]['target_amount'] ?? 0}') ?? 0.0;
      updatedAmount = forcedAmount ?? (curr + amount);
      isCompleted = completed ?? (target > 0 && updatedAmount >= target);
      current[idx]['current_amount'] = updatedAmount;
      current[idx]['is_completed'] = isCompleted ? 1 : 0;
      await _setLocalGoals(current);
    }

    final funds = await _getLocalFunds(goalId);
    funds.insert(0, {
      'id': 'fund_${DateTime.now().millisecondsSinceEpoch}',
      'goal_id': goalId,
      'amount': amount,
      'note': note ?? 'Setoran tabungan',
      'created_at': DateTime.now().toIso8601String(),
      'pending_sync': pendingSync,
    });
    await _setLocalFunds(goalId, funds);

    return updatedAmount;
  }

  static Future<List<Map<String, dynamic>>> fetchGoals() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/goals'), headers: headers)
          .timeout(const Duration(seconds: 2));
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'] ?? [];
        final remote = list.map((e) => Map<String, dynamic>.from(e)).toList();
        if (remote.isNotEmpty) {
          final local = await _getLocalGoals();
          final pendingLocal = local.where((g) {
            final id = _goalIdString(g['id']);
            final isTempId = id.isNotEmpty && !RegExp(r'^\d+$').hasMatch(id);
            if (!isTempId) return false;

            final title = g['title']?.toString().trim().toLowerCase() ?? '';
            final target =
                double.tryParse('${g['target_amount'] ?? 0}') ?? 0.0;
            final matchedRemote = remote.any((r) {
              if (_goalIdString(r['id']) == id) return true;
              final rTitle =
                  r['title']?.toString().trim().toLowerCase() ?? '';
              final rTarget =
                  double.tryParse('${r['target_amount'] ?? 0}') ?? 0.0;
              return rTitle == title && rTarget == target;
            });
            return !matchedRemote;
          }).toList();
          final merged = [...remote, ...pendingLocal];
          await _setLocalGoals(merged);
          return merged;
        }
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API fetchGoals offline, using local storage: $e');
    }
    return await _getLocalGoals();
  }

  static Future<bool> addGoal(Map<String, dynamic> payload) async {
    lastGoalError = null;
    // 1. Simpan langsung ke local storage agar goal tidak pernah hilang
    final current = await _getLocalGoals();
    final tempId = 'goal_${DateTime.now().millisecondsSinceEpoch}';
    final item = Map<String, dynamic>.from(payload);
    final double initDeposit =
        double.tryParse('${payload['initial_deposit'] ?? payload['current_amount'] ?? 0}') ?? 0.0;
    item['id'] = tempId;
    item['current_amount'] = initDeposit;
    item['is_completed'] = 0;
    item['created_at'] = DateTime.now().toIso8601String();
    current.insert(0, item);
    await _setLocalGoals(current);

    if (initDeposit > 0) {
      await _setLocalFunds(tempId, [
        {
          'id': 'fund_${DateTime.now().millisecondsSinceEpoch}',
          'goal_id': tempId,
          'amount': initDeposit,
          'note': 'Setoran awal goal',
          'created_at': DateTime.now().toIso8601String(),
        },
      ]);
    }

    // 2. Coba sinkronisasi ke server jika API aktif
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/goals'),
            headers: headers,
            body: json.encode(payload),
          )
          .timeout(const Duration(seconds: 4));

      if (response.statusCode == 201) {
        final body = json.decode(response.body);
        final raw = body['data'];
        if (raw is Map) {
          final serverGoal = Map<String, dynamic>.from(raw);
          serverGoal['current_amount'] ??= initDeposit;
          for (final key in ['title', 'target_amount', 'icon', 'deadline']) {
            serverGoal[key] ??= item[key];
          }
          await _replaceLocalGoal(serverGoal);

          final list = await _getLocalGoals();
          list.removeWhere((g) => _goalIdString(g['id']) == tempId);
          await _setLocalGoals(list);
          try {
            final prefs = await SharedPreferences.getInstance();
            await prefs.remove(_goalFundsKey(tempId));
          } catch (_) {}
        }
        return true;
      }

      try {
        final body = json.decode(response.body);
        lastGoalError = body['message']?.toString();
      } catch (_) {}

      // Server menolak goal: hapus data sementara agar tidak muncul sebagai goal valid.
      final list = await _getLocalGoals();
      list.removeWhere((g) => _goalIdString(g['id']) == tempId);
      await _setLocalGoals(list);
      return false;
    } catch (e) {
      if (kDebugMode) debugPrint('API addGoal offline fallback: $e');
      return true; // Tetap berhasil karena sudah tersimpan di perangkat lokal
    }
  }

  static Future<Map<String, dynamic>> addGoalFund({
    required dynamic goalId,
    required double amount,
    String? note,
    int? walletId,
  }) async {
    if (!amount.isFinite || amount <= 0) {
      return {'success': false, 'message': 'Nominal setoran harus lebih dari 0.'};
    }

    final isServerGoal = _isServerGoalId(goalId);

    // Setoran membutuhkan server agar saldo aktif ikut terpotong.
    if (!isServerGoal) {
      return {
        'success': false,
        'message':
            'Goal ini belum tersinkron dengan server. Sambungkan internet lalu buka ulang halaman Goals.',
      };
    }

    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/goals/$goalId/funds'),
            headers: headers,
            body: json.encode({
              'amount': amount,
              'note': note ?? 'Setoran tabungan',
              if (walletId != null) 'wallet_id': walletId,
            }),
          )
          .timeout(const Duration(seconds: 5));

      Map<String, dynamic> body = {};
      try {
        body = Map<String, dynamic>.from(json.decode(response.body));
      } catch (_) {}

      if (response.statusCode == 201) {
        final data = body['data'];
        final rawGoal = data is Map ? data['goal'] : null;
        double? serverAmount;
        bool? serverCompleted;
        if (rawGoal is Map) {
          serverAmount = double.tryParse('${rawGoal['current_amount']}');
          final done = rawGoal['is_completed'];
          serverCompleted = done == 1 || done == true;
        }
        final updated = await _applyLocalFund(
          goalId: goalId,
          amount: amount,
          note: note,
          forcedAmount: serverAmount,
          completed: serverCompleted,
        );
        return {
          'success': true,
          'message': body['message'] ?? 'Setoran berhasil.',
          'current_amount': updated,
          'goal': rawGoal,
        };
      }

      return {
        'success': false,
        'message': body['message'] ?? 'Gagal menyetor dana. Silakan coba lagi.',
      };
    } catch (e) {
      if (kDebugMode) debugPrint('API addGoalFund offline: $e');
      return {
        'success': false,
        'message':
            'Tidak dapat terhubung ke server. Saldo aktif hanya bisa dipotong saat online.',
      };
    }
  }

  static Future<List<Map<String, dynamic>>> fetchGoalFunds(dynamic goalId) async {
    final local = await _getLocalFunds(goalId);
    if (!_isServerGoalId(goalId)) return local;

    try {
      final response = await http
          .get(Uri.parse('$baseUrl/goals/$goalId/funds'), headers: headers)
          .timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final body = json.decode(response.body);
        final rawList = body['data'];
        final remote = rawList is List
            ? rawList
                .whereType<Map>()
                .map((e) => Map<String, dynamic>.from(e))
                .toList()
            : <Map<String, dynamic>>[];
        final pendingLocal =
            local.where((f) => f['pending_sync'] == true).toList();
        final merged = [...remote, ...pendingLocal];
        await _setLocalFunds(goalId, merged);
        return merged;
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API fetchGoalFunds offline, using local: $e');
    }
    return local;
  }

  static Future<bool> deleteGoal(dynamic goalId) async {
    if (_isServerGoalId(goalId)) {
      try {
        final response = await http
            .delete(Uri.parse('$baseUrl/goals/$goalId'), headers: headers)
            .timeout(const Duration(seconds: 3));
        if (response.statusCode != 200 && response.statusCode != 404) {
          return false;
        }
      } catch (e) {
        if (kDebugMode) debugPrint('API deleteGoal offline: $e');
        return false;
      }
    }

    final current = await _getLocalGoals();
    current.removeWhere((g) => _goalIdString(g['id']) == _goalIdString(goalId));
    await _setLocalGoals(current);

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_goalFundsKey(goalId));
    } catch (_) {}

    return true;
  }

  // ================= INCOME SOURCES =================
  static Future<List<Map<String, dynamic>>> fetchIncomeSources() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/income-sources'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'];
        return list.map((e) => Map<String, dynamic>.from(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchIncomeSources: $e');
    }
    return [
      {'id': 1, 'source_name': 'Transfer Orang Tua'},
      {'id': 2, 'source_name': 'Beasiswa KIP-K'},
      {'id': 3, 'source_name': 'Gaji Magang / Freelance'},
    ];
  }

  static Future<bool> addIncomeSource(String sourceName) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/income-sources'),
        headers: headers,
        body: json.encode({'source_name': sourceName}),
      );
      return response.statusCode == 201;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error addIncomeSource: $e');
      return false;
    }
  }

  // ================= AI INSIGHTS =================
  static Future<List<Map<String, dynamic>>> fetchAiInsights() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/insights'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'];
        return list.map((e) => Map<String, dynamic>.from(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchAiInsights: $e');
    }
    return [
      {
        'id': 1,
        'insight_type': 'spending_habit',
        'content': 'Pengeluaran nongkrong/kopi minggu ini mencapai Rp 185.000. Coba kurangi 1 gelas seminggu untuk hemat Rp 80.000.',
        'created_at': DateTime.now().toIso8601String()
      },
      {
        'id': 2,
        'insight_type': 'saving_streak',
        'content': 'Hebat! Anda konsisten menabung selama 3 minggu berturut-turut untuk target Dana Darurat.',
        'created_at': DateTime.now().toIso8601String()
      }
    ];
  }

  // ================= REPORTS =================
  static Future<List<Map<String, dynamic>>> fetchReports() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/reports'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'];
        return list.map((e) => Map<String, dynamic>.from(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchReports: $e');
    }
    return [
      {
        'id': 1,
        'title': 'Laporan Arus Kas Oktober 2026',
        'report_type': 'monthly',
        'period_start': '2026-10-01',
        'period_end': '2026-10-31'
      }
    ];
  }

  // ================= SETTINGS =================
  static Future<Map<String, dynamic>> fetchUserSettings() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/settings'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        return body['data'] ?? {};
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchUserSettings: $e');
    }
    return {
      'currency': 'IDR',
      'language': 'id',
      'theme': 'light',
      'notification_enabled': 1,
    };
  }

  static Future<bool> updateUserSettings(Map<String, dynamic> payload) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/settings'),
        headers: headers,
        body: json.encode(payload),
      );
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error updateUserSettings: $e');
      return false;
    }
  }

  // ================= WALLETS =================
  static Future<Map<String, dynamic>> fetchWallets() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/wallets'), headers: headers);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchWallets: $e');
    }
    return {'success': false, 'data': [], 'totalBalance': 2450000};
  }

  static Future<Map<String, dynamic>> adjustWalletBalance({
    required int walletId,
    required String type, // 'add' or 'subtract'
    required double amount,
    String? note,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/wallets/$walletId/adjust'),
        headers: headers,
        body: json.encode({
          'type': type,
          'amount': amount,
          'note': note ?? (type == 'add' ? 'Penyesuaian Tambah Saldo' : 'Penyesuaian Kurangi Saldo'),
        }),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        final body = json.decode(response.body);
        return {'success': false, 'message': body['message'] ?? 'Gagal menyesuaikan saldo'};
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error adjustWalletBalance: $e');
      return {'success': false, 'message': e.toString()};
    }
  }

  static Future<Map<String, dynamic>> setupInitialWalletBalance(double amount) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/wallets/setup-initial'),
        headers: headers,
        body: json.encode({
          'amount': amount,
          'wallet_name': 'Dompet Utama',
        }),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error setupInitialWalletBalance: $e');
    }
    return {'success': false};
  }

  // ================= LUPA KATA SANDI & OTP =================
  static Future<Map<String, dynamic>> sendForgotPasswordOtp(String email) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/forgot-password'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({'email': email.trim().toLowerCase()}),
          )
          .timeout(const Duration(seconds: 4));

      final body = json.decode(response.body);
      return {
        'success': response.statusCode == 200,
        'message': body['message'] ?? 'Kode pemulihan telah dikirim.',
        'otp': body['otp'],
      };
    } catch (e) {
      if (kDebugMode) debugPrint('API Error sendForgotPasswordOtp: $e');
      return {
        'success': false,
        'message': 'Tidak dapat terhubung ke server backend. Pastikan server BE dan MySQL aktif.',
      };
    }
  }

  static Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/verify-otp'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'email': email.trim().toLowerCase(),
              'otp': otp.trim(),
            }),
          )
          .timeout(const Duration(seconds: 4));

      final body = json.decode(response.body);
      return {
        'success': response.statusCode == 200,
        'message': body['message'] ?? 'Verifikasi OTP berhasil.',
      };
    } catch (e) {
      if (kDebugMode) debugPrint('API Error verifyOtp: $e');
      return {
        'success': false,
        'message': 'Gagal memverifikasi ke server backend.',
      };
    }
  }

  static Future<Map<String, dynamic>> resetPassword({
    required String email,
    required String newPassword,
    required String otp,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/reset-password'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'email': email.trim().toLowerCase(),
              'newPassword': newPassword,
              'otp': otp.trim(),
            }),
          )
          .timeout(const Duration(seconds: 4));

      final body = json.decode(response.body);
      return {
        'success': response.statusCode == 200,
        'message': body['message'] ?? 'Kata sandi berhasil diperbarui.',
      };
    } catch (e) {
      if (kDebugMode) debugPrint('API Error resetPassword: $e');
      return {
        'success': false,
        'message': 'Gagal memperbarui sandi ke server backend.',
      };
    }
  }

  // ================= NOTIFIKASI =================
  static Future<List<Map<String, dynamic>>> fetchNotifications() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/notifications'), headers: headers)
          .timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final dynamic data = body['data'];
        List<dynamic> list = [];
        if (data is Map && data.containsKey('notifications')) {
          list = data['notifications'];
        } else if (data is List) {
          list = data;
        }
        return list.map((e) => Map<String, dynamic>.from(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchNotifications: $e');
    }
    return [];
  }

  static Future<bool> markNotificationAsRead(int notifId) async {
    try {
      final response = await http
          .put(Uri.parse('$baseUrl/notifications/$notifId/read'), headers: headers)
          .timeout(const Duration(seconds: 3));
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error markNotificationAsRead: $e');
      return false;
    }
  }

  static Future<bool> markAllNotificationsAsRead() async {
    try {
      final response = await http
          .put(Uri.parse('$baseUrl/notifications/read-all'), headers: headers)
          .timeout(const Duration(seconds: 3));
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error markAllNotificationsAsRead: $e');
      return false;
    }
  }

  // ================= PROFIL PENGGUNA =================
  static Future<Map<String, dynamic>?> fetchProfile() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/users/me'), headers: headers)
          .timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final body = json.decode(response.body);
        return body['data'] ?? body;
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchProfile: $e');
    }
    return null;
  }

  static Future<bool> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await http
          .put(
            Uri.parse('$baseUrl/users/me'),
            headers: headers,
            body: json.encode(data),
          )
          .timeout(const Duration(seconds: 4));
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error updateProfile: $e');
      return false;
    }
  }
}

