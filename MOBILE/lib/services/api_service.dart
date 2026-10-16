import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/transaction_model.dart';
import '../models/category_model.dart';
import '../models/budget_model.dart';

class ApiService {
  // Use 10.0.2.2:5001 for Android Emulator, localhost:5001 for iOS / Desktop / Web
  // (Port 5001 is used by default because macOS AirPlay Receiver occupies port 5000)
  static const String baseUrl = 'http://10.0.2.2:5001/api';
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

  // ================= GOALS =================
  static Future<List<Map<String, dynamic>>> fetchGoals() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/goals'), headers: headers);
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = json.decode(response.body);
        final List<dynamic> list = body['data'];
        return list.map((e) => Map<String, dynamic>.from(e)).toList();
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchGoals: $e');
    }
    return [];
  }

  static Future<bool> addGoal(Map<String, dynamic> payload) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/goals'),
        headers: headers,
        body: json.encode(payload),
      );
      return response.statusCode == 201;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error addGoal: $e');
      return false;
    }
  }

  static Future<bool> addGoalFund(dynamic goalId, double amount, [String? note]) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/goals/$goalId/funds'),
        headers: headers,
        body: json.encode({'amount': amount, 'note': note ?? 'Setoran tabungan'}),
      );
      return response.statusCode == 201;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error addGoalFund: $e');
      return false;
    }
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

  // ================= WALLETS & BALANCE =================
  static Future<Map<String, dynamic>> fetchWallets() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/wallets'), headers: headers);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error fetchWallets: $e');
    }
    return {'data': [], 'totalBalance': 2450000};
  }

  static Future<bool> setupInitialBalance(double amount, [String? walletName]) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/wallets/setup-initial'),
        headers: headers,
        body: json.encode({'amount': amount, 'wallet_name': walletName ?? 'Dompet Utama'}),
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error setupInitialBalance: $e');
      return false;
    }
  }

  static Future<bool> adjustWalletBalance(dynamic walletId, String type, double amount, [String? note]) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/wallets/$walletId/adjust'),
        headers: headers,
        body: json.encode({'type': type, 'amount': amount, 'note': note}),
      );
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error adjustWalletBalance: $e');
      return false;
    }
  }

  // ================= AI FINANCIAL CHAT =================
  static Future<Map<String, dynamic>?> chatWithAi(String message) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/insights/chat'),
        headers: headers,
        body: json.encode({'message': message}),
      );
      if (response.statusCode == 200) {
        final decoded = json.decode(response.body);
        return decoded['data'];
      }
    } catch (e) {
      if (kDebugMode) debugPrint('API Error chatWithAi: $e');
    }
    return null;
  }

  // ================= FORGOT & RESET PASSWORD =================
  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/forgot-password'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email.trim().toLowerCase()}),
      );
      return json.decode(response.body);
    } catch (e) {
      if (kDebugMode) debugPrint('API Error forgotPassword: $e');
      return {'success': false, 'message': 'Gagal menghubungi server'};
    }
  }

  static Future<Map<String, dynamic>> verifyOtp(String email, String otpCode) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email.trim().toLowerCase(), 'otp_code': otpCode.trim()}),
      );
      return json.decode(response.body);
    } catch (e) {
      if (kDebugMode) debugPrint('API Error verifyOtp: $e');
      return {'success': false, 'message': 'Gagal memverifikasi OTP'};
    }
  }

  static Future<Map<String, dynamic>> resetPassword(String email, String otpCode, String newPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email.trim().toLowerCase(),
          'otp_code': otpCode.trim(),
          'new_password': newPassword
        }),
      );
      return json.decode(response.body);
    } catch (e) {
      if (kDebugMode) debugPrint('API Error resetPassword: $e');
      return {'success': false, 'message': 'Gagal mereset kata sandi'};
    }
  }

  // ================= PROFILE =================
  static Future<bool> updateProfile(Map<String, dynamic> payload) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/auth/profile'),
        headers: headers,
        body: json.encode(payload),
      );
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error updateProfile: $e');
      return false;
    }
  }

  // ================= CATEGORY PINNING =================
  static Future<bool> togglePinCategory(dynamic categoryId, bool isPinned) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/categories/$categoryId/pin'),
        headers: headers,
        body: json.encode({'is_pinned': isPinned}),
      );
      return response.statusCode == 200;
    } catch (e) {
      if (kDebugMode) debugPrint('API Error togglePinCategory: $e');
      return false;
    }
  }
}

