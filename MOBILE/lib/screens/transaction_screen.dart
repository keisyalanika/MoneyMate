import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../services/auth_provider.dart';
import 'add_transaction_screen.dart';

// Notifier transaksi terakhir (dipakai untuk refresh daftar setelah tambah transaksi)
final ValueNotifier<Map<String, dynamic>?> newTransactionNotifier = ValueNotifier(null);

class TransactionScreen extends StatefulWidget {
  final bool showBackButton;
  const TransactionScreen({super.key, this.showBackButton = false});

  @override
  State<TransactionScreen> createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  bool hasData = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        Provider.of<AuthProvider>(context, listen: false).fetchTransactions();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, child) {
        return ValueListenableBuilder<Map<String, dynamic>?>(
          valueListenable: newTransactionNotifier,
          builder: (context, newTx, child) {
            final txList = auth.transactions;
            final bool shouldShowData = hasData || txList.isNotEmpty || newTx != null;
            if (!shouldShowData) {
              return _buildEmptyState(context);
            }
            return _buildFilledState(context, auth, newTx);
          },
        );
      },
    );
  }

  // ==========================================
  // 1. TAMPILAN JIKA BELUM ADA TRANSAKSI (EMPTY STATE)
  // ==========================================
  Widget _buildEmptyState(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: widget.showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
                onPressed: () {
                  if (Navigator.canPop(context)) {
                    Navigator.pop(context);
                  }
                },
              )
            : null,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Semua Transaksi',
              style: TextStyle(
                color: AppColors.textDark,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            Text(
              'Catatan Keuangan Terorganisir',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 16),
            // Summary Box (Ringkasan Arus Kas)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.inputBorder),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.circle, size: 8, color: Colors.grey),
                          SizedBox(width: 8),
                          Text('Ringkasan Arus Kas', style: TextStyle(fontSize: 12, color: AppColors.textMuted, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F0EB),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('0 Transaksi', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Divider(color: AppColors.inputBorder, height: 1),
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.arrow_downward, size: 12, color: Color(0xFFDC2626)),
                                SizedBox(width: 4),
                                Text('Total Keluar', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text('Rp 0', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                          ],
                        ),
                      ),
                      Container(width: 1, height: 30, color: AppColors.inputBorder),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.arrow_upward, size: 12, color: AppColors.primaryBrown),
                                SizedBox(width: 4),
                                Text('Total Masuk', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text('Rp 0', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            // Illustration (Using simple custom widget for receipt)
            Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 140,
                  height: 140,
                  decoration: const BoxDecoration(
                    color: Color(0xFFEBEBEB),
                    shape: BoxShape.circle,
                  ),
                ),
                Container(
                  width: 100,
                  height: 130,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
                    ],
                  ),
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Icon(Icons.circle, size: 10, color: AppColors.primaryBrown),
                          Icon(Icons.receipt_long, size: 16, color: AppColors.accentOrange.withOpacity(0.8)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(height: 6, width: double.infinity, color: const Color(0xFFF5F0EB)),
                      const SizedBox(height: 8),
                      Container(height: 6, width: double.infinity, color: const Color(0xFFF5F0EB)),
                      const SizedBox(height: 8),
                      Container(height: 6, width: 40, color: const Color(0xFFF5F0EB)),
                      const Spacer(),
                      Container(height: 6, width: 20, color: const Color(0xFFF5F0EB)),
                    ],
                  ),
                ),
                Positioned(
                  bottom: -5,
                  right: 5,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFDAB9),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                    ),
                    child: const Icon(Icons.attach_money, size: 16, color: AppColors.primaryBrown),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            const Text(
              'Belum Ada Transaksi Tercatat',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
            const SizedBox(height: 12),
            const Text(
              'Catat pengeluaran dan pemasukan harianmu\nuntuk mulai mengontrol finansial dengan cerdas\nbersama MoneyMate.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.5),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const AddTransactionScreen()),
                  );
                  if (mounted) setState(() {});
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBrown,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  elevation: 0,
                ),
                child: const Text(
                  '+ Catat Transaksi Pertama',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),

            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }


  // ==========================================
  // 2. TAMPILAN JIKA ADA TRANSAKSI (FILLED STATE)
  // ==========================================
  Widget _buildFilledState(BuildContext context, AuthProvider auth, Map<String, dynamic>? newTx) {
    final txs = auth.transactions;
    final totals = _sumByType(txs, txs.isEmpty ? newTx : null);

    final grouped = <DateTime, List<Map<String, dynamic>>>{};
    for (final tx in txs) {
      final date = DateTime.tryParse(tx['date']?.toString() ?? '');
      if (date == null) continue;
      final day = DateTime(date.year, date.month, date.day);
      grouped.putIfAbsent(day, () => []).add(tx);
    }
    if (grouped.isEmpty && newTx != null) {
      final date = DateTime.tryParse(newTx['date']?.toString() ?? '') ?? DateTime.now();
      grouped[DateTime(date.year, date.month, date.day)] = [newTx];
    }
    final days = grouped.keys.toList()..sort((a, b) => b.compareTo(a));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: widget.showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
                onPressed: () {
                  if (Navigator.canPop(context)) Navigator.pop(context);
                },
              )
            : null,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Semua Transaksi',
              style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              'Catatan Keuangan Terorganisir',
              style: TextStyle(color: AppColors.textMuted, fontSize: 12),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppColors.textDark, size: 22),
            onPressed: () => auth.fetchTransactions(),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.primaryBrown,
        onRefresh: auth.fetchTransactions,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: _buildTotalCard('Pemasukan', totals['income']!, totals['incomeCount']!, true)),
                  const SizedBox(width: 12),
                  Expanded(child: _buildTotalCard('Pengeluaran', totals['expense']!, totals['expenseCount']!, false)),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'RIWAYAT TRANSAKSI',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 0.6, color: AppColors.textDark),
              ),
              const SizedBox(height: 12),
              if (days.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF0E5D8)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.receipt_long_outlined, size: 34, color: AppColors.textMuted),
                      const SizedBox(height: 10),
                      const Text(
                        'Belum ada transaksi.',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textDark),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Transaksi yang kamu catat akan muncul di sini beserta saldo terbaru.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.4),
                      ),
                    ],
                  ),
                )
              else
                ...days.map((day) {
                  final items = grouped[day]!;
                  final dayTotals = _sumByType(items, null);
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildDateHeader(day, dayTotals),
                      const SizedBox(height: 10),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFF0E5D8)),
                        ),
                        child: Column(
                          children: items.asMap().entries.map((entry) {
                            final i = entry.key;
                            final tx = entry.value;
                            final bool isExp = tx['isExpense'] == true ||
                                tx['type']?.toString().toLowerCase() == 'expense';
                            final String cat = tx['category']?.toString() ??
                                tx['title']?.toString() ??
                                'Lainnya';
                            final String note = (tx['note'] != null && tx['note'].toString().isNotEmpty)
                                ? tx['note'].toString()
                                : cat;
                            return Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                _buildTransactionItem(
                                  icon: _getCategoryIcon(cat),
                                  iconBg: isExp ? const Color(0xFFF5F0EB) : const Color(0xFFE8F5E9),
                                  iconColor: isExp ? AppColors.primaryBrown : const Color(0xFF16A34A),
                                  title: cat,
                                  hasReceipt: tx['receipt_image_url'] != null,
                                  subtitle1: note,
                                  subtitle2: isExp ? 'Pengeluaran' : 'Pemasukan',
                                  amount: '${isExp ? '-' : '+'}Rp ${_formatAmount(tx['amount'])}',
                                  isExpense: isExp,
                                  time: _formatTimeLabel(day),
                                  badgeText: isExp ? null : 'Pemasukan',
                                  badgeColor: const Color(0xFFDCFCE7),
                                  badgeTextColor: const Color(0xFF16A34A),
                                ),
                                if (i < items.length - 1)
                                  const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                              ],
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  );
                }),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Map<String, dynamic> _sumByType(
    List<Map<String, dynamic>> txs,
    Map<String, dynamic>? extra,
  ) {
    double income = 0;
    double expense = 0;
    int incomeCount = 0;
    int expenseCount = 0;

    final all = [...txs, if (extra != null) extra];
    for (final tx in all) {
      final amount = (tx['amount'] is num)
          ? (tx['amount'] as num).toDouble()
          : double.tryParse(tx['amount']?.toString() ?? '0') ?? 0;
      final isExpense =
          tx['isExpense'] == true || tx['type']?.toString().toLowerCase() == 'expense';
      if (isExpense) {
        expense += amount;
        expenseCount++;
      } else {
        income += amount;
        incomeCount++;
      }
    }

    return {
      'income': income,
      'expense': expense,
      'incomeCount': incomeCount,
      'expenseCount': expenseCount,
    };
  }

  Widget _buildTotalCard(String label, double amount, int count, bool isIncome) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF0E5D8)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isIncome ? Icons.south_west_rounded : Icons.north_east_rounded,
                size: 14,
                color: isIncome ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
              ),
              const SizedBox(width: 4),
              Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            '${isIncome ? '+' : '-'}Rp ${_formatAmount(amount)}',
            style: TextStyle(
              color: isIncome ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: 4),
          Text('$count transaksi', style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
        ],
      ),
    );
  }

  Widget _buildDateHeader(DateTime day, Map<String, dynamic> totals) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    String label;

    if (day == today) {
      label = 'Hari Ini';
    } else if (day == yesterday) {
      label = 'Kemarin';
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      label = '${day.day} ${months[day.month - 1]} ${day.year}';
    }

    final net = (totals['income'] as double) - (totals['expense'] as double);
    return Text(
      '$label • ${net >= 0 ? '+' : '-'}Rp ${_formatAmount(net.abs())}',
      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark),
    );
  }

  String _formatTimeLabel(DateTime day) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return '${day.day} ${months[day.month - 1]} ${day.year}';
  }

  /// Format angka menjadi format ribuan Indonesia, contoh: "50000" → "50.000"
  String _formatAmount(dynamic raw) {
    if (raw == null) return '0';
    int number = 0;
    if (raw is num) {
      number = raw.round();
    } else {
      final str = raw.toString();
      final parsedDouble = double.tryParse(str);
      if (parsedDouble != null) {
        number = parsedDouble.round();
      } else {
        final cleaned = str.replaceAll(RegExp(r'[^0-9]'), '');
        number = int.tryParse(cleaned) ?? 0;
      }
    }
    return NumberFormat('#,###', 'id_ID').format(number).replaceAll(',', '.');
  }

  /// Mengembalikan icon yang sesuai berdasarkan nama kategori
  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'gaji':
        return Icons.work_outline;
      case 'bonus':
        return Icons.card_giftcard_outlined;
      case 'beasiswa':
        return Icons.school_outlined;
      case 'hadiah':
        return Icons.redeem_outlined;
      case 'hobi':
        return Icons.sports_esports_outlined;
      case 'investasi':
        return Icons.show_chart;
      case 'makanan & minuman':
        return Icons.restaurant;
      case 'transportasi':
        return Icons.directions_car_outlined;
      case 'belanja':
        return Icons.shopping_bag_outlined;
      case 'tagihan':
        return Icons.receipt_outlined;
      case 'kesehatan':
        return Icons.medical_services_outlined;
      case 'pendidikan':
        return Icons.menu_book_outlined;
      case 'hiburan':
        return Icons.movie_creation_outlined;
      default:
        return Icons.account_balance_wallet_outlined;
    }
  }


  Widget _buildTransactionItem({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    bool hasReceipt = false,
    String? badgeText,
    Color? badgeColor,
    Color? badgeTextColor,
    required String subtitle1,
    required String subtitle2,
    required String amount,
    required bool isExpense,
    required String time,
  }) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconBg,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        title,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: AppColors.textDark,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (hasReceipt) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF0E6),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Icon(Icons.receipt_long, size: 10, color: AppColors.accentOrange),
                      ),
                    ],
                    if (badgeText != null) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: badgeColor,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          badgeText,
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: badgeTextColor,
                          ),
                        ),
                      ),
                    ]
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Expanded(
                      flex: 4,
                      child: Text(
                        subtitle1,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                        maxLines: 2,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 6),
                      child: Icon(Icons.circle, size: 3, color: AppColors.textMuted),
                    ),
                    Expanded(
                      flex: 3,
                      child: Text(
                        subtitle2,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                amount,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: isExpense ? const Color(0xFFDC2626) : const Color(0xFF16A34A),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                time,
                style: const TextStyle(
                  fontSize: 10,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
