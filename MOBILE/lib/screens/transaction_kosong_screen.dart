import 'package:flutter/material.dart';
import '../utils/theme.dart';

class TransactionKosongScreen extends StatelessWidget {
  const TransactionKosongScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // 1. Header Navigation & Title
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.arrow_back, color: AppColors.textDark),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'Semua Transaksi',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                          Text(
                            'Catatan Keuangan Terorganisir',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Row(
                    children: const [
                      Icon(Icons.search, color: AppColors.textDark),
                      SizedBox(width: 16),
                      Icon(Icons.tune, color: AppColors.textDark),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // 2. Filter Tab Menu
              Container(
                decoration: BoxDecoration(
                  color: AppColors.inputBorder,
                  borderRadius: BorderRadius.circular(24),
                ),
                padding: const EdgeInsets.all(4),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: AppColors.primaryBrown,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Center(
                          child: Text(
                            'Semua (0)',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const Expanded(
                      child: Center(
                        child: Text(
                          'Pengeluaran',
                          style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                        ),
                      ),
                    ),
                    const Expanded(
                      child: Center(
                        child: Text(
                          'Pemasukan',
                          style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 3. Filter Bulan & Ekspor Data
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.inputBorder),
                      borderRadius: BorderRadius.circular(16),
                      color: Colors.white,
                    ),
                    child: Row(
                      children: const [
                        Icon(Icons.calendar_today, size: 14, color: AppColors.textDark),
                        SizedBox(width: 6),
                        Text(
                          'Bulan Ini',
                          style: TextStyle(fontSize: 12, color: AppColors.textDark),
                        ),
                        Icon(Icons.arrow_drop_down, size: 16, color: AppColors.textDark),
                      ],
                    ),
                  ),
                  Row(
                    children: const [
                      Icon(Icons.download, size: 14, color: AppColors.textMuted),
                      SizedBox(width: 4),
                      Text(
                        'Ekspor Data',
                        style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // 4. Ringkasan Arus Kas Card
              Container(
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
                        Row(
                          children: const [
                            Icon(Icons.circle, size: 10, color: AppColors.textMuted),
                            SizedBox(width: 8),
                            Text(
                              'Ringkasan Arus Kas',
                              style: TextStyle(color: AppColors.textMuted, fontSize: 12),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.background,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            '0 Transaksi',
                            style: TextStyle(fontSize: 10, color: AppColors.textMuted),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text('↓ Total Keluar', style: TextStyle(color: Colors.red, fontSize: 12)),
                              SizedBox(height: 4),
                              Text(
                                'Rp 0',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: AppColors.textDark,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(width: 1, height: 30, color: AppColors.inputBorder),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(left: 16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text('↑ Total Masuk', style: TextStyle(color: AppColors.greenAccent, fontSize: 12)),
                                SizedBox(height: 4),
                                Text(
                                  'Rp 0',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: AppColors.textDark,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // 5. Empty State Icon & Text
              Container(
                width: 110,
                height: 110,
                decoration: const BoxDecoration(
                  color: AppColors.insightBg,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.receipt_long,
                  size: 50,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Belum Ada Transaksi Tercatat',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Catat pengeluaran dan pemasukan harianmu\nuntuk mulai mengontrol finansial dengan cerdas\nbersama MoneyMate.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.textMuted, fontSize: 12, height: 1.4),
              ),
              const SizedBox(height: 24),

              // 6. Tombol Catat Pertama
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBrown,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  onPressed: () {},
                  icon: const Icon(Icons.add, color: Colors.white, size: 20),
                  label: const Text(
                    'Catat Transaksi Pertama',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // 7. Option Cards
              const Text(
                'ATAU CARA LEBIH CEPAT',
                style: TextStyle(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: _buildActionCard(
                      Icons.document_scanner,
                      'Scan Struk',
                      'Deteksi Otomatis',
                      AppColors.insightBg,
                      AppColors.accentOrange,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionCard(
                      Icons.account_balance,
                      'Import Bank',
                      'BCA, Mandiri, GoPay',
                      AppColors.insightBg,
                      AppColors.primaryBrown,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionCard(
      IconData icon,
      String title,
      String subtitle,
      Color iconBgColor,
      Color iconColor,
      ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: iconBgColor, shape: BoxShape.circle),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(height: 10),
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.textDark),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
          ),
        ],
      ),
    );
  }
}