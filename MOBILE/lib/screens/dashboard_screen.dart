import 'package:flutter/material.dart';
import '../utils/theme.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            children: [
              // 1. Header Profile
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: AppColors.primaryBrown,
                        child: const Text('A',
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Halo,',
                              style: TextStyle(
                                  fontSize: 11, color: AppColors.textMuted)),
                          Text('Keisya Exa Haniyah',
                              style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textDark)),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.inputBorder),
                    ),
                    child: Row(
                      children: const [
                        CircleAvatar(
                            radius: 3, backgroundColor: AppColors.greenAccent),
                        SizedBox(width: 6),
                        Text('MoneyMate',
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primaryBrown)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // 2. Card Total Saldo
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.primaryBrown,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('TOTAL SALDO AKTIF',
                            style: TextStyle(
                                fontSize: 10,
                                color: Colors.white70,
                                fontWeight: FontWeight.w600)),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 3),
                          decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(12)),
                          child: const Text('Utama',
                              style:
                                  TextStyle(color: Colors.white, fontSize: 10)),
                        )
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text('Rp 2.450.000',
                        style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.white)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('Sisa Budget Bulan Ini',
                                style: TextStyle(
                                    fontSize: 10, color: Colors.white70)),
                            Text('Rp 850.000',
                                style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white)),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(20)),
                          child: const Text('lihat rincian >',
                              style:
                                  TextStyle(color: Colors.white, fontSize: 10)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 3. Quick Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildQuickAction(Icons.add, 'Catat'),
                  _buildQuickAction(Icons.camera_alt_outlined, 'Struk'),
                  _buildQuickAction(Icons.adjust_rounded, 'Budget'),
                  _buildQuickAction(Icons.bar_chart_rounded, 'Laporan'),
                ],
              ),
              const SizedBox(height: 20),

              // 4. Insight Keuangan Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.insightBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.insightBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.stars_rounded,
                                color: AppColors.accentOrange, size: 20),
                            SizedBox(width: 6),
                            Text('Insight Keuanganmu',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                    color: AppColors.primaryBrown)),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                              color: AppColors.accentOrange.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(6)),
                          child: const Text('BARU',
                              style: TextStyle(
                                  color: AppColors.accentOrange,
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                        'Pengeluaran Makananmu meningkat 20% minggu ini. Ada risiko budget habis sebelum akhir bulan.',
                        style: TextStyle(
                            fontSize: 11,
                            color: AppColors.textDark,
                            height: 1.4)),
                    const SizedBox(height: 8),
                    const Text('Lihat Solusi AI >',
                        style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppColors.accentOrange)),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // 5. Pencapaian Goals Card
              _buildSectionCard(
                title: 'Pencapaian Goals',
                icon: Icons.flag_outlined,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('🏖️ Dana Liburan',
                            style: TextStyle(
                                fontSize: 13, fontWeight: FontWeight.bold)),
                        Text('55%',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primaryBrown)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: const LinearProgressIndicator(
                          value: 0.55,
                          minHeight: 8,
                          backgroundColor: AppColors.inputBorder,
                          color: AppColors.primaryBrown),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('Rp 2.750.000 / Rp 5.000.000',
                            style: TextStyle(
                                fontSize: 10, color: AppColors.textMuted)),
                        Text('Target Des 2026',
                            style: TextStyle(
                                fontSize: 10, color: AppColors.textMuted)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // 6. Transaksi Terakhir Card
              _buildSectionCard(
                title: 'Transaksi Terakhir',
                child: Column(
                  children: [
                    _buildTransactionItem(
                        'Restoran',
                        'Ayam Geprek',
                        '- Rp 22.000',
                        'Hari ini',
                        Icons.restaurant,
                        AppColors.insightBg,
                        AppColors.accentOrange),
                    const Divider(color: AppColors.inputBorder, height: 16),
                    _buildTransactionItem(
                        'Belanja',
                        'Minimarket',
                        '- Rp 35.000',
                        'Kemarin',
                        Icons.shopping_bag_outlined,
                        AppColors.insightBg,
                        AppColors.accentOrange),
                    const Divider(color: AppColors.inputBorder, height: 16),
                    _buildTransactionItem(
                        'Freelance',
                        'Desain Logo',
                        '+ Rp 350.000',
                        '22 Okt',
                        Icons.weekend_outlined,
                        AppColors.greenBg,
                        AppColors.greenAccent),
                  ],
                ),
              ),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction(IconData icon, String label) {
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.inputBorder)),
          child: Icon(icon, color: AppColors.primaryBrown, size: 22),
        ),
        const SizedBox(height: 6),
        Text(label,
            style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: AppColors.textDark)),
      ],
    );
  }

  Widget _buildSectionCard(
      {required String title, IconData? icon, required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.inputBorder)),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: AppColors.accentOrange),
                    const SizedBox(width: 6)
                  ],
                  Text(title,
                      style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textDark)),
                ],
              ),
              const Text('Lihat Semua >',
                  style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _buildTransactionItem(String title, String subtitle, String amount,
      String date, IconData icon, Color bg, Color iconColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                  color: bg, borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontSize: 12, fontWeight: FontWeight.bold)),
                Text(subtitle,
                    style: const TextStyle(
                        fontSize: 10, color: AppColors.textMuted)),
              ],
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(amount,
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: iconColor)),
            Text(date,
                style:
                    const TextStyle(fontSize: 10, color: AppColors.textMuted)),
          ],
        ),
      ],
    );
  }
}
