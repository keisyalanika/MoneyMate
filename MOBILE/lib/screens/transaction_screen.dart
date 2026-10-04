import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../utils/theme.dart';

// Global state sementara untuk mensimulasikan penambahan transaksi
final ValueNotifier<Map<String, dynamic>?> newTransactionNotifier = ValueNotifier(null);

class TransactionScreen extends StatefulWidget {
  const TransactionScreen({super.key});

  @override
  State<TransactionScreen> createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  // Ganti ini menjadi 'true' jika ingin melihat daftar transaksi yang berisi data
  bool hasData = false; 

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<Map<String, dynamic>?>(
      valueListenable: newTransactionNotifier,
      builder: (context, newTx, child) {
        // Jika ada transaksi baru, paksa tampilkan mode "Filled"
        bool shouldShowData = hasData || newTx != null;
        if (!shouldShowData) {
          return _buildEmptyState(context);
        }
        return _buildFilledState(context, newTx);
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () {},
        ),
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
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: AppColors.textDark, size: 22),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.tune, color: AppColors.textDark, size: 22),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 16),
            // Header Filters (Bulan Ini & Ekspor Data)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: AppColors.inputBorder),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: const [
                      Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.primaryBrown),
                      SizedBox(width: 6),
                      Text('Bulan Ini', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                      SizedBox(width: 4),
                      Icon(Icons.keyboard_arrow_down, size: 16, color: AppColors.textDark),
                    ],
                  ),
                ),
                Row(
                  children: const [
                    Icon(Icons.download_outlined, size: 16, color: AppColors.textMuted),
                    SizedBox(width: 4),
                    Text('Ekspor Data', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),
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
                onPressed: () {
                  // Tambah Transaksi
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
            const SizedBox(height: 32),
            const Text(
              'ATAU CARA LEBIH CEPAT',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textMuted, letterSpacing: 0.5),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.inputBorder),
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFFFF0E6),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.document_scanner_outlined, color: AppColors.primaryBrown, size: 20),
                        ),
                        const SizedBox(height: 12),
                        const Text('Scan Struk', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                        const SizedBox(height: 4),
                        const Text('Deteksi Otomatis', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.inputBorder),
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFFFF0E6),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.account_balance_outlined, color: AppColors.primaryBrown, size: 20),
                        ),
                        const SizedBox(height: 12),
                        const Text('Import Bank', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                        const SizedBox(height: 4),
                        const Text('BCA, Mandiri, GoPay', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                      ],
                    ),
                  ),
                ),
              ],
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
  Widget _buildFilledState(BuildContext context, Map<String, dynamic>? newTx) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () {
            // Jika dipanggil dari MainNav, mungkin back tidak diperlukan
          },
        ),
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
        actions: [
          Container(
            height: 32,
            margin: const EdgeInsets.symmetric(vertical: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.inputBorder),
              borderRadius: BorderRadius.circular(16),
              color: Colors.white,
            ),
            child: Row(
              children: const [
                Icon(Icons.download_outlined, size: 16, color: AppColors.textDark),
                SizedBox(width: 4),
                Text(
                  'Export',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Container(
            height: 32,
            width: 32,
            margin: const EdgeInsets.only(right: 16, top: 12, bottom: 12),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.inputBorder),
              shape: BoxShape.circle,
              color: Colors.white,
            ),
            child: const Icon(Icons.tune, size: 16, color: AppColors.textDark),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            // Search Bar
            Container(
              height: 48,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.inputBorder),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.02),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.search, color: AppColors.textMuted, size: 20),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Cari transaksi, toko, atau kategori...',
                        hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 13),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  const Icon(Icons.mic_none, color: AppColors.textMuted, size: 20),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // Rekap Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFF0E5D8)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.primaryBrown),
                          SizedBox(width: 6),
                          Text(
                            'Rekap 1 – 7 Sep 2026',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                              color: AppColors.textDark,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF0E6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '7 Hari Terakhir',
                          style: TextStyle(
                            color: AppColors.accentOrange,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF9FAFB),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFF3F4F6)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFDCFCE7),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.arrow_downward, color: Color(0xFF16A34A), size: 12),
                                  ),
                                  const SizedBox(width: 6),
                                  const Text('Pemasukan', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                                ],
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                '+Rp 8.500.000',
                                style: TextStyle(
                                  color: Color(0xFF16A34A),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text('3 transaksi masuk', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF9FAFB),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFF3F4F6)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFFEE2E2),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.arrow_upward, color: Color(0xFFDC2626), size: 12),
                                  ),
                                  const SizedBox(width: 6),
                                  const Text('Pengeluaran', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                                ],
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                '-Rp 3.420.000',
                                style: TextStyle(
                                  color: Color(0xFFDC2626),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text('21 transaksi keluar', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Hari Ini Group
            _buildDateHeader('Hari Ini', '7 Sep 2026 • -Rp 97.000'),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF0E5D8)),
              ),
              child: Column(
                children: [
                  if (newTx != null) ...[
                    _buildTransactionItem(
                      icon: newTx['isExpense'] ? Icons.local_offer_outlined : Icons.account_balance_wallet_outlined,
                      iconBg: const Color(0xFFF5F0EB),
                      iconColor: AppColors.primaryBrown,
                      title: newTx['category'],
                      hasReceipt: false,
                      subtitle1: newTx['note'] ?? 'Catatan Baru',
                      subtitle2: 'Tunai',
                      amount: '${newTx['isExpense'] ? '-' : '+'}Rp ${newTx['amount']}',
                      isExpense: newTx['isExpense'],
                      time: DateFormat('HH:mm').format(DateTime.now()) + ' WIB',
                    ),
                    const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                  ],
                  _buildTransactionItem(
                    icon: Icons.restaurant,
                    iconBg: const Color(0xFFF5F0EB),
                    iconColor: const Color(0xFF592314),
                    title: 'Restoran & Makan Siang',
                    hasReceipt: true,
                    subtitle1: 'Ayam Geprek Bu Sri',
                    subtitle2: 'Dompet Utama',
                    amount: '-Rp 25.000',
                    isExpense: true,
                    time: '12:45 WIB',
                  ),
                  const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                  _buildTransactionItem(
                    icon: Icons.coffee,
                    iconBg: const Color(0xFFF5F0EB),
                    iconColor: const Color(0xFF8C796E),
                    title: 'Kopi Janji Jiwa',
                    hasReceipt: false,
                    subtitle1: 'Iced Caramel Macchiato',
                    subtitle2: 'QRIS BCA',
                    amount: '-Rp 22.000',
                    isExpense: true,
                    time: '08:15 WIB',
                  ),
                  const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                  _buildTransactionItem(
                    icon: Icons.local_gas_station,
                    iconBg: const Color(0xFFF5F0EB),
                    iconColor: const Color(0xFF8C796E),
                    title: 'Bensin Pertamax',
                    hasReceipt: false,
                    subtitle1: 'SPBU Pertamina',
                    subtitle2: 'Tunai',
                    amount: '-Rp 50.000',
                    isExpense: true,
                    time: '07:10 WIB',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Kemarin Group
            _buildDateHeader('Kemarin', '6 Sep 2026 • Net +Rp 974.000'),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF0E5D8)),
              ),
              child: Column(
                children: [
                  _buildTransactionItem(
                    icon: Icons.payments_outlined,
                    iconBg: const Color(0xFFE8F5E9),
                    iconColor: const Color(0xFF16A34A),
                    title: 'Freelance Project Logo UI',
                    badgeText: 'Gaji / Fee',
                    badgeColor: const Color(0xFFDCFCE7),
                    badgeTextColor: const Color(0xFF16A34A),
                    subtitle1: 'Klien Studio Kreatif',
                    subtitle2: 'Transfer BCA',
                    amount: '+Rp 1.500.000',
                    isExpense: false,
                    time: '19:30 WIB',
                  ),
                  const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                  _buildTransactionItem(
                    icon: Icons.shopping_basket_outlined,
                    iconBg: const Color(0xFFF5F0EB),
                    iconColor: const Color(0xFF8C796E),
                    title: 'Belanja Mingguan',
                    hasReceipt: true,
                    subtitle1: 'Superindo Kebutuhan Pokok',
                    subtitle2: 'Debit Mandiri',
                    amount: '-Rp 340.000',
                    isExpense: true,
                    time: '17:45 WIB',
                  ),
                  const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                  _buildTransactionItem(
                    icon: Icons.movie_creation_outlined,
                    iconBg: const Color(0xFFF5F0EB),
                    iconColor: const Color(0xFF8C796E),
                    title: 'Netflix & Spotify Duo',
                    hasReceipt: false,
                    subtitle1: 'Hiburan Bulanan',
                    subtitle2: 'Kartu Kredit',
                    amount: '-Rp 186.000',
                    isExpense: true,
                    time: '10:00 WIB',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // 4 Sep 2026 Group
            _buildDateHeader('4 Sep 2026', 'Rabu • -Rp 450.000'),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF0E5D8)),
              ),
              child: _buildTransactionItem(
                icon: Icons.shopping_bag_outlined,
                iconBg: const Color(0xFFF5F0EB),
                iconColor: const Color(0xFF8C796E),
                title: 'Sepatu Olahraga',
                hasReceipt: true,
                subtitle1: 'Toko Olahraga',
                subtitle2: 'Debit Mandiri',
                amount: '-Rp 450.000',
                isExpense: true,
                time: '14:20 WIB',
              ),
            ),
            const SizedBox(height: 100), // spacing for bottom nav
          ],
        ),
      ),
    );
  }

  Widget _buildDateHeader(String title, String subtitle) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: AppColors.textDark,
          ),
        ),
        Text(
          subtitle,
          style: const TextStyle(
            fontSize: 11,
            color: AppColors.textMuted,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
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
