import 'package:flutter/material.dart';
import 'add_goal_funds_screen.dart';
import 'kelola_kategori_screen.dart';

class LaporanScreen extends StatefulWidget {
  const LaporanScreen({super.key});

  @override
  State<LaporanScreen> createState() => _LaporanScreenState();
}

class _LaporanScreenState extends State<LaporanScreen> {
  // 0: Bulan Ini (Sep 2026), 1: Bulan Lalu (Agu 2026), 2: Kuartal 3, 3: Tahun 2026
  int _selectedPeriodIndex = 0;

  // Pilihan format ekspor (0: PDF, 1: CSV)
  int _selectedExportFormat = 0;

  final List<String> _periods = [
    'Bulan Ini',
    'Bulan Lalu',
    'Kuartal 3',
    'Tahun 2026',
  ];

  final List<String> _periodDates = [
    'September 2026',
    'Agustus 2026',
    'Kuartal 3 (Jul – Sep 2026)',
    'Tahun 2026',
  ];

  void _onPreviousPeriod() {
    if (_selectedPeriodIndex > 0) {
      setState(() => _selectedPeriodIndex--);
    }
  }

  void _onNextPeriod() {
    if (_selectedPeriodIndex < _periods.length - 1) {
      setState(() => _selectedPeriodIndex++);
    }
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Color(0xFFFBECE5),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.info_outline, color: Color(0xFF8A3A23), size: 20),
            ),
            const SizedBox(width: 12),
            const Text(
              'Panduan Laporan',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
            ),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '• Net Savings: Selisih antara total pemasukan dan total pengeluaran Anda.',
              style: TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF5A4A42)),
            ),
            SizedBox(height: 8),
            Text(
              '• Savings Rate: Persentase pendapatan yang berhasil Anda sisihkan ke tabungan.',
              style: TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF5A4A42)),
            ),
            SizedBox(height: 8),
            Text(
              '• AI Copilot Review: Analisis otomatis berbasis AI untuk mengevaluasi efisiensi pengeluaran.',
              style: TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF5A4A42)),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Mengerti', style: TextStyle(color: Color(0xFF8A3A23), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showExportSuccessModal() {
    final formatName = _selectedExportFormat == 0 ? 'PDF' : 'CSV';
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(
                  color: Color(0xFFE8F5E9),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.download_done_rounded, color: Color(0xFF2E7D32), size: 36),
              ),
              const SizedBox(height: 16),
              Text(
                'Laporan ($formatName) Siap Diunduh',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
              ),
              const SizedBox(height: 8),
              Text(
                'Laporan keuangan periode ${_periodDates[_selectedPeriodIndex]} telah selesai direkonsiliasi dalam format $formatName.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: Color(0xFF8C827A), height: 1.4),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF8A3A23),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('File Laporan-$formatName-${_periodDates[_selectedPeriodIndex]}.pdf disimpan ke Perangkat.'),
                        backgroundColor: const Color(0xFF8A3A23),
                      ),
                    );
                  },
                  icon: const Icon(Icons.share_outlined, color: Colors.white, size: 18),
                  label: const Text('Buka / Bagikan File', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back, color: Color(0xFF2C1A14), size: 24),
                onPressed: () => Navigator.maybePop(context),
              )
            : null,
        title: const Text(
          'Laporan Keuangan',
          style: TextStyle(
            color: Color(0xFF2C1A14),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: false,
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF2C1A14)),
              ),
              child: const Icon(Icons.question_mark, color: Color(0xFF2C1A14), size: 14),
            ),
            onPressed: _showHelpDialog,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Date Switcher ( <  [Calendar] September 2026  > )
              Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3ECE4),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.chevron_left, color: Color(0xFF4A2511), size: 22),
                      onPressed: _onPreviousPeriod,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.calendar_today_outlined, size: 16, color: Color(0xFF8A3A23)),
                        const SizedBox(width: 8),
                        Text(
                          _periodDates[_selectedPeriodIndex],
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF2C1A14),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.chevron_right, color: Color(0xFF4A2511), size: 22),
                      onPressed: _onNextPeriod,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                    ),
                  ],
                ),
              ),

              // 2. Filter Pills Segmented Control
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: List.generate(_periods.length, (idx) {
                    final isSel = idx == _selectedPeriodIndex;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedPeriodIndex = idx),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: isSel ? const Color(0xFF38180E) : const Color(0xFFF1EBE4),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _periods[idx],
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                            color: isSel ? Colors.white : const Color(0xFF4A2511),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
              const SizedBox(height: 16),

              // 3. Hero Net Savings Card
              _buildNetSavingsCard(),
              const SizedBox(height: 16),

              // 4. AI Copilot Review Card
              _buildAICopilotCard(),
              const SizedBox(height: 16),

              // 5. Tren Mingguan / Bulanan Bar Chart Card
              _buildTrendChartCard(),
              const SizedBox(height: 16),

              // 6. Kategori Pengeluaran Card
              _buildCategoryCard(),
              const SizedBox(height: 20),

              // 7. Bottom Section (Ekspor Laporan or Tambah Dana Button)
              _buildBottomActionSection(),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  // ==============================================================
  // WIDGET HELPER: NET SAVINGS CARD
  // ==============================================================
  Widget _buildNetSavingsCard() {
    String title;
    String badgeText;
    bool isBadgeTarget = false;
    String amount;
    String rateLabel;
    String rateVal;
    double progressRatio;
    String incomeVal;
    String incomeDiff;
    String expenseVal;
    String expenseDiff;

    if (_selectedPeriodIndex == 0) {
      // Bulan Ini
      title = 'NET SAVINGS (TABUNGAN BERSIH)';
      badgeText = 'Sangat Sehat';
      amount = 'Rp 5.080.000';
      rateLabel = 'Tingkat Tabungan (Savings Rate)';
      rateVal = '59.7%';
      progressRatio = 0.597;
      incomeVal = 'Rp 8.500.000';
      incomeDiff = '↗ +12% bln lalu';
      expenseVal = 'Rp 3.420.000';
      expenseDiff = '↘ -8% hemat';
    } else if (_selectedPeriodIndex == 1) {
      // Bulan Lalu
      title = 'NET SAVINGS (TABUNGAN BERSIH)';
      badgeText = 'Sangat Sehat';
      amount = 'Rp 4.650.000';
      rateLabel = 'Tingkat Tabungan (Savings Rate)';
      rateVal = '58.1%';
      progressRatio = 0.581;
      incomeVal = 'Rp 8.000.000';
      incomeDiff = '↗ +8.5% bln lalu';
      expenseVal = 'Rp 3.350.000';
      expenseDiff = '↘ -12% hemat';
    } else if (_selectedPeriodIndex == 2) {
      // Kuartal 3
      title = 'AKUMULASI TABUNGAN BERSIH\n(Q3)';
      badgeText = 'Target\nTercapai';
      isBadgeTarget = true;
      amount = 'Rp 14.850.000';
      rateLabel = 'Tingkat Tabungan Rata-rata';
      rateVal = '58.7%';
      progressRatio = 0.587;
      incomeVal = 'Rp 25.3jt';
      incomeDiff = '↗ +14% vs Q2';
      expenseVal = 'Rp 10.45jt';
      expenseDiff = '— Stabil';
    } else {
      // Tahun 2026
      title = 'AKUMULASI TABUNGAN BERSIH\n(2026)';
      badgeText = 'Sangat\nPrima';
      isBadgeTarget = true;
      amount = 'Rp 48.200.000';
      rateLabel = 'Tingkat Tabungan Tahunan';
      rateVal = '61.4%';
      progressRatio = 0.614;
      incomeVal = 'Rp 78.5jt';
      incomeDiff = '↗ +18% vs 2025';
      expenseVal = 'Rp 30.3jt';
      expenseDiff = '↘ Efisien';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF38180E),
            Color(0xFF260F08),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF38180E).withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Label & Status Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.6,
                    color: Color(0xFFD2B8A8),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isBadgeTarget
                      ? const Color(0xFF4A342B)
                      : const Color(0xFF244730),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isBadgeTarget ? Icons.verified : Icons.check_circle,
                      size: 13,
                      color: isBadgeTarget ? const Color(0xFFF0D5C3) : const Color(0xFF81C784),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      badgeText,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isBadgeTarget ? const Color(0xFFF0D5C3) : const Color(0xFFB9F6CA),
                      ),
                      textAlign: TextAlign.right,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Total Net Amount
          Text(
            amount,
            style: const TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 14),

          // Savings Rate Label & Percentage
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                rateLabel,
                style: const TextStyle(fontSize: 11, color: Color(0xFFD2B8A8)),
              ),
              Text(
                rateVal,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progressRatio,
              minHeight: 6,
              backgroundColor: Colors.white.withValues(alpha: 0.15),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFE28B6E)),
            ),
          ),
          const SizedBox(height: 18),

          // Sub-cards Pemasukan & Pengeluaran
          Row(
            children: [
              // Pemasukan
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.arrow_downward, color: Color(0xFFD2B8A8), size: 12),
                          const SizedBox(width: 4),
                          Text(
                            _selectedPeriodIndex == 2 ? 'Pemasukan Q3' : 'Pemasukan',
                            style: const TextStyle(fontSize: 11, color: Color(0xFFD2B8A8)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        incomeVal,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        incomeDiff,
                        style: const TextStyle(fontSize: 10, color: Color(0xFF81C784)),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),

              // Pengeluaran
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.arrow_upward, color: Color(0xFFD2B8A8), size: 12),
                          const SizedBox(width: 4),
                          Text(
                            _selectedPeriodIndex == 2 ? 'Pengeluaran Q3' : 'Pengeluaran',
                            style: const TextStyle(fontSize: 11, color: Color(0xFFD2B8A8)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        expenseVal,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        expenseDiff,
                        style: const TextStyle(fontSize: 10, color: Color(0xFFE28B6E)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ==============================================================
  // WIDGET HELPER: AI COPILOT REVIEW CARD
  // ==============================================================
  Widget _buildAICopilotCard() {
    String auditBadge = 'SMART AUDIT';
    String description = '';

    if (_selectedPeriodIndex == 0) {
      auditBadge = 'SMART AUDIT';
      description =
          'Rasio tabungan Anda bulan September mencapai rekor 59.7%! Pengeluaran makanan terkendali 15% lebih baik setelah rekomendasi meal-prep minggu lalu.';
    } else if (_selectedPeriodIndex == 1) {
      auditBadge = 'SMART AUDIT';
      description =
          'Bulan Agustus 2026 Anda berhasil menabung Rp 4.650.000 dengan rasio 58.1%. Surplus dana terbesar berasal dari pos efisiensi tagihan utilitas dan belanja harian.';
    } else if (_selectedPeriodIndex == 2) {
      auditBadge = 'SMART AUDIT Q3';
      description =
          'Performa Kuartal 3 sangat impresif! Anda sukses menyisihkan 58.7% dari total pendapatan 3 bulan. Konsistensi tabungan meningkat 12% dibandingkan Kuartal 2.';
    } else {
      auditBadge = 'ANNUAL AUDIT';
      description =
          'Pertumbuhan tabungan tahun 2026 sangat stabil dengan surplus rata-rata Rp 4jt per bulan. Alokasi investasi Anda meningkat 25% dibanding tahun sebelumnya.';
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFBF5EE),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1E6D8)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: Color(0xFF8A3A23),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
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
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2C1A14),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF6E2D8),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        auditBadge,
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF8A3A23),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF5A4A42),
                    height: 1.45,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==============================================================
  // WIDGET HELPER: TREN MINGGUAN / BULANAN CHART
  // ==============================================================
  Widget _buildTrendChartCard() {
    final isQuarter = _selectedPeriodIndex == 2;
    final isYear = _selectedPeriodIndex == 3;
    final title = isQuarter ? 'Tren Bulanan Q3' : (isYear ? 'Tren Kuartal 2026' : 'Tren Mingguan');

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFEDE4D8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Judul & Legend
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2C1A14),
                    ),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'Komparasi Pemasukan & Pengeluaran',
                    style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                  ),
                ],
              ),
              Row(
                children: [
                  Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF582312), shape: BoxShape.circle)),
                  const SizedBox(width: 4),
                  const Text('Masuk', style: TextStyle(fontSize: 10, color: Color(0xFF5A4A42))),
                  const SizedBox(width: 8),
                  Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFFB35A43), shape: BoxShape.circle)),
                  const SizedBox(width: 4),
                  const Text('Keluar', style: TextStyle(fontSize: 10, color: Color(0xFF5A4A42))),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Custom Paired Bar Chart
          SizedBox(
            height: 140,
            child: isQuarter
                ? _buildQuarterBars()
                : (isYear ? _buildYearBars() : _buildWeeklyBars()),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyBars() {
    final data = _selectedPeriodIndex == 0
        ? [
            {'label': 'Mgg 1', 'in': 105.0, 'out': 48.0},
            {'label': 'Mgg 2', 'in': 65.0, 'out': 62.0},
            {'label': 'Mgg 3', 'in': 85.0, 'out': 52.0},
            {'label': 'Mgg 4', 'in': 78.0, 'out': 42.0},
          ]
        : [
            {'label': 'Mgg 1', 'in': 98.0, 'out': 56.0},
            {'label': 'Mgg 2', 'in': 68.0, 'out': 65.0},
            {'label': 'Mgg 3', 'in': 90.0, 'out': 48.0},
            {'label': 'Mgg 4', 'in': 75.0, 'out': 44.0},
          ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: data.map((item) {
        return Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                // Bar Masuk
                Container(
                  width: 14,
                  height: item['in'] as double,
                  decoration: const BoxDecoration(
                    color: Color(0xFF582312),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                  ),
                ),
                const SizedBox(width: 4),
                // Bar Keluar
                Container(
                  width: 14,
                  height: item['out'] as double,
                  decoration: const BoxDecoration(
                    color: Color(0xFFB35A43),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              item['label'] as String,
              style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
            ),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildQuarterBars() {
    final data = [
      {'label': 'Juli', 'in': 78.0, 'out': 48.0},
      {'label': 'Agustus', 'in': 84.0, 'out': 52.0},
      {'label': 'September', 'in': 108.0, 'out': 56.0},
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: data.map((item) {
        return Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  width: 16,
                  height: item['in'] as double,
                  decoration: const BoxDecoration(
                    color: Color(0xFF582312),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(6)),
                  ),
                ),
                const SizedBox(width: 5),
                Container(
                  width: 16,
                  height: item['out'] as double,
                  decoration: const BoxDecoration(
                    color: Color(0xFFB35A43),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(6)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              item['label'] as String,
              style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
            ),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildYearBars() {
    final data = [
      {'label': 'Q1', 'in': 75.0, 'out': 46.0},
      {'label': 'Q2', 'in': 88.0, 'out': 50.0},
      {'label': 'Q3', 'in': 105.0, 'out': 54.0},
      {'label': 'Q4 (Est)', 'in': 95.0, 'out': 48.0},
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: data.map((item) {
        return Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  width: 14,
                  height: item['in'] as double,
                  decoration: const BoxDecoration(
                    color: Color(0xFF582312),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                  ),
                ),
                const SizedBox(width: 4),
                Container(
                  width: 14,
                  height: item['out'] as double,
                  decoration: const BoxDecoration(
                    color: Color(0xFFB35A43),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              item['label'] as String,
              style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
            ),
          ],
        );
      }).toList(),
    );
  }

  // ==============================================================
  // WIDGET HELPER: KATEGORI PENGELUARAN CARD
  // ==============================================================
  Widget _buildCategoryCard() {
    final isQuarter = _selectedPeriodIndex == 2;
    final isAugust = _selectedPeriodIndex == 1;

    final categories = isQuarter
        ? [
            {
              'icon': Icons.restaurant_outlined,
              'title': 'Makanan & Minuman',
              'subtitle': 'Kebutuhan harian & kuliner',
              'amount': 'Rp 4.250.000',
              'pct': '40.7%',
              'ratio': 0.407,
              'barColor': const Color(0xFF582312),
              'iconBg': const Color(0xFFFBECE5),
            },
            {
              'icon': Icons.shopping_cart_outlined,
              'title': 'Belanja Supermarket',
              'subtitle': 'Bahan pokok & rumah',
              'amount': 'Rp 2.580.000',
              'pct': '24.7%',
              'ratio': 0.247,
              'barColor': const Color(0xFF8A3A23),
              'iconBg': const Color(0xFFFBF0EA),
            },
            {
              'icon': Icons.movie_outlined,
              'title': 'Hiburan & Langganan',
              'subtitle': 'Streaming & hobi',
              'amount': 'Rp 1.400.000',
              'pct': '13.4%',
              'ratio': 0.134,
              'barColor': const Color(0xFFB35A43),
              'iconBg': const Color(0xFFFDF4F0),
            },
            {
              'icon': Icons.directions_car_outlined,
              'title': 'Transportasi & Bensin',
              'subtitle': 'Bensin & e-toll',
              'amount': 'Rp 1.180.000',
              'pct': '11.3%',
              'ratio': 0.113,
              'barColor': const Color(0xFFE28B6E),
              'iconBg': const Color(0xFFFDF0EA),
            },
            {
              'icon': Icons.receipt_long_outlined,
              'title': 'Tagihan & Utilitas',
              'subtitle': 'Listrik, air & Wi-Fi',
              'amount': 'Rp 1.040.000',
              'pct': '9.9%',
              'ratio': 0.099,
              'barColor': const Color(0xFF8C827A),
              'iconBg': const Color(0xFFF5F3F0),
            },
          ]
        : (isAugust
            ? [
                {
                  'icon': Icons.restaurant_outlined,
                  'title': 'Makanan & Minuman',
                  'subtitle': 'Kebutuhan harian & kuliner',
                  'amount': 'Rp 1.350.000',
                  'pct': '40.3%',
                  'ratio': 0.403,
                  'barColor': const Color(0xFF582312),
                  'iconBg': const Color(0xFFFBECE5),
                },
                {
                  'icon': Icons.shopping_cart_outlined,
                  'title': 'Belanja Supermarket',
                  'subtitle': 'Bahan pokok & rumah',
                  'amount': 'Rp 780.000',
                  'pct': '23.3%',
                  'ratio': 0.233,
                  'barColor': const Color(0xFF8A3A23),
                  'iconBg': const Color(0xFFFBF0EA),
                },
                {
                  'icon': Icons.movie_outlined,
                  'title': 'Hiburan & Langganan',
                  'subtitle': 'Streaming & hobi',
                  'amount': 'Rp 450.000',
                  'pct': '13.4%',
                  'ratio': 0.134,
                  'barColor': const Color(0xFFB35A43),
                  'iconBg': const Color(0xFFFDF4F0),
                },
                {
                  'icon': Icons.directions_car_outlined,
                  'title': 'Transportasi & Bensin',
                  'subtitle': 'Bensin & e-toll',
                  'amount': 'Rp 420.000',
                  'pct': '12.5%',
                  'ratio': 0.125,
                  'barColor': const Color(0xFFE28B6E),
                  'iconBg': const Color(0xFFFDF0EA),
                },
                {
                  'icon': Icons.bolt_outlined,
                  'title': 'Tagihan & Utilitas',
                  'subtitle': 'Listrik, air & Wi-Fi',
                  'amount': 'Rp 350.000',
                  'pct': '10.5%',
                  'ratio': 0.105,
                  'barColor': const Color(0xFF8C827A),
                  'iconBg': const Color(0xFFF5F3F0),
                },
              ]
            : [
                {
                  'icon': Icons.restaurant_outlined,
                  'title': 'Makanan & Minuman',
                  'subtitle': 'Kebutuhan harian & kuliner',
                  'amount': 'Rp 1.420.000',
                  'pct': '41.5%',
                  'ratio': 0.415,
                  'barColor': const Color(0xFF582312),
                  'iconBg': const Color(0xFFFBECE5),
                },
                {
                  'icon': Icons.shopping_cart_outlined,
                  'title': 'Belanja Supermarket',
                  'subtitle': 'Bahan pokok & rumah',
                  'amount': 'Rp 850.000',
                  'pct': '24.8%',
                  'ratio': 0.248,
                  'barColor': const Color(0xFF8A3A23),
                  'iconBg': const Color(0xFFFBF0EA),
                },
                {
                  'icon': Icons.movie_outlined,
                  'title': 'Hiburan & Langganan',
                  'subtitle': 'Streaming & hobi',
                  'amount': 'Rp 450.000',
                  'pct': '13.1%',
                  'ratio': 0.131,
                  'barColor': const Color(0xFFB35A43),
                  'iconBg': const Color(0xFFFDF4F0),
                },
                {
                  'icon': Icons.directions_car_outlined,
                  'title': 'Transportasi & Bensin',
                  'subtitle': 'Bensin & e-toll',
                  'amount': 'Rp 380.000',
                  'pct': '11.1%',
                  'ratio': 0.111,
                  'barColor': const Color(0xFFE28B6E),
                  'iconBg': const Color(0xFFFDF0EA),
                },
                {
                  'icon': Icons.receipt_long_outlined,
                  'title': 'Tagihan & Utilitas',
                  'subtitle': 'Listrik, air & Wi-Fi',
                  'amount': 'Rp 320.000',
                  'pct': '9.5%',
                  'ratio': 0.095,
                  'barColor': const Color(0xFF8C827A),
                  'iconBg': const Color(0xFFF5F3F0),
                },
              ]);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFEDE4D8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Judul & Badge Total 5 Pos (Bisa diklik untuk buka Kelola Kategori)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Kategori Pengeluaran',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2C1A14),
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const KelolaKategoriScreen()),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5ECE4),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Total 5 Pos',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF5A4A42),
                        ),
                      ),
                      SizedBox(width: 2),
                      Icon(Icons.chevron_right, size: 14, color: Color(0xFF5A4A42)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            isQuarter ? '5 Alokasi Terbesar Kuartal 3' : '5 Alokasi Terbesar Bulan Ini',
            style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
          ),
          const SizedBox(height: 18),

          // Daftar Item Kategori
          ...categories.map((cat) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: cat['iconBg'] as Color,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          cat['icon'] as IconData,
                          color: const Color(0xFF582312),
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              cat['title'] as String,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2C1A14),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              cat['subtitle'] as String,
                              style: const TextStyle(
                                fontSize: 10,
                                color: Color(0xFF8C827A),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            cat['amount'] as String,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF2C1A14),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            cat['pct'] as String,
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF8C827A),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Progress Bar Indikator
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: cat['ratio'] as double,
                      minHeight: 4,
                      backgroundColor: const Color(0xFFF3ECE4),
                      valueColor: AlwaysStoppedAnimation<Color>(cat['barColor'] as Color),
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

  // ==============================================================
  // WIDGET HELPER: BOTTOM ACTION / EKSPOR LAPORAN SECTION
  // ==============================================================
  Widget _buildBottomActionSection() {
    if (_selectedPeriodIndex == 0) {
      // Bulan Ini: Ekspor Laporan PDF & CSV
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.file_download_outlined, color: Color(0xFF8A3A23), size: 18),
              SizedBox(width: 6),
              Text(
                'Ekspor Laporan',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2C1A14),
                ),
              ),
              Spacer(),
              Text(
                'Siap Cetak & Rekonsiliasi',
                style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Pilihan Dua Kotak: Dokumen PDF & Spreadsheet CSV
          Row(
            children: [
              // PDF Option
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedExportFormat = 0),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: _selectedExportFormat == 0
                            ? const Color(0xFF8A3A23)
                            : const Color(0xFFEDE4D8),
                        width: _selectedExportFormat == 0 ? 1.5 : 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFBECE5),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.picture_as_pdf_outlined, color: Color(0xFF8A3A23), size: 20),
                            ),
                            Icon(
                              _selectedExportFormat == 0
                                  ? Icons.radio_button_checked
                                  : Icons.radio_button_off,
                              color: _selectedExportFormat == 0
                                  ? const Color(0xFF8A3A23)
                                  : const Color(0xFFBFB3A4),
                              size: 18,
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Dokumen PDF',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Laporan resmi rapi',
                          style: TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // CSV Option
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedExportFormat = 1),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: _selectedExportFormat == 1
                            ? const Color(0xFF8A3A23)
                            : const Color(0xFFEDE4D8),
                        width: _selectedExportFormat == 1 ? 1.5 : 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE8F5E9),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.table_chart_outlined, color: Color(0xFF2E7D32), size: 20),
                            ),
                            Icon(
                              _selectedExportFormat == 1
                                  ? Icons.radio_button_checked
                                  : Icons.radio_button_off,
                              color: _selectedExportFormat == 1
                                  ? const Color(0xFF8A3A23)
                                  : const Color(0xFFBFB3A4),
                              size: 18,
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Spreadsheet CSV',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Untuk Excel / Sheets',
                          style: TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Tombol Download Laporan Lengkap
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF8A3A23),
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
              ),
              onPressed: _showExportSuccessModal,
              icon: const Icon(Icons.file_download_outlined, color: Colors.white, size: 20),
              label: Text(
                _selectedExportFormat == 0
                    ? 'Download Laporan Lengkap (PDF)'
                    : 'Download Laporan Lengkap (CSV)',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      );
    } else if (_selectedPeriodIndex == 1) {
      // Bulan Lalu: Tombol Tambah Dana ke Tabungan
      return SizedBox(
        width: double.infinity,
        height: 50,
        child: ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF8A3A23),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const AddGoalFundsScreen()),
            );
          },
          icon: const Icon(Icons.add_circle_outline, color: Colors.white, size: 20),
          label: const Text(
            'Tambah Dana ke Tabungan',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
      );
    } else if (_selectedPeriodIndex == 2) {
      // Kuartal 3: Tombol Tambah Dana Tabungan Sekarang
      return SizedBox(
        width: double.infinity,
        height: 50,
        child: ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF8A3A23),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const AddGoalFundsScreen()),
            );
          },
          icon: const Icon(Icons.add_circle_outline, color: Colors.white, size: 20),
          label: const Text(
            'Tambah Dana Tabungan Sekarang',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
      );
    } else {
      // Tahun 2026: Tombol Download Laporan Tahunan
      return SizedBox(
        width: double.infinity,
        height: 50,
        child: ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF8A3A23),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
          ),
          onPressed: _showExportSuccessModal,
          icon: const Icon(Icons.download_rounded, color: Colors.white, size: 20),
          label: const Text(
            'Download Rekap Tahunan (PDF)',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
      );
    }
  }
}