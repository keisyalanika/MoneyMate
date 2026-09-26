import 'package:flutter/material.dart';

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  final String _userName = 'Keisya Exa Haniyah';
  final double _saldo = 2450000.0;
  final double _sisaBudget = 850000.0;

  bool get isLoggedIn => _isLoggedIn;
  String get userName => _userName;
  double get saldo => _saldo;
  double get sisaBudget => _sisaBudget;

  void login(String email, String password) {
    // Logika simulasi login
    _isLoggedIn = true;
    notifyListeners();
  }

  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }
}
