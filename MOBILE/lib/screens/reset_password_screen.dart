import 'package:flutter/material.dart';
import '../utils/theme.dart';
import 'password_success_modal.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  bool _obscureText1 = false;
  bool _obscureText2 = true;

  final TextEditingController _passController1 =
      TextEditingController(text: 'Semester3!');
  final TextEditingController _passController2 =
      TextEditingController(text: 'Semester3!');

  @override
  void dispose() {
    _passController1.dispose();
    _passController2.dispose();
    super.dispose();
  }

  // fungsi menampilkan Modal / Bottom Sheet Sukses
  // fungsi menampilkan Modal / Bottom Sheet Sukses
  void _showSuccessBottomSheet(BuildContext context) {
    showPasswordResetSuccessModal(context);
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
                    children: const [
                      Text(
                        'Kekuatan Sandi: Kuat 👍',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryBrown,
                        ),
                      ),
                      Text(
                        '75% Aman',
                        style: TextStyle(
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
                      Expanded(child: _buildBar(true)),
                      const SizedBox(width: 6),
                      Expanded(child: _buildBar(true)),
                      const SizedBox(width: 6),
                      Expanded(child: _buildBar(true, isDark: true)),
                      const SizedBox(width: 6),
                      Expanded(child: _buildBar(false)),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Checklists
                  _buildCheckItem('Minimal 8 karakter', true),
                  const SizedBox(height: 6),
                  _buildCheckItem('Mengandung huruf besar & kecil', true),
                  const SizedBox(height: 6),
                  _buildCheckItem('Mengandung angka', true),
                  const SizedBox(height: 6),
                  _buildCheckItem('Mengandung simbol/karakter khusus', true),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Input Konfirmasi Kata Sandi Baru
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text(
                  'Konfirmasi Kata Sandi Baru',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                    fontSize: 13,
                  ),
                ),
                Row(
                  children: [
                    Icon(
                      Icons.check,
                      size: 14,
                      color: AppColors.accentOrange,
                    ),
                    SizedBox(width: 4),
                    Text(
                      'Cocok',
                      style: TextStyle(
                        color: AppColors.accentOrange,
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
                onPressed: () => _showSuccessBottomSheet(context),
                child: Row(
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
                    Icon(Icons.arrow_forward, color: Colors.white, size: 18),
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
          decoration: const BoxDecoration(
            color: AppColors.accentOrange,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.check,
            size: 10,
            color: Colors.white,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          text,
          style: const TextStyle(
            fontSize: 11,
            color: AppColors.textDark,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
