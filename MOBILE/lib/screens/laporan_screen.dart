import 'package:flutter/material.dart';
<<<<<<< HEAD
import '../utils/theme.dart';

class LaporanScreen extends StatelessWidget {
  const LaporanScreen({super.key});

  @override
=======
import 'package:intl/intl.dart';
import '../utils/theme.dart';

class LaporanScreen extends StatefulWidget {
  const LaporanScreen({super.key});

  @override
  State<LaporanScreen> createState() => _LaporanScreenState();
}

class _LaporanScreenState extends State<LaporanScreen> {
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _endDate = DateTime.now();

  Future<void> _selectDateRange(BuildContext context) async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
      initialDateRange: DateTimeRange(start: _startDate, end: _endDate),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primaryBrown, 
              onPrimary: Colors.white, 
              onSurface: AppColors.textDark, 
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primaryBrown, 
              ),
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
    }
  }

  @override
>>>>>>> dev/lanika
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
<<<<<<< HEAD
              // Header Judul
              const Text(
                'Laporan Keuangan',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 20),

              // Date Range Picker Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.inputBorder),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.calendar_today, size: 18, color: AppColors.textDark),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('DARI', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                            Text('19 Jun 2022', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                          ],
                        ),
                      ],
                    ),
                    const Icon(Icons.arrow_forward, size: 18, color: AppColors.textMuted),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today, size: 18, color: AppColors.textDark),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('SAMPAI', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                            Text('18 Jul 2022', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                          ],
                        ),
                      ],
                    ),
                  ],
=======
              // Header Judul & Tombol Kembali
              Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.arrow_back, color: AppColors.textDark),
                  ),
                  const SizedBox(width: 12),
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

              GestureDetector(
                onTap: () => _selectDateRange(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.inputBorder),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 18, color: AppColors.textDark),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('DARI', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                              Text(DateFormat('d MMM yyyy', 'id_ID').format(_startDate), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                            ],
                          ),
                        ],
                      ),
                      const Icon(Icons.arrow_forward, size: 18, color: AppColors.textMuted),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 18, color: AppColors.textDark),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('SAMPAI', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                              Text(DateFormat('d MMM yyyy', 'id_ID').format(_endDate), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
>>>>>>> dev/lanika
                ),
              ),
              const SizedBox(height: 24),

              // Card Pengeluaran Interactive Analysis
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.inputBorder),
                ),
                child: Column(
                  children: [
                    // Header Pengeluaran (Coklat)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: const BoxDecoration(
                        color: AppColors.primaryBrown,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(24),
                          topRight: Radius.circular(24),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'Pengeluaran',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Interactive Analysis',
                            style: TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                        ],
                      ),
                    ),

                    // Isi Card Analysis
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Interaktif Bulan Ini',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              // Placeholder Chart
                              Container(
                                width: 100,
                                height: 100,
                                decoration: const BoxDecoration(
                                  color: AppColors.insightBg,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.pie_chart,
                                  size: 50,
                                  color: AppColors.primaryBrown,
                                ),
                              ),
                              const SizedBox(width: 24),
                              // Legend Data
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildLegendItem(
                                      AppColors.primaryBrown,
                                      'Makanan',
                                      'Rp 3.200.000',
                                    ),
                                    _buildLegendItem(
                                      const Color(0xFFA07855),
                                      'Transportasi',
                                      'Rp 1.500.000',
                                    ),
                                    _buildLegendItem(
                                      AppColors.accentOrange,
                                      'Belanja',
                                      'Rp 1.000.000',
                                    ),
                                    _buildLegendItem(
                                      AppColors.textMuted,
                                      'Lainnya',
                                      'Rp 350.000',
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          const Text(
                            'Pemasukan',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Container(width: 16, height: 30, color: AppColors.primaryBrown),
                                  const SizedBox(width: 4),
                                  Container(width: 16, height: 45, color: AppColors.primaryBrown),
                                  const SizedBox(width: 4),
                                  Container(width: 16, height: 20, color: const Color(0xFFA07855)),
                                ],
                              ),
                              const Text(
                                'Analysis',
                                style: TextStyle(color: AppColors.textMuted, fontSize: 12),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
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

  Widget _buildLegendItem(Color color, String title, String amount) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        children: [
          Icon(Icons.circle, size: 10, color: color),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(fontSize: 12, color: AppColors.textDark),
          ),
          const Spacer(),
          Text(
            amount,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }
}