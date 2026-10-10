import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'api_service.dart';

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  String _userName = 'Guest';
  String _role = 'user';
  String? _token;
  
  double _saldo = 2450000.0;
  double _sisaBudget = 850000.0;

  bool get isLoggedIn => _isLoggedIn;
  String get userName => _userName;
  String get role => _role;
  String? get token => _token;
  double get saldo => _saldo;
  double get sisaBudget => _sisaBudget;

  Future<bool> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiService.baseUrl}/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _isLoggedIn = true;
        _userName = data['name'];
        _role = data['role'];
        _token = data['token'];
        notifyListeners();
        return true;
      } else {
        debugPrint('Login failed: ${response.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Error logging in: $e');
      return false;
    }
  }

  void logout() {
    _isLoggedIn = false;
    _userName = 'Guest';
    _role = 'user';
    _token = null;
    notifyListeners();
  }
}
