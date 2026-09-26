import 'package:flutter/material.dart';
import '../utils/theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

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
                child: const Center(
                  child: Text(
                    'M',
                    style: TextStyle(
                      fontSize: 40,
                      color: Colors.white,
                      fontFamily: 'serif', // Memberikan kesan font klasik seperti di gambar
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 3. User Info
              const Text(
                '[Nama User]',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                '[Email User]',
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 32),

              // 4. Grid Menu Options
              Wrap(
                spacing: 16,
                runSpacing: 16,
                alignment: WrapAlignment.center,
                children: [
                  _buildMenuCard(cardWidth, Icons.edit, 'Edit Profil'),
                  _buildMenuCard(cardWidth, Icons.notifications, 'Notifikasi'),
                  _buildMenuCard(cardWidth, Icons.account_balance, 'Hubungkan\nBank'),
                  _buildMenuCard(cardWidth, Icons.security, 'Keamanan'),
                  _buildMenuCard(cardWidth, Icons.help, 'Bantuan'),
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
              
              const SizedBox(height: 40), // Spacing tambahan untuk bottom navigation
            ],
          ),
        ),
      ),
    );
  }

  // Widget Builder untuk Card Menu
  Widget _buildMenuCard(double width, IconData icon, String title) {
    return Container(
      width: width,
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              color: AppColors.background, // Warna background icon
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