import 'package:flutter/material.dart';
import '../utils/theme.dart';
import 'adjust_balance_bottom_sheet.dart'; // Import bottom sheet penyesuaian saldo
import 'goals_screen.dart';
import 'transaction_screen.dart';
import 'laporan_screen.dart';
import 'ai_insight_screen.dart';
import 'notification_screen.dart';


class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Header (Profil & Tagline MoneyMate)
              _buildHeader(context),
              const SizedBox(height: 18),

<<<<<<< HEAD
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
                              color: Colors.white.withValues(alpha: 0.15),
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
                              color: Colors.white.withValues(alpha: 0.15),
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
=======
              // 2. Card Total Saldo Aktif
              _buildSaldoCard(context),
>>>>>>> dev/lanika
              const SizedBox(height: 20),

              // 3. Quick Action Buttons (Catat, Struk, Budget, Goals)
              _buildQuickActions(context),
              const SizedBox(height: 20),

<<<<<<< HEAD
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
                              color: AppColors.accentOrange.withValues(alpha: 0.15),
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
=======
              // 4. Insight Keuanganmu (Banner AI)
              _buildInsightCard(context),
>>>>>>> dev/lanika
              const SizedBox(height: 16),

              // 5. Pencapaian Goals
              _buildGoalsCard(context),
              const SizedBox(height: 16),

              // 6. Transaksi Terakhir
              _buildRecentTransactionsCard(context),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      // bottomNavigationBar dihapus dari sini agar navigation bar tidak double
    );
  }

  // --- WIDGET HELPER ---

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          radius: 22,
          backgroundColor: AppColors.primary,
          child: const Text(
            'K',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                'Halo,',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              Text(
                'Keisya Lanika',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.circle, color: Colors.green, size: 8),
              const SizedBox(width: 6),
              Text(
                'MoneyMate',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        GestureDetector(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const NotificationScreen()));
          },
          child: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.grey.shade300),
              color: Colors.white,
            ),
            child: const Icon(Icons.notifications_none, size: 20, color: Colors.black87),
          ),
        ),
      ],
    );
  }

  Widget _buildSaldoCard(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary, AppColors.primary.withOpacity(0.85)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Stack(
        children: [
          // Background Decor Watermark "M"
          Positioned(
            right: -10,
            bottom: -20,
            child: Text(
              'M',
              style: TextStyle(
                fontSize: 160,
                fontWeight: FontWeight.bold,
                color: Colors.white.withOpacity(0.05),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'TOTAL SALDO AKTIF',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 11,
                        letterSpacing: 1,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const LaporanScreen()),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: const [
                            Text(
                              'Lihat Rincian',
                              style: TextStyle(color: Colors.white, fontSize: 11),
                            ),
                            Icon(Icons.chevron_right, color: Colors.white, size: 14),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text(
                      'Rp 2.450.000',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        // Memanggil Bottom Sheet Penyesuaian Saldo
                        AdjustBalanceBottomSheet.show(context, isAdd: true);
                      },
                      icon: Icon(Icons.add, size: 16, color: AppColors.primary),
                      label: Text(
                        'Tambah',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(color: Colors.white24, height: 1),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Sisa Budget Bulan Ini',
                          style: TextStyle(color: Colors.white70, fontSize: 11),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Rp 850.000',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      {'icon': Icons.track_changes, 'label': 'Budget'},
      {'icon': Icons.emoji_events_outlined, 'label': 'Goals'},
    ];

    return Wrap(
      spacing: 20,
      children: actions.map((item) {
        return GestureDetector(
          onTap: () {
            if (item['label'] == 'Goals') {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const GoalsScreen()),
              );
            }
          },
          child: Column(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    )
                  ],
                ),
                child: Icon(
                  item['icon'] as IconData,
                  color: AppColors.primary,
                  size: 24,
                ),
              ),
              const SizedBox(height: 8),
                Text(
                  item['label'] as String,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.black87,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      );
  }

  Widget _buildInsightCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF9F5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFFFE0D0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.add, color: Colors.white, size: 16),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Insight Keuanganmu',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFECE0),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'BARU',
                  style: TextStyle(
                    color: AppColors.secondary,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          RichText(
            text: TextSpan(
              style: const TextStyle(
                  color: Colors.black87, fontSize: 12, height: 1.4),
              children: [
                const TextSpan(text: 'Pengeluaran Makananmu meningkat '),
                TextSpan(
                  text: '20%',
                  style: TextStyle(
                      color: AppColors.secondary, fontWeight: FontWeight.bold),
                ),
                const TextSpan(
                    text:
                        ' minggu ini. Ada risiko budget habis sebelum akhir bulan.'),
              ],
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const AiInsightScreen()));
            },
            child: Row(
              children: [
                Text(
                  'Lihat Solusi AI',
                  style: TextStyle(
                    color: AppColors.secondary,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(width: 4),
                Icon(Icons.chevron_right, size: 16, color: AppColors.secondary),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGoalsCard(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const GoalsScreen()),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF0E5D8)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.flag_outlined,
                        color: AppColors.secondary, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Pencapaian Goals',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: const [
                    Text(
                      'Lihat Semua',
                      style: TextStyle(color: Colors.grey, fontSize: 11),
                    ),
                    Icon(Icons.chevron_right, size: 14, color: Colors.grey),
                  ],
                ),
              ],
            ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Text('🏖️ ', style: TextStyle(fontSize: 14)),
                        Text(
                          'Dana Liburan',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                    const Text(
                      '55%',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: LinearProgressIndicator(
                    value: 0.55,
                    minHeight: 8,
                    backgroundColor: const Color(0xFFEFE8DF),
                    valueColor:
                        AlwaysStoppedAnimation<Color>(AppColors.primary),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text(
                      'Rp 2.750.000 / Rp 5.000.000',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.black87,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      'Target Des 2026',
                      style: TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

  Widget _buildRecentTransactionsCard(BuildContext context) {
    final transactions = [
      {
        'icon': Icons.restaurant_outlined,
        'title': 'Restoran',
        'subtitle': 'Ayam Geprek',
        'amount': '- Rp 22.000',
        'time': 'Hari ini',
        'isExpense': true,
        'bgColor': const Color(0xFFFFF0E6),
        'iconColor': AppColors.secondary,
      },
      {
        'icon': Icons.shopping_bag_outlined,
        'title': 'Belanja',
        'subtitle': 'Minimarket',
        'amount': '- Rp 35.000',
        'time': 'Kemarin',
        'isExpense': true,
        'bgColor': const Color(0xFFFFF0E6),
        'iconColor': AppColors.secondary,
      },
      {
        'icon': Icons.chair_outlined,
        'title': 'Freelance',
        'subtitle': 'Desain Logo',
        'amount': '+ Rp 350.000',
        'time': '22 Okt',
        'isExpense': false,
        'bgColor': const Color(0xFFE8F8F0),
        'iconColor': Colors.teal,
      },
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF0E5D8)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Transaksi Terakhir',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: Colors.black87,
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const TransactionScreen(showBackButton: true)),
                  );
                },
                child: Row(
                  children: const [
                    Text(
                      'Lihat Semua',
                      style: TextStyle(color: Colors.grey, fontSize: 11),
                    ),
                    Icon(Icons.chevron_right, size: 14, color: Colors.grey),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: transactions.length,
            separatorBuilder: (context, index) =>
                const Divider(color: Colors.black12, height: 16),
            itemBuilder: (context, index) {
              final item = transactions[index];
              return Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: item['bgColor'] as Color,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      item['icon'] as IconData,
                      color: item['iconColor'] as Color,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item['title'] as String,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          item['subtitle'] as String,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        item['amount'] as String,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: (item['isExpense'] as bool)
                              ? AppColors.secondary
                              : Colors.teal,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        item['time'] as String,
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
