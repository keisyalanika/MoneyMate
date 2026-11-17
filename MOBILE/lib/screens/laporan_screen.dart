import 'package:flutter/material.dart';
import '../models/transaction_model.dart';
import '../services/api_service.dart';
import '../utils/budget_icons.dart';
import '../utils/currency_formatter.dart';
import '../utils/finance_analytics.dart';
import '../utils/theme.dart';

class LaporanScreen extends StatefulWidget {
  const LaporanScreen({super.key});

  @override
  State<LaporanScreen> createState() => _LaporanScreenState();
}

class _LaporanScreenState extends State<LaporanScreen> {
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 29));
  DateTime _endDate = DateTime.now();
  List<TransactionModel> _transactions = [];
  bool _isLoading = true;
  String? _error;
  int? _selectedChartIndex;

  @override
  void initState() {
    super.initState();
    _loadReport();
  }

  Future<void> _loadReport() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    final list = await ApiService.fetchTransactions(
      startDate: _startDate,
      endDate: _endDate,
      limit: 1000,
    );

    if (!mounted) return;
    setState(() {
      _transactions = list;
      _error = ApiService.lastTransactionsOk ? null : 'Gagal memuat data dari server.';
      _isLoading = false;
      _selectedChartIndex = null;
    });
  }

  Future<void> _selectDateRange(BuildContext context) async {
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      initialDateRange: DateTimeRange(start: _startDate, end: _endDate),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primaryBrown,
              onPrimary: Colors.white,
              onSurface: AppColors.textDark,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _startDate = picked.start;
        _endDate = picked.end;
      });
      _loadReport();
    }
  }

  void _setRange(String preset) {
    final now = DateTime.now();
    setState(() {
      if (preset == 'month') {
        _startDate = DateTime(now.year, now.month, 1);
        _endDate = DateTime(now.year, now.month + 1, 0);
      } else if (preset == 'lastMonth') {
        _startDate = DateTime(now.year, now.month - 1, 1);
        _endDate = DateTime(now.year, now.month, 0);
      } else if (preset == '7days') {
        _startDate = now.subtract(const Duration(days: 6));
        _endDate = now;
      } else {
        _startDate = now.subtract(const Duration(days: 29));
        _endDate = now;
      }
    });
    _loadReport();
  }

  @override
  Widget build(BuildContext context) {
    final totals = sumTransactions(_transactions);
    final breakdown = expenseBreakdown(_transactions);
    final chart = buildChartPoints(_transactions, _startDate, _endDate);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primaryBrown,
          onRefresh: _loadReport,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    if (Navigator.canPop(context)) ...[
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: const Icon(Icons.arrow_back, color: AppColors.textDark),
                      ),
                      const SizedBox(width: 12),
                    ],
                    const Text(
                      'Laporan Keuangan',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: [
                      _buildShortcutChip('Bulan Ini', () => _setRange('month')),
                      const SizedBox(width: 8),
                      _buildShortcutChip('Bulan Lalu', () => _setRange('lastMonth')),
                      const SizedBox(width: 8),
                      _buildShortcutChip('7 Hari Terakhir', () => _setRange('7days')),
                      const SizedBox(width: 8),
                      _buildShortcutChip('30 Hari Terakhir', () => _setRange('30days')),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                _buildDateRangeBar(context),
                const SizedBox(height: 20),

                if (_isLoading)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 60),
                    child: Center(child: CircularProgressIndicator(color: AppColors.primaryBrown)),
                  )
                else if (_error != null)
                  _buildMessageCard(_error!, icon: Icons.cloud_off_rounded)
                else if (_transactions.isEmpty)
                  _buildMessageCard(
                    'Belum ada transaksi pada periode ini.',
                    icon: Icons.receipt_long_outlined,
                  )
                else ...[
                  _buildSummaryCard(totals),
                  const SizedBox(height: 20),
                  _buildBreakdownCard(breakdown, totals.expense),
                  const SizedBox(height: 20),
                  _buildChartCard(chart),
                  const SizedBox(height: 20),
                  _buildAnalysisCard(totals, breakdown),
                ],
                const SizedBox(height: 80),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildShortcutChip(String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.inputBorder),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
        ),
      ),
    );
  }

  Widget _buildDateRangeBar(BuildContext context) {
    const dateFormat = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    final start = '${_startDate.day} ${dateFormat[_startDate.month - 1]} ${_startDate.year}';
    final end = '${_endDate.day} ${dateFormat[_endDate.month - 1]} ${_endDate.year}';

    return GestureDetector(
      onTap: () => _selectDateRange(context),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.inputBorder),
        ),
        child: Row(
          children: [
            const Icon(Icons.date_range_rounded, size: 18, color: AppColors.primaryBrown),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                '$start – $end',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
              ),
            ),
            const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageCard(String message, {required IconData icon}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        children: [
          Icon(icon, size: 34, color: AppColors.textMuted),
          const SizedBox(height: 10),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(FinanceTotals totals) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.primaryBrown,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'RINGKASAN PERIODE',
            style: TextStyle(fontSize: 10, color: Colors.white70, fontWeight: FontWeight.bold, letterSpacing: 1),
          ),
          const SizedBox(height: 14),
          _summaryRow('Pemasukan', totals.income, Colors.greenAccent),
          const SizedBox(height: 8),
          _summaryRow('Pengeluaran', totals.expense, const Color(0xFFFFA726)),
          const Divider(color: Colors.white24, height: 24),
          _summaryRow(
            'Total',
            totals.net,
            totals.net >= 0 ? Colors.greenAccent : const Color(0xFFFF7A68),
            bold: true,
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, double amount, Color color, {bool bold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.white70)),
        Text(
          CurrencyFormatter.formatRupiah(amount),
          style: TextStyle(
            fontSize: bold ? 16 : 13,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildBreakdownCard(List<CategoryBreakdown> breakdown, double totalExpense) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Pengeluaran per Kategori',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark),
          ),
          const SizedBox(height: 14),
          if (breakdown.isEmpty)
            const Text(
              'Tidak ada pengeluaran pada periode ini.',
              style: TextStyle(fontSize: 12, color: AppColors.textMuted),
            )
          else
            ...breakdown.take(6).map((item) {
              final icon = resolveBudgetIcon({'icon': item.icon, 'title': item.name});
              return Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        color: AppColors.inputBg,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(icon, size: 18, color: AppColors.primaryBrown),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  item.name,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
                                ),
                              ),
                              Text(
                                CurrencyFormatter.formatRupiah(item.amount),
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: (item.percentage / 100).clamp(0.0, 1.0),
                              minHeight: 6,
                              backgroundColor: const Color(0xFFF1EAE3),
                              color: AppColors.primaryBrown,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${item.percentage.toStringAsFixed(1)}% dari total pengeluaran',
                            style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildChartCard(List<ChartPoint> points) {
    if (points.isEmpty) return const SizedBox.shrink();
    final maxValue = points.fold<double>(
      0,
      (max, point) => [max, point.income, point.expense].reduce((a, b) => a > b ? a : b),
    );
    final int? selectedIndex =
        _selectedChartIndex != null && _selectedChartIndex! < points.length
            ? _selectedChartIndex
            : null;
    final ChartPoint? selected = selectedIndex != null ? points[selectedIndex] : null;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Tren Pemasukan & Pengeluaran',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark),
          ),
          const SizedBox(height: 6),
          const Row(
            children: [
              _LegendDot(color: Color(0xFF00A854), label: 'Pemasukan'),
              SizedBox(width: 12),
              _LegendDot(color: Color(0xFFE53935), label: 'Pengeluaran'),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 160,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: points.asMap().entries.map((entry) {
                final index = entry.key;
                final point = entry.value;
                final isSelected = selectedIndex == index;
                final incomeHeight = maxValue > 0 ? (point.income / maxValue) * 120 : 0.0;
                final expenseHeight = maxValue > 0 ? (point.expense / maxValue) * 120 : 0.0;

                return Expanded(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () {
                      setState(() {
                        _selectedChartIndex = isSelected ? null : index;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 4),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFFAF1EB) : Colors.transparent,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Container(
                                width: isSelected ? 9 : 7,
                                height: incomeHeight.clamp(2.0, 120.0),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF00A854),
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                              const SizedBox(width: 2),
                              Container(
                                width: isSelected ? 9 : 7,
                                height: expenseHeight.clamp(2.0, 120.0),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE53935),
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            point.label,
                            style: TextStyle(
                              fontSize: 9,
                              color: isSelected ? AppColors.textDark : AppColors.textMuted,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          if (selected != null) ...[
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFDF7F2),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFF0E5DF)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Rincian ${selected.label}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark),
                  ),
                  const SizedBox(height: 8),
                  _chartDetailRow('Pemasukan', selected.income, const Color(0xFF00A854)),
                  const SizedBox(height: 4),
                  _chartDetailRow('Pengeluaran', selected.expense, const Color(0xFFE53935)),
                  const Divider(color: Color(0xFFF0E5DF), height: 16),
                  _chartDetailRow(
                    'Total',
                    selected.income - selected.expense,
                    selected.income - selected.expense >= 0
                        ? const Color(0xFF00A854)
                        : const Color(0xFFE53935),
                    bold: true,
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _chartDetailRow(String label, double amount, Color color, {bool bold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
        Text(
          CurrencyFormatter.formatRupiah(amount),
          style: TextStyle(
            fontSize: bold ? 13 : 11,
            fontWeight: bold ? FontWeight.bold : FontWeight.w600,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildAnalysisCard(FinanceTotals totals, List<CategoryBreakdown> breakdown) {
    final top = breakdown.isNotEmpty ? breakdown.first : null;
    final lines = <String>[];

    if (top != null) {
      lines.add(
        'Pengeluaran terbesar ada di kategori ${top.name} sebesar '
        '${CurrencyFormatter.formatRupiah(top.amount)} (${top.percentage.toStringAsFixed(1)}%).',
      );
    }
    if (totals.net >= 0) {
      lines.add('Periode ini surplus ${CurrencyFormatter.formatRupiah(totals.net)} dari pemasukan.');
    } else {
      lines.add('Periode ini defisit ${CurrencyFormatter.formatRupiah(totals.net.abs())}.');
    }
    if (breakdown.length >= 3) {
      lines.add('Pengeluaran tersebar di ${breakdown.length} kategori berbeda.');
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7F2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFFDE3D3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.auto_awesome, size: 16, color: AppColors.primaryBrown),
              SizedBox(width: 6),
              Text(
                'Analisis Periode',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textDark),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...lines.map(
            (line) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Text(
                line,
                style: const TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.4),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LegendDot extends StatelessWidget {
  final Color color;
  final String label;

  const _LegendDot({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
      ],
    );
  }
}
