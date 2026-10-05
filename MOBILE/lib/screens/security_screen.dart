import 'package:flutter/material.dart';
import '../utils/theme.dart';

<<<<<<< HEAD
class SecurityScreen extends StatefulWidget {
  const SecurityScreen({super.key});

  @override
  State<SecurityScreen> createState() => _SecurityScreenState();
}

class _SecurityScreenState extends State<SecurityScreen> {
  // State pengaturan keamanan (siap dihubungkan ke backend / local storage)
  bool _twoFactorAuth = false;
  bool _hideBalanceByDefault = false;

  void _showChangePasswordDialog() {
    final oldPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();
    bool obscureOld = true;
    bool obscureNew = true;
    bool obscureConfirm = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Ubah Kata Sandi',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Text(
                'Kata Sandi Lama',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: oldPasswordController,
                obscureText: obscureOld,
                decoration: InputDecoration(
                  hintText: 'Masukkan kata sandi saat ini',
                  hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.inputBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  suffixIcon: IconButton(
                    icon: Icon(obscureOld ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
                    onPressed: () => setModalState(() => obscureOld = !obscureOld),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.inputBorder),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                'Kata Sandi Baru',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: newPasswordController,
                obscureText: obscureNew,
                decoration: InputDecoration(
                  hintText: 'Minimal 8 karakter',
                  hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.inputBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  suffixIcon: IconButton(
                    icon: Icon(obscureNew ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
                    onPressed: () => setModalState(() => obscureNew = !obscureNew),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.inputBorder),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                'Konfirmasi Kata Sandi Baru',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: confirmPasswordController,
                obscureText: obscureConfirm,
                decoration: InputDecoration(
                  hintText: 'Ulangi kata sandi baru',
                  hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.inputBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  suffixIcon: IconButton(
                    icon: Icon(obscureConfirm ? Icons.visibility_outlined : Icons.visibility_off_outlined, size: 20),
                    onPressed: () => setModalState(() => obscureConfirm = !obscureConfirm),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.inputBorder),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBrown,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    if (newPasswordController.text.length < 8) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Kata sandi baru minimal 8 karakter')),
                      );
                      return;
                    }
                    if (newPasswordController.text != confirmPasswordController.text) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Konfirmasi kata sandi tidak cocok')),
                      );
                      return;
                    }

                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Kata sandi berhasil diubah! (Siap disambungkan ke API backend)'),
                        backgroundColor: AppColors.primaryBrown,
                      ),
                    );
                  },
                  child: const Text('Simpan Kata Sandi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
=======
class SecurityScreen extends StatelessWidget {
  const SecurityScreen({super.key});

  @override
>>>>>>> dev/lanika
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
<<<<<<< HEAD
        title: const Text(
          'Keamanan Akun',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.primaryBrown,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppColors.primaryBrown, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Bagian 1: Autentikasi
              const Text(
                'Autentikasi & Sandi',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: [
                    ListTile(
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.lock_reset_rounded, color: AppColors.primaryBrown, size: 20),
                      ),
                      title: const Text('Ubah Kata Sandi', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      subtitle: const Text('Ganti sandi akun secara berkala', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted),
                      onTap: _showChangePasswordDialog,
                    ),
                    const Divider(height: 1, color: AppColors.inputBorder),
                    _buildSwitchItem(
                      icon: Icons.verified_user_outlined,
                      title: 'Verifikasi 2 Langkah (2FA)',
                      subtitle: 'Perlindungan ekstra via SMS/Authenticator',
                      value: _twoFactorAuth,
                      onChanged: (val) {
                        setState(() => _twoFactorAuth = val);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(_twoFactorAuth ? '2FA diaktifkan' : '2FA dinonaktifkan')),
                        );
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Bagian 2: Privasi
              const Text(
                'Privasi Tampilan',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: _buildSwitchItem(
                  icon: Icons.visibility_off_outlined,
                  title: 'Sembunyikan Saldo Default',
                  subtitle: 'Saldo disamarkan dengan tanda bintang saat dibuka',
                  value: _hideBalanceByDefault,
                  onChanged: (val) {
                    setState(() => _hideBalanceByDefault = val);
                  },
                ),
              ),

              const SizedBox(height: 24),

              // Bagian 3: Riwayat Perangkat Aktif
              const Text(
                'Perangkat Aktif',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.phone_iphone_rounded, color: AppColors.primaryBrown, size: 28),
                        SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Perangkat Ini (Mobile App)',
                                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textDark),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Jakarta, Indonesia • Aktif Sekarang',
                                style: TextStyle(fontSize: 11, color: AppColors.greenAccent, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSwitchItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppColors.primaryBrown, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textDark),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeThumbColor: Colors.white,
            activeTrackColor: AppColors.primaryBrown,
            inactiveThumbColor: Colors.white,
            inactiveTrackColor: Colors.grey.shade300,
          ),
        ],
=======
        title: const Text('Keamanan', style: TextStyle(color: AppColors.primaryBrown)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.primaryBrown),
      ),
      body: const Center(
        child: Text('Halaman Keamanan', style: TextStyle(color: AppColors.textDark)),
>>>>>>> dev/lanika
      ),
    );
  }
}
