import 'package:flutter/material.dart';
import '../utils/theme.dart';

class SecurityScreen extends StatelessWidget {
  const SecurityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Keamanan', style: TextStyle(color: AppColors.primaryBrown)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.primaryBrown),
      ),
      body: const Center(
        child: Text('Halaman Keamanan', style: TextStyle(color: AppColors.textDark)),
      ),
    );
  }
}
