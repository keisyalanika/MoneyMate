import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../services/auth_provider.dart';
import 'password_success_modal.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String? email;
  final String? otp;

  const ResetPasswordScreen({
    super.key,
    this.email,
    this.otp,
  });

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  bool _obscureText1 = true;
  bool _obscureText2 = true;
  bool _isLoading = false;

  final TextEditingController _passController1 = TextEditingController();
  final TextEditingController _passController2 = TextEditingController();

  @override
  void initState() {
    super.initState();
    _passController1.addListener(() => setState(() {}));
    _passController2.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _passController1.dispose();
    _passController2.dispose();
    super.dispose();
  }

  bool get _hasMin8 => _passController1.text.length >= 8;
  bool get _hasUpperLower =>
      RegExp(r'(?=.*[a-z])(?=.*[A-Z])').hasMatch(_passController1.text);
  bool get _hasDigits => RegExp(r'[0-9]').hasMatch(_passController1.text);
  bool get _hasSpecial =>
      RegExp(r'[!@#\$%^&*(),.?":{}|<>]').hasMatch(_passController1.text);

  int get _strengthScore {
    int score = 0;
    if (_hasMin8) score++;
    if (_hasUpperLower) score++;
    if (_hasDigits) score++;
    if (_hasSpecial) score++;
    return score;
  }

  String get _strengthLabel {
    switch (_strengthScore) {
      case 1:
        return 'Lemah';
      case 2:
        return 'Cukup';
      case 3:
        return 'Kuat 👍';
      case 4:
        return 'Sangat Kuat 🔒';
      default:
        return 'Sangat Lemah';
    }
  }

  int get _strengthPercent {
    switch (_strengthScore) {
      case 1:
        return 25;
      case 2:
        return 50;
      case 3:
        return 75;
      case 4:
        return 100;
      default:
        return 10;
    }
  }

  bool get _isMatch =>
      _passController1.text.isNotEmpty &&
      _passController1.text == _passController2.text;

  // fungsi menampilkan Modal / Bottom Sheet Sukses
  void _showSuccessBottomSheet(BuildContext context) {
    showPasswordResetSuccessModal(context);
  }

  Future<void> _handleResetPassword() async {
    final pass1 = _passController1.text.trim();
    final pass2 = _passController2.text.trim();

    if (pass1.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan masukkan kata sandi baru.'),
          backgroundColor: AppColors.errorText,
        ),
      );
      return;
    }

    if (pass1.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Kata sandi baru minimal 6 karakter.'),
          backgroundColor: AppColors.errorText,
        ),
      );
      return;
    }

    if (pass1 != pass2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Konfirmasi kata sandi tidak cocok.'),
          backgroundColor: AppColors.errorText,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final res = await auth.resetPassword(
      email: widget.email ?? '',
      newPassword: pass1,
      otp: widget.otp ?? '',
    );
    if (!mounted) return;
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      _showSuccessBottomSheet(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Gagal mereset kata sandi.'),
          backgroundColor: AppColors.errorText,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Container(
          margin: const EdgeInsets.all(8),
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: const Icon(Icons.arrow_back,
                color: AppColors.textDark, size: 18),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16, top: 12, bottom: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.iconBg,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: const [
                Icon(Icons.circle, size: 6, color: AppColors.accentOrange),
                SizedBox(width: 6),
                Text(
                  'LANGKAH 3/3',
                  style: TextStyle(
                    color: AppColors.primaryBrown,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            const Text(
              'Buat Kata Sandi Baru',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Kata sandi baru Anda harus berbeda dari kata sandi yang pernah digunakan sebelumnya.',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 24),

            // Input Kata Sandi Baru
            const Text(
              'Kata Sandi Baru',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _passController1,
              obscureText: _obscureText1,
              style: const TextStyle(
                color: AppColors.textDark,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
              decoration: InputDecoration(
                hintText: 'Masukkan kata sandi baru',
                prefixIcon: const Icon(
                  Icons.lock_outline,
                  color: AppColors.textDark,
                  size: 20,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureText1
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    color: AppColors.textMuted,
                    size: 20,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureText1 = !_obscureText1;
                    });
                  },
                ),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.inputBorder),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.inputBorder),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.primaryBrown),
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
            const SizedBox(height: 12),

            // Box Kekuatan Sandi (Strength Meter Card)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.inputBg,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Kekuatan Sandi: $_strengthLabel',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryBrown,
                        ),
                      ),
                      Text(
                        '$_strengthPercent% Aman',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryBrown,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Progress Bars (4 Segment)
                  Row(
                    children: [
                      Expanded(child: _buildBar(_strengthScore >= 1)),
                      const SizedBox(width: 6),
                      Expanded(child: _buildBar(_strengthScore >= 2)),
                      const SizedBox(width: 6),
                      Expanded(
                          child: _buildBar(_strengthScore >= 3, isDark: true)),
                      const SizedBox(width: 6),
                      Expanded(
                          child: _buildBar(_strengthScore >= 4, isDark: true)),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Checklists
                  _buildCheckItem('Minimal 8 karakter', _hasMin8),
                  const SizedBox(height: 6),
                  _buildCheckItem(
                      'Mengandung huruf besar & kecil', _hasUpperLower),
                  const SizedBox(height: 6),
                  _buildCheckItem('Mengandung angka', _hasDigits),
                  const SizedBox(height: 6),
                  _buildCheckItem(
                      'Mengandung simbol/karakter khusus', _hasSpecial),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Input Konfirmasi Kata Sandi Baru
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Konfirmasi Kata Sandi Baru',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                    fontSize: 13,
                  ),
                ),
                if (_passController2.text.isNotEmpty)
                  Row(
                    children: [
                      Icon(
                        _isMatch ? Icons.check_circle : Icons.cancel_outlined,
                        size: 14,
                        color: _isMatch
                            ? AppColors.greenAccent
                            : AppColors.errorText,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _isMatch ? 'Cocok' : 'Tidak Cocok',
                        style: TextStyle(
                          color: _isMatch
                              ? AppColors.greenAccent
                              : AppColors.errorText,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _passController2,
              obscureText: _obscureText2,
              style: const TextStyle(
                color: AppColors.textDark,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
              decoration: InputDecoration(
                hintText: 'Ulangi kata sandi baru',
                prefixIcon: const Icon(
                  Icons.lock_outline,
                  color: AppColors.textDark,
                  size: 20,
                ),
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureText2
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    color: AppColors.textMuted,
                    size: 20,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureText2 = !_obscureText2;
                    });
                  },
                ),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.inputBorder),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.inputBorder),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.primaryBrown),
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
            const SizedBox(height: 10),

            // Encryption Info
            Row(
              children: const [
                Icon(
                  Icons.shield_outlined,
                  size: 14,
                  color: AppColors.accentOrange,
                ),
                SizedBox(width: 6),
                Text(
                  'Sandi terenkripsi penuh standar keamanan perbankan',
                  style: TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),

            // Button Simpan Kata Sandi Baru
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBrown,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                onPressed: _isLoading ? null : _handleResetPassword,
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor:
                              AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text(
                            'Simpan Kata Sandi Baru',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward,
                              color: Colors.white, size: 18),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 20),

            // CS Help Link
            Center(
              child: RichText(
                text: const TextSpan(
                  style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                  children: [
                    TextSpan(text: 'Butuh bantuan? '),
                    TextSpan(
                      text: 'Hubungi CS MoneyMate',
                      style: TextStyle(
                        color: AppColors.accentOrange,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildBar(bool isActive, {bool isDark = false}) {
    return Container(
      height: 6,
      decoration: BoxDecoration(
        color: !isActive
            ? AppColors.inputBorder
            : (isDark ? AppColors.primaryBrown : AppColors.accentOrange),
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }

  Widget _buildCheckItem(String text, bool isChecked) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            color: isChecked ? AppColors.greenAccent : AppColors.inputBorder,
            shape: BoxShape.circle,
          ),
          child: Icon(
            Icons.check,
            size: 10,
            color: isChecked ? Colors.white : AppColors.textMuted,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          text,
          style: TextStyle(
            fontSize: 11,
            color: isChecked ? AppColors.textDark : AppColors.textMuted,
            fontWeight: isChecked ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ],
    );
  }
}
