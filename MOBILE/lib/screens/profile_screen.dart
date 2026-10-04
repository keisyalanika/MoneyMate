import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../utils/theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // State profil pengguna (mudah dihubungkan ke backend / Provider nantinya)
  String _userName = 'Keisya Exa Haniyah';
  String _userEmail = 'keisya.haniyah@gmail.com';

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text(
          'Keluar dari Akun?',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: AppColors.primaryBrown,
            fontSize: 18,
          ),
        ),
        content: const Text(
          'Kamu harus masuk kembali untuk mengakses data keuangan MoneyMate.',
          style: TextStyle(fontSize: 13, color: AppColors.textDark),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal', style: TextStyle(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE53935),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pushNamedAndRemoveUntil(context, AppRouter.login, (route) => false);
            },
            child: const Text('Keluar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Menghitung lebar layar untuk membagi card menu menjadi 3 kolom yang proporsional
    final screenWidth = MediaQuery.of(context).size.width;
    final cardWidth = (screenWidth - 40 - 32) / 3; // 40 = padding horizontal (20 kiri, 20 kanan), 32 = jarak antar card (16 * 2)

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // 1. Header Title
              const Text(
                'Profil Saya',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 32),

              // 2. Avatar
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: AppColors.primaryBrown,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryBrown.withValues(alpha: 0.2),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    _userName.isNotEmpty ? _userName[0].toUpperCase() : 'M',
                    style: const TextStyle(
                      fontSize: 40,
                      color: Colors.white,
                      fontFamily: 'serif',
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 3. User Info
              Text(
                _userName,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _userEmail,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 32),

              // 4. Grid Menu Options (Navigasi ke 5 Halaman Fitur)
              Wrap(
                spacing: 16,
                runSpacing: 16,
                alignment: WrapAlignment.center,
                children: [
                  _buildMenuCard(
                    width: cardWidth,
                    icon: Icons.edit_rounded,
                    title: 'Edit Profil',
                    onTap: () async {
                      final updated = await Navigator.pushNamed(context, AppRouter.editProfile);
                      if (updated != null && updated is Map<String, dynamic>) {
                        setState(() {
                          if (updated['name'] != null && updated['name'].toString().isNotEmpty) {
                            _userName = updated['name'];
                          }
                          if (updated['email'] != null && updated['email'].toString().isNotEmpty) {
                            _userEmail = updated['email'];
                          }
                        });
                      }
                    },
                  ),
                  _buildMenuCard(
                    width: cardWidth,
                    icon: Icons.notifications_rounded,
                    title: 'Notifikasi',
                    onTap: () => Navigator.pushNamed(context, AppRouter.profileNotification),
                  ),
                  _buildMenuCard(
                    width: cardWidth,
                    icon: Icons.account_balance_rounded,
                    title: 'Hubungkan\nBank',
                    onTap: () => Navigator.pushNamed(context, AppRouter.connectBank),
                  ),
                  _buildMenuCard(
                    width: cardWidth,
                    icon: Icons.security_rounded,
                    title: 'Keamanan',
                    onTap: () => Navigator.pushNamed(context, AppRouter.security),
                  ),
                  _buildMenuCard(
                    width: cardWidth,
                    icon: Icons.help_outline_rounded,
                    title: 'Bantuan',
                    onTap: () => Navigator.pushNamed(context, AppRouter.helpCenter),
                  ),
                  // Kotak kosong (invisible) agar alignment Wrap tetap rapi di sebelah kiri untuk baris kedua
                  SizedBox(width: cardWidth),
                ],
              ),
              const SizedBox(height: 32),

              // 5. App Usage Statistics Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'App Usage Statistics',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildStatRow('Kebutuhan Pokok', 'Rp 1.750.000'),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      child: Divider(color: AppColors.inputBorder, height: 1),
                    ),
                    _buildStatRow('Transportasi', 'Rp 500.000'),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 6. Tombol Logout Sederhana
              SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFEF9A9A)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    backgroundColor: Colors.white,
                  ),
                  icon: const Icon(Icons.logout_rounded, color: Color(0xFFE53935), size: 18),
                  label: const Text(
                    'Keluar dari Akun',
                    style: TextStyle(
                      color: Color(0xFFE53935),
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                  onPressed: () => _showLogoutDialog(context),
                ),
              ),

              const SizedBox(height: 40), // Spacing tambahan untuk bottom navigation
            ],
          ),
        ),
      ),
    );
  }

  // Widget Builder untuk Card Menu dengan Ripple Effect & Navigasi
  Widget _buildMenuCard({
    required double width,
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        splashColor: AppColors.primaryBrown.withValues(alpha: 0.1),
        highlightColor: AppColors.primaryBrown.withValues(alpha: 0.05),
        child: Container(
          width: width,
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: AppColors.background,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: AppColors.primaryBrown,
                  size: 20,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primaryBrown,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Widget Builder untuk baris statistik
  Widget _buildStatRow(String label, String amount) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            color: AppColors.textMuted,
          ),
        ),
        Text(
          amount,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
      ],
    );
  }
}