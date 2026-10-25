import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../services/auth_provider.dart';
import 'adjust_balance_bottom_sheet.dart'; // Import bottom sheet penyesuaian saldo
import 'budget_screen.dart';
import 'goals_screen.dart';
import 'transaction_screen.dart';
import 'laporan_screen.dart';
import 'ai_insight_screen.dart';
import 'notification_screen.dart';
import '../services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AuthProvider>(context, listen: false).fetchWallets();
    });
  }

  String _formatCurrency(num value) {
    final int intVal = value.round();
    return intVal.toString().replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.');
  }

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

              // 2. Card Total Saldo Aktif
              _buildSaldoCard(context),
              const SizedBox(height: 20),

              // 3. Quick Action Buttons (Catat, Struk, Budget, Goals)
              _buildQuickActions(context),
              const SizedBox(height: 20),

              // 4. Insight Keuanganmu (Banner AI)
              _buildInsightCard(context),
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
    final auth = Provider.of<AuthProvider>(context);
    final displayName = auth.userNickname.isNotEmpty
        ? auth.userNickname
        : (auth.userName.isNotEmpty && auth.userName != 'Guest' ? auth.userName : 'Pengguna');
    final avatarLetter = auth.userInitial;

    return Row(
      children: [
        CircleAvatar(
          radius: 22,
          backgroundColor: AppColors.primary,
          child: Text(
            avatarLetter,
            style: const TextStyle(
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
            children: [
              const Text(
                'Halo,',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              Text(
                displayName,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.black87,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
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
    final auth = Provider.of<AuthProvider>(context);
    final saldoFormatted = _formatCurrency(auth.saldo);

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary, AppColors.primary.withValues(alpha: 0.85)],
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
                color: Colors.white.withValues(alpha: 0.05),
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
                          color: Colors.white.withValues(alpha: 0.2),
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
                    Expanded(
                      child: Text(
                        'Rp $saldoFormatted',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () async {
                        // Memanggil Bottom Sheet Penyesuaian Saldo
                        await AdjustBalanceBottomSheet.show(context, isAdd: true);
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
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const BudgetScreen()),
                    );
                  },
                  child: Container(
                    color: Colors.transparent,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Sisa Budget Bulan Ini',
                              style: TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Rp ${_formatCurrency(auth.sisaBudget)}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
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
            } else if (item['label'] == 'Budget') {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const BudgetScreen()),
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
                  item['label']?.toString() ?? '',
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
          FutureBuilder<List<Map<String, dynamic>>>(
            future: ApiService.fetchGoals(),
            builder: (context, snapshot) {
              final goals = snapshot.data ?? [];
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                    ),
                  ),
                );
              }

              if (goals.isEmpty) {
                return Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.flag_outlined, color: AppColors.primary, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Belum Ada Goals Aktif',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Ketuk untuk membuat target tabungan impianmu!',
                              style: TextStyle(fontSize: 11, color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.add_circle_outline, color: AppColors.primary, size: 20),
                    ],
                  ),
                );
              }

              final firstGoal = goals.first;
              final double collected = double.tryParse('${firstGoal['current_amount'] ?? 0}') ?? 0.0;
              final double target = double.tryParse('${firstGoal['target_amount'] ?? 1}') ?? 1.0;
              final double pct = target > 0 ? (collected / target).clamp(0.0, 1.0) : 0.0;
              final String title = firstGoal['title'] ?? 'Target Tabungan';

              return Container(
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
                          children: [
                            const Text('🎯 ', style: TextStyle(fontSize: 14)),
                            Text(
                              title,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          '${(pct * 100).round()}%',
                          style: const TextStyle(
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
                        value: pct,
                        minHeight: 8,
                        backgroundColor: const Color(0xFFEFE8DF),
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Rp ${collected.round()} / Rp ${target.round()}',
                          style: const TextStyle(
                            fontSize: 11,
                            color: Colors.black87,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          firstGoal['deadline'] != null ? 'Batas: ${firstGoal['deadline']}' : 'Aktif',
                          style: const TextStyle(fontSize: 10, color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    ),
  );
}

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'gaji':
        return Icons.work_outline;
      case 'bonus':
        return Icons.card_giftcard_outlined;
      case 'freelance':
        return Icons.chair_outlined;
      case 'beasiswa':
        return Icons.school_outlined;
      case 'makanan & minuman':
      case 'restoran':
        return Icons.restaurant_outlined;
      case 'transportasi':
        return Icons.directions_car_outlined;
      case 'belanja':
        return Icons.shopping_bag_outlined;
      case 'tagihan':
      case 'tagihan & utilitas':
        return Icons.receipt_outlined;
      case 'kesehatan':
        return Icons.medical_services_outlined;
      case 'pendidikan':
        return Icons.menu_book_outlined;
      case 'hiburan':
      case 'hiburan & nongkrong':
        return Icons.movie_creation_outlined;
      default:
        return Icons.account_balance_wallet_outlined;
    }
  }

  Widget _buildRecentTransactionsCard(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final List<Map<String, dynamic>> transactions = auth.transactions.isNotEmpty
        ? auth.transactions.take(3).map((tx) {
            final isExpense = tx['isExpense'] == true || tx['type']?.toString().toLowerCase() == 'expense';
            final amt = (tx['amount'] is num)
                ? (tx['amount'] as num).round()
                : (double.tryParse(tx['amount']?.toString() ?? '0')?.round() ?? 0);
            final formattedAmt = NumberFormat('#,###', 'id_ID').format(amt).replaceAll(',', '.');
            final String cat = tx['category']?.toString() ?? tx['title']?.toString() ?? 'Transaksi';
            final String note = (tx['note'] != null && tx['note'].toString().isNotEmpty)
                ? tx['note'].toString()
                : (isExpense ? 'Pengeluaran' : 'Pemasukan');
            return {
              'icon': _getCategoryIcon(cat),
              'title': cat,
              'subtitle': note,
              'amount': '${isExpense ? '- ' : '+ '}Rp $formattedAmt',
              'time': tx['time']?.toString() ?? 'Hari ini',
              'isExpense': isExpense,
              'bgColor': isExpense ? const Color(0xFFFFF0E6) : const Color(0xFFE8F8F0),
              'iconColor': isExpense ? AppColors.secondary : Colors.teal,
            };
          }).toList()
        : [
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
                          item['title']?.toString() ?? '',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          item['subtitle']?.toString() ?? '',
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
                        item['amount']?.toString() ?? '',
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
                        item['time']?.toString() ?? '',
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
