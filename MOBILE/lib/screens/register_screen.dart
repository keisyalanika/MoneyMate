import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../utils/theme.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  bool _agreeToTerms = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Buat Akun Baru',
                  style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark)),
              const SizedBox(height: 4),
              const Text(
                  'Daftar untuk mulai kelola keuanganmu\nbersama MoneyMate',
                  style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
              const SizedBox(height: 20),
              _buildInputField('Nama Lengkap', 'Masukkan nama lengkap',
                  Icons.person_outline),
              const SizedBox(height: 12),
              _buildInputField(
                  'Email', 'Masukkan email kamu', Icons.email_outlined),
              const SizedBox(height: 12),
              _buildInputField('Nomor Handphone', 'Contoh: 0812 3456 7890',
                  Icons.phone_outlined),
              const SizedBox(height: 12),
              _buildInputField(
                  'Kata Sandi', 'Buat kata sandi', Icons.lock_outline,
                  isPassword: true),
              const SizedBox(height: 12),
              _buildInputField('Konfirmasi Kata Sandi', 'Konfirmasi kata sandi',
                  Icons.lock_outline,
                  isPassword: true),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: Checkbox(
                      value: _agreeToTerms,
                      activeColor: AppColors.primaryBrown,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4)),
                      onChanged: (val) =>
                          setState(() => _agreeToTerms = val ?? false),
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text.rich(
                      TextSpan(
                        style:
                            TextStyle(fontSize: 11, color: AppColors.textDark),
                        children: [
                          TextSpan(text: 'Saya setuju dengan '),
                          TextSpan(
                              text: 'Syarat & Ketentuan',
                              style: TextStyle(
                                  color: AppColors.accentOrange,
                                  fontWeight: FontWeight.bold)),
                          TextSpan(text: ' dan '),
                          TextSpan(
                              text: 'Kebijakan Privasi',
                              style: TextStyle(
                                  color: AppColors.accentOrange,
                                  fontWeight: FontWeight.bold)),
                          TextSpan(text: ' MoneyMate'),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBrown,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  onPressed: () => Navigator.pushReplacementNamed(
                      context, AppRouter.mainNav),
                  child: const Text('Daftar',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15)),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Sudah punya akun? ',
                      style:
                          TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Text('Masuk di sini',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryBrown)),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(String label, String hint, IconData icon,
      {bool isPassword = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.textDark)),
        const SizedBox(height: 6),
        TextField(
          obscureText: isPassword,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle:
                const TextStyle(fontSize: 13, color: AppColors.textMuted),
            prefixIcon: Icon(icon, size: 20, color: AppColors.textMuted),
            suffixIcon: isPassword
                ? const Icon(Icons.visibility_outlined,
                    size: 20, color: AppColors.textMuted)
                : null,
            filled: true,
            fillColor: AppColors.cardWhite,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: AppColors.inputBorder)),
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: const BorderSide(color: AppColors.primaryBrown)),
          ),
        ),
      ],
    );
  }
}
