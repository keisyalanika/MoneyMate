import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../utils/theme.dart';

// ── Model data dummy ────────────────────────────────────────────────────────
class _SpendingCategory {
  final String name;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final int amount;
  final double percent;

  const _SpendingCategory({
    required this.name,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.amount,
    required this.percent,
  });
}

// ── Data per periode ────────────────────────────────────────────────────────
class _PeriodData {
  final String title;
  final String subtitle;
  final int netSavings;
  final int pemasukan;
  final int pengeluaran;
  final double savingsRate;
  final bool isTargetMet;
  final String aiReviewBadge;
  final String aiReviewText;
  final List<double> chartBars; // weekly/monthly bars
  final List<String> chartLabels;
  final List<_SpendingCategory> categories;

  const _PeriodData({
    required this.title,
    required this.subtitle,
    required this.netSavings,
    required this.pemasukan,
    required this.pengeluaran,
    required this.savingsRate,
    required this.isTargetMet,
    required this.aiReviewBadge,
    required this.aiReviewText,
    required this.chartBars,
    required this.chartLabels,
    required this.categories,
  });
}

// ── Halaman utama ────────────────────────────────────────────────────────────
class DetailLaporanScreen extends StatefulWidget {
  const DetailLaporanScreen({super.key});

  @override
  State<DetailLaporanScreen> createState() => _DetailLaporanScreenState();
}

class _DetailLaporanScreenState extends State<DetailLaporanScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _selectedTabIndex = 0; // 0=Bulan, 1=Bulan Lalu, 2=Kuartal 3, 3=Tahun 2026

  // ── Tabs ──
  final List<String> _tabs = ['Bulan Ini', 'Bulan Lalu', 'Kuartal 3', 'Tahun 2026'];

  // ── Periode navigasi ──
  int _monthOffset = 0;
  int _quarterOffset = 0;
  int _yearOffset = 0;

  static const List<_SpendingCategory> _categoriesMonthly = [
    _SpendingCategory(name: 'Makanan & Minum', subtitle: 'Kebutuhan harian & kuliner', icon: Icons.restaurant, iconColor: Color(0xFF592314), amount: 1420000, percent: 41.5),
    _SpendingCategory(name: 'Belanja Supermarket', subtitle: 'Bahah pokok & rumah', icon: Icons.shopping_cart, iconColor: Color(0xFFD95B27), amount: 850000, percent: 24.8),
    _SpendingCategory(name: 'Hiburan & Langganan', subtitle: 'Streaming & hobi', icon: Icons.movie, iconColor: Color(0xFF8B6355), amount: 450000, percent: 13.1),
    _SpendingCategory(name: 'Transportasi & Bensin', subtitle: 'Bensin & e-toll', icon: Icons.directions_car, iconColor: Color(0xFF6D4C41), amount: 380000, percent: 11.1),
    _SpendingCategory(name: 'Tagihan & Utilitas', subtitle: 'Listrik, air, & Wi-Fi', icon: Icons.receipt_long, iconColor: Color(0xFFC1440E), amount: 320000, percent: 9.4),
  ];

  static const List<_SpendingCategory> _categoriesQuarterly = [
    _SpendingCategory(name: 'Makanan & Minum', subtitle: 'Kebutuhan harian & kuliner', icon: Icons.restaurant, iconColor: Color(0xFF592314), amount: 4250000, percent: 40.7),
    _SpendingCategory(name: 'Belanja Supermarket', subtitle: 'Bahah pokok & rumah', icon: Icons.shopping_cart, iconColor: Color(0xFFD95B27), amount: 2580000, percent: 24.7),
    _SpendingCategory(name: 'Hiburan & Langganan', subtitle: 'Streaming & hobi', icon: Icons.movie, iconColor: Color(0xFF8B6355), amount: 1400000, percent: 13.4),
    _SpendingCategory(name: 'Transportasi & Bensin', subtitle: 'Bensin & e-toll', icon: Icons.directions_car, iconColor: Color(0xFF6D4C41), amount: 1180000, percent: 11.3),
    _SpendingCategory(name: 'Tagihan & Utilitas', subtitle: 'Listrik, air, & Wi-Fi', icon: Icons.receipt_long, iconColor: Color(0xFFC1440E), amount: 1040000, percent: 9.9),
  ];

  static const List<_SpendingCategory> _categoriesYearly = [
    _SpendingCategory(name: 'Makanan & Minum', subtitle: 'Kuliner & pemenuhan', icon: Icons.restaurant, iconColor: Color(0xFF592314), amount: 14500000, percent: 41.0),
    _SpendingCategory(name: 'Belanja Supermarket', subtitle: 'Kebutuhan pokok & rumah', icon: Icons.shopping_cart, iconColor: Color(0xFFD95B27), amount: 8850000, percent: 25.0),
    _SpendingCategory(name: 'Hiburan & Hiburan', subtitle: 'Staycation, streaming & hobi', icon: Icons.movie, iconColor: Color(0xFF8B6355), amount: 4600000, percent: 13.0),
    _SpendingCategory(name: 'Transportasi & Bensin', subtitle: 'BBM, servis berkala & e-toll', icon: Icons.directions_car, iconColor: Color(0xFF6D4C41), amount: 3900000, percent: 11.0),
    _SpendingCategory(name: 'Tagihan Rutin & Asuransi', subtitle: 'Listrik, air & premi proteksi', icon: Icons.receipt_long, iconColor: Color(0xFFC1440E), amount: 3530000, percent: 10.0),
  ];

  final List<_PeriodData> _periodData = [
    // Tab 0: Bulan Ini (September 2026)
    _PeriodData(
      title: 'September 2026',
      subtitle: 'NET SAVINGS TABUNGAN BERSIH',
      netSavings: 5080000,
      pemasukan: 8500000,
      pengeluaran: 3420000,
      savingsRate: 59.8,
      isTargetMet: true,
      aiReviewBadge: 'SMART AUDIT',
      aiReviewText: 'Rasio tabungan Anda bulan September mencapai rekor 59.7%! Pengeluaran mengalami turun 15% lebih baik setelah rekomendasi meal-prep minggulalu.',
      chartBars: [0.5, 0.8, 0.6, 0.9],
      chartLabels: ['Mgg 1', 'Mgg 2', 'Mgg 3', 'Mgg 4'],
      categories: _categoriesMonthly,
    ),
    // Tab 1: Bulan Lalu (Agustus 2026)
    _PeriodData(
      title: 'Agustus 2026',
      subtitle: 'NET SAVINGS TABUNGAN BERSIH',
      netSavings: 4650000,
      pemasukan: 8000000,
      pengeluaran: 3350000,
      savingsRate: 58.1,
      isTargetMet: false,
      aiReviewBadge: 'SMART AUDIT',
      aiReviewText: 'Bulan Agustus 2026 Anda berhasil! Tabungan Rp 4.650.000 dengan sisa 56.1% dari dengan sisa 58.1%... Surplus. Gaya belanja efisien terdeteksi pola efisien.',
      chartBars: [0.6, 0.7, 0.5, 0.8],
      chartLabels: ['Mgg 1', 'Mgg 2', 'Mgg 3', 'Mgg 4'],
      categories: _categoriesMonthly,
    ),
    // Tab 2: Kuartal 3 (Jul-Sep 2026)
    _PeriodData(
      title: 'Kuartal 3 (Jul - Sep 2026)',
      subtitle: 'AKUMULASI TABUNGAN BERSIH Q3',
      netSavings: 14850000,
      pemasukan: 25300000,
      pengeluaran: 10450000,
      savingsRate: 58.7,
      isTargetMet: true,
      aiReviewBadge: 'SMART AUDIT Q3',
      aiReviewText: 'Performa Kuartal 3 sangat impresif! Anda berhasil menyisihkan 58.7% dari total pendapatan Triwulan. Konsistensi tabungan meningkat 12% dibandingkan Kuartal 2.',
      chartBars: [0.6, 0.75, 0.9],
      chartLabels: ['Juli', 'Agustus', 'September'],
      categories: _categoriesQuarterly,
    ),
    // Tab 3: Tahun 2026
    _PeriodData(
      title: 'Tahun 2026 (Jan - Des)',
      subtitle: 'TOTAL AKUMULASI TABUNGAN 2026',
      netSavings: 45820000,
      pemasukan: 120200000,
      pengeluaran: 35380000,
      savingsRate: 54.4,
      isTargetMet: true,
      aiReviewBadge: 'ANNUAL REVIEW',
      aiReviewText: 'Pertumbuhan dana tabungan tahun 2026 berjalan sangat stabil dengan rata-rata tabungan Rp 5.09 juta. Proyeksi dana darurat dan tujuan finansial Anda berada di jalur aman (On Track).',
      chartBars: [0.55, 0.60, 0.65, 0.75],
      chartLabels: ['Q1', 'Q2', 'Q3', 'Q4*'],
      categories: _categoriesYearly,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _tabController.addListener(() {
      setState(() => _selectedTabIndex = _tabController.index);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  String _formatRupiah(int amount) {
    final formatter = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    return formatter.format(amount);
  }

  String _formatRupiahShort(int amount) {
    if (amount >= 1000000000) return 'Rp ${(amount / 1000000000).toStringAsFixed(1)}M';
    if (amount >= 1000000) return 'Rp ${(amount / 1000000).toStringAsFixed(2)}jt';
    if (amount >= 1000) return 'Rp ${(amount / 1000).toStringAsFixed(0)}rb';
    return 'Rp $amount';
  }

  @override
  Widget build(BuildContext context) {
    final data = _periodData[_selectedTabIndex];

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // ── AppBar ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.arrow_back, color: AppColors.textDark),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Laporan Tabungan',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.textDark),
                    ),
                    child: const Icon(Icons.question_mark, color: AppColors.textDark, size: 14),
                  ),
                ],
              ),
            ),

            // ── Tab Bar ──
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.inputBorder),
              ),
              child: TabBar(
                controller: _tabController,
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                labelColor: Colors.white,
                unselectedLabelColor: AppColors.textMuted,
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                unselectedLabelStyle: const TextStyle(fontSize: 12),
                indicator: BoxDecoration(
                  color: AppColors.primaryBrown,
                  borderRadius: BorderRadius.circular(8),
                ),
                indicatorSize: TabBarIndicatorSize.tab,
                dividerColor: Colors.transparent,
                tabs: _tabs.map((t) => Tab(text: t)).toList(),
              ),
            ),
            const SizedBox(height: 4),

            // ── Navigasi Periode ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () => setState(() {}),
                    child: const Icon(Icons.chevron_left, color: AppColors.textDark, size: 22),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.inputBorder),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today, size: 14, color: AppColors.textMuted),
                        const SizedBox(width: 6),
                        Text(
                          data.title,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textDark),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () => setState(() {}),
                    child: const Icon(Icons.chevron_right, color: AppColors.textDark, size: 22),
                  ),
                ],
              ),
            ),

            // ── Body Scroll ──
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // Net Savings Card
                    _buildNetSavingsCard(data),
                    const SizedBox(height: 16),

                    // AI Review
                    _buildAiReviewCard(data),
                    const SizedBox(height: 16),

                    // Chart
                    _buildChartCard(data),
                    const SizedBox(height: 16),

                    // Kategori Pengeluaran
                    _buildCategoryList(data),
                    const SizedBox(height: 16),

                    // Ekspor Laporan (hanya Bulan & Tahunan)
                    if (_selectedTabIndex == 0 || _selectedTabIndex == 3)
                      _buildEksporCard(),
                    const SizedBox(height: 16),

                    // CTA Tambah Dana
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.add_circle_outline, size: 18),
                        label: const Text('Tambah Dana ke Tabungan'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBrown,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ),
                    ),
                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Widgets ─────────────────────────────────────────────────────────────────

  Widget _buildNetSavingsCard(_PeriodData data) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.primaryBrown,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                data.subtitle,
                style: const TextStyle(fontSize: 10, color: Colors.white60, fontWeight: FontWeight.w600, letterSpacing: 0.8),
              ),
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: data.isTargetMet ? AppColors.greenAccent : Colors.orange,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  data.isTargetMet ? '✓ Target Terpenuhi' : '⚡ Surplus',
                  style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            _formatRupiah(data.netSavings),
            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Text(
                'Tingkat Tabungan (Savings Rate)',
                style: const TextStyle(fontSize: 12, color: Colors.white70),
              ),
              const Spacer(),
              Text(
                '${data.savingsRate.toStringAsFixed(1)}%',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 6),
          // Progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: data.savingsRate / 100,
              backgroundColor: Colors.white24,
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF4CAF50)),
              minHeight: 6,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildIncomeExpenseItem(Icons.arrow_downward, 'Pemasukan', data.pemasukan, true)),
              const SizedBox(width: 12),
              Expanded(child: _buildIncomeExpenseItem(Icons.arrow_upward, 'Pengeluaran', data.pengeluaran, false)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIncomeExpenseItem(IconData icon, String label, int amount, bool isIncome) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: isIncome ? const Color(0xFF4CAF50) : const Color(0xFFFF7043)),
              const SizedBox(width: 4),
              Text(label, style: const TextStyle(fontSize: 11, color: Colors.white70)),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            _formatRupiahShort(amount),
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildAiReviewCard(_PeriodData data) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.insightBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.insightBorder),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.accentOrange,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      'AI Copilot Review',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textDark),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.accentOrange,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        data.aiReviewBadge,
                        style: const TextStyle(fontSize: 9, color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  data.aiReviewText,
                  style: const TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChartCard(_PeriodData data) {
    final isQuarterly = _selectedTabIndex == 2;
    final isYearly = _selectedTabIndex == 3;
    final chartTitle = isYearly
        ? 'Tren Kuartalan 2026'
        : isQuarterly
            ? 'Tren Bulanan Q3'
            : 'Tren Mingguan';
    final chartSubtitle = isYearly
        ? 'Performa 4 Kuartal Tahun 2026'
        : isQuarterly
            ? 'Komposisi Pemasukan & Pengeluaran'
            : 'Komposisi Pemasukan & Pengeluaran';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(chartTitle, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark)),
              Row(
                children: [
                  _buildLegendDot(AppColors.primaryBrown, 'Masuk'),
                  const SizedBox(width: 12),
                  _buildLegendDot(AppColors.accentOrange, 'Keluar'),
                ],
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(chartSubtitle, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
          const SizedBox(height: 20),
          SizedBox(
            height: 100,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(data.chartBars.length, (index) {
                final bar = data.chartBars[index];
                return Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        AnimatedContainer(
                          duration: Duration(milliseconds: 300 + index * 80),
                          width: 14,
                          height: 70 * bar,
                          decoration: BoxDecoration(
                            color: AppColors.primaryBrown,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                        const SizedBox(width: 4),
                        AnimatedContainer(
                          duration: Duration(milliseconds: 300 + index * 80),
                          width: 14,
                          height: 70 * bar * 0.6,
                          decoration: BoxDecoration(
                            color: AppColors.accentOrange.withOpacity(0.7),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(data.chartLabels[index], style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                  ],
                );
              }),
            ),
          ),
          if (_selectedTabIndex == 3) ...[
            const SizedBox(height: 8),
            const Text(
              '* Q4 masih berjalan; data diproyeksi aktual & proyeksi akhir tahun',
              style: TextStyle(fontSize: 9, color: AppColors.textMuted, fontStyle: FontStyle.italic),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildLegendDot(Color color, String label) {
    return Row(
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
      ],
    );
  }

  Widget _buildCategoryList(_PeriodData data) {
    final isYearly = _selectedTabIndex == 3;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isYearly ? 'Alokasi Pengeluaran 2026' : 'Kategori Pengeluaran',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.insightBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Total ${data.categories.length} Pos',
                  style: const TextStyle(fontSize: 10, color: AppColors.primaryBrown, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
          if (isYearly) ...[
            const SizedBox(height: 4),
            const Text('1 Tahun Penuh', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
          ] else ...[
            const SizedBox(height: 4),
            Text(
              '${data.categories.length} Aktifitas Terbesar ${_selectedTabIndex == 2 ? 'Kuartal 3' : 'Bulan Ini'}',
              style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
            ),
          ],
          const SizedBox(height: 16),
          ...data.categories.map((cat) => _buildCategoryRow(cat)),
        ],
      ),
    );
  }

  Widget _buildCategoryRow(_SpendingCategory cat) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: cat.iconColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(cat.icon, color: cat.iconColor, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(cat.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.textDark)),
                Text(cat.subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                _formatRupiahShort(cat.amount),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textDark),
              ),
              Text(
                '${cat.percent.toStringAsFixed(1)}%',
                style: TextStyle(fontSize: 11, color: cat.iconColor, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEksporCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.file_download_outlined, color: AppColors.textMuted, size: 18),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'Ekspor Laporan',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textDark),
                ),
              ),
              Text('Siap Cetak & Berbagi', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.picture_as_pdf, color: Colors.red, size: 18),
                  label: const Column(
                    children: [
                      Text('Dokumen PDF', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
                      Text('Laporan instan rapi', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                    ],
                  ),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: const BorderSide(color: AppColors.inputBorder),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.table_chart, color: Color(0xFF217346), size: 18),
                  label: const Column(
                    children: [
                      Text('Spreadsheet CSV', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
                      Text('Untuk Excel / Sheets', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                    ],
                  ),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: const BorderSide(color: AppColors.inputBorder),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.download, color: AppColors.primaryBrown, size: 18),
              label: const Text('↓ Download Laporan Lengkap (PDF)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primaryBrown)),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                side: const BorderSide(color: AppColors.primaryBrown),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
