import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../navigation/app_router.dart';
import '../services/auth_provider.dart';
import 'notification_screen.dart';
import '../utils/theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String? _localUserName;
  String? _localUserEmail;

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
              Provider.of<AuthProvider>(context, listen: false).logout();
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
    // Menghitung lebar layar untuk membagi card menu menjadi 2 kolom yang proporsional
    final screenWidth = MediaQuery.of(context).size.width;
    final cardWidth = (screenWidth - 40 - 16) / 2; // 40 = padding horizontal (20 kiri, 20 kanan), 16 = jarak antar card

    final auth = Provider.of<AuthProvider>(context);
    final userName = _localUserName ?? (auth.userName.isNotEmpty && auth.userName != 'Guest' ? auth.userName : 'Pengguna MoneyMate');
    final userEmail = _localUserEmail ?? (auth.userEmail.isNotEmpty ? auth.userEmail : (auth.token != null ? '${userName.toLowerCase().replaceAll(' ', '.')}@email.com' : 'Belum masuk'));
    final userNickname = auth.userNickname;
    final initialLetter = auth.userInitial;

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
                    initialLetter,
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
                userName,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              if (userNickname.isNotEmpty && userNickname != userName) ...[
                const SizedBox(height: 2),
                Text(
                  '@$userNickname',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFFD95B27),
                  ),
                ),
              ],
              const SizedBox(height: 4),
              Text(
                userEmail,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 32),

              // 4. Grid Menu Options (Navigasi Menu Profil)
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
                            _localUserName = updated['name'];
                          }
                          if (updated['email'] != null && updated['email'].toString().isNotEmpty) {
                            _localUserEmail = updated['email'];
                          }
                        });
                        auth.updateProfileData(
                          name: updated['name'],
                          nickname: updated['nickname'],
                          email: updated['email'],
                          phone: updated['phone'],
                        );
                      }
                    },
                  ),
                  _buildMenuCard(
                    width: cardWidth,
                    icon: Icons.notifications_rounded,
                    title: 'Notifikasi',
                    onTap: () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const NotificationScreen()));
                    },
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
                ],
              ),
              const SizedBox(height: 32),

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
}