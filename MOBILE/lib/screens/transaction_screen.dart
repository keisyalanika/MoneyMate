import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../providers/finance_provider.dart';
import 'add_transaction_screen.dart';

// Global state sementara untuk kompatibilitas
final ValueNotifier<Map<String, dynamic>?> newTransactionNotifier = ValueNotifier(null);

class TransactionScreen extends StatefulWidget {
  final bool showBackButton;
  const TransactionScreen({super.key, this.showBackButton = false});

  @override
  State<TransactionScreen> createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  bool hasData = false; 
  int? _selectedMonth = 9; // Default: September (Bulan Ini)
  int _selectedYear = 2026;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, dynamic>> _monthOptions = const [
    {'title': 'Semua Bulan', 'month': null, 'year': null},
    {'title': 'September 2026 (Bulan Ini)', 'month': 9, 'year': 2026},
    {'title': 'Agustus 2026 (Bulan Lalu)', 'month': 8, 'year': 2026},
    {'title': 'Juli 2026', 'month': 7, 'year': 2026},
    {'title': 'Juni 2026', 'month': 6, 'year': 2026},
    {'title': 'Mei 2026', 'month': 5, 'year': 2026},
    {'title': 'April 2026', 'month': 4, 'year': 2026},
    {'title': 'Maret 2026', 'month': 3, 'year': 2026},
    {'title': 'Februari 2026', 'month': 2, 'year': 2026},
    {'title': 'Januari 2026', 'month': 1, 'year': 2026},
    {'title': 'Oktober 2026', 'month': 10, 'year': 2026},
    {'title': 'November 2026', 'month': 11, 'year': 2026},
    {'title': 'Desember 2026', 'month': 12, 'year': 2026},
  ];

  String get _selectedMonthLabel {
    if (_selectedMonth == null) return 'Semua Bulan';
    if (_selectedMonth == 9 && _selectedYear == 2026) return 'September 2026';
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return '${monthNames[_selectedMonth! - 1]} $_selectedYear';
  }

  void _showMonthPicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.65,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Pilih Periode Bulan',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20, color: AppColors.textMuted),
                    onPressed: () => Navigator.pop(ctx),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(color: AppColors.inputBorder, height: 1),
              const SizedBox(height: 8),
              Expanded(
                child: ListView.separated(
                  shrinkWrap: true,
                  itemCount: _monthOptions.length,
                  separatorBuilder: (_, __) => const Divider(color: Color(0xFFF7F3EE), height: 1),
                  itemBuilder: (context, idx) {
                    final opt = _monthOptions[idx];
                    final isSelected = opt['month'] == _selectedMonth &&
                        (opt['year'] == null || opt['year'] == _selectedYear);
                    return ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      leading: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFFFBECE5) : const Color(0xFFF5F0EB),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.calendar_today_outlined,
                          size: 16,
                          color: isSelected ? AppColors.primaryBrown : AppColors.textMuted,
                        ),
                      ),
                      title: Text(
                        opt['title'] as String,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          color: isSelected ? AppColors.primaryBrown : AppColors.textDark,
                        ),
                      ),
                      trailing: isSelected
                          ? const Icon(Icons.check_circle, color: AppColors.primaryBrown, size: 20)
                          : null,
                      onTap: () {
                        setState(() {
                          _selectedMonth = opt['month'] as int?;
                          if (opt['year'] != null) {
                            _selectedYear = opt['year'] as int;
                          }
                        });
                        Navigator.pop(ctx);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final finance = Provider.of<FinanceProvider>(context);

    return ValueListenableBuilder<Map<String, dynamic>?>(
      valueListenable: newTransactionNotifier,
      builder: (context, newTx, child) {
        bool shouldShowData = hasData || newTx != null || finance.transactions.isNotEmpty;
        if (!shouldShowData) {
          return _buildEmptyState(context);
        }
        return _buildFilledState(context, finance, newTx);
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
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 16),
            // Header Filters (Bulan Ini & Ekspor Data)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () => _showMonthPicker(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppColors.primaryBrown),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.primaryBrown),
                        const SizedBox(width: 6),
                        Text(
                          _selectedMonthLabel,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBrown),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.keyboard_arrow_down, size: 16, color: AppColors.primaryBrown),
                      ],
                    ),
                  ),
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
                      const Row(
                        children: [
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
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.arrow_downward, size: 12, color: Color(0xFFDC2626)),
                                SizedBox(width: 4),
                                Text('Total Keluar', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                              ],
                            ),
                            SizedBox(height: 4),
                            Text('Rp 0', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark)),
                          ],
                        ),
                      ),
                      Container(width: 1, height: 30, color: AppColors.inputBorder),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.arrow_upward, size: 12, color: AppColors.primaryBrown),
                                SizedBox(width: 4),
                                Text('Total Masuk', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                              ],
                            ),
                            SizedBox(height: 4),
                            Text('Rp 0', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark)),
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
                      BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4)),
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
                          Icon(Icons.receipt_long, size: 16, color: AppColors.accentOrange.withValues(alpha: 0.8)),
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
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const AddTransactionScreen()),
                  );
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
  Widget _buildFilledState(BuildContext context, FinanceProvider finance, Map<String, dynamic>? newTx) {
    final hasRealData = finance.transactions.isNotEmpty;
    final isDummyMonth = _selectedMonth == null || (_selectedMonth == 9 && _selectedYear == 2026);

    // Filter transaksi data riil berdasarkan bulan yang dipilih
    final realMonthTx = finance.transactions.where((t) {
      if (_selectedMonth != null) {
        final parsed = DateTime.tryParse(t.date);
        if (parsed != null && (parsed.month != _selectedMonth || parsed.year != _selectedYear)) {
          return false;
        }
      }
      return true;
    }).toList();

    final filteredRealTx = realMonthTx.where((t) {
      if (finance.activeTypeFilter != 'Semua' && t.type != finance.activeTypeFilter) {
        return false;
      }
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchTitle = t.title.toLowerCase().contains(q);
        final matchCat = t.categoryName.toLowerCase().contains(q);
        final matchNotes = t.notes?.toLowerCase().contains(q) ?? false;
        if (!matchTitle && !matchCat && !matchNotes) return false;
      }
      return true;
    }).toList();

    int totalIncome = 0;
    int totalExpense = 0;
    int txMasuk = 0;
    int txKeluar = 0;

    if (hasRealData) {
      for (final tx in realMonthTx) {
        if (tx.type == 'INCOME') {
          totalIncome += tx.amount.toInt();
          txMasuk++;
        } else {
          totalExpense += tx.amount.toInt();
          txKeluar++;
        }
      }
    } else {
      if (isDummyMonth) {
        totalIncome = 8500000;
        totalExpense = 3420000;
        txMasuk = 3;
        txKeluar = 21;
      } else {
        totalIncome = 0;
        totalExpense = 0;
        txMasuk = 0;
        txKeluar = 0;
      }
    }

    final int netHariIni = totalIncome - totalExpense;
    final String netHariIniStr = netHariIni < 0
        ? '-Rp ${_formatAmount((-netHariIni).toString())}'
        : '+Rp ${_formatAmount(netHariIni.toString())}';
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
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
            child: const Row(
              children: [
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
      body: RefreshIndicator(
        onRefresh: () => finance.refreshFromBackend(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),
              // Cache Tagging Status Banner (Requirement: last_fetched tracking UTC epoch)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F5E9),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFC8E6C9)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.storage_rounded, size: 16, color: Color(0xFF2E7D32)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        finance.lastFetchedMillis > 0
                            ? 'Drift SQLite Local Cache • Terakhir sync: ${DateFormat('dd/MM HH:mm').format(finance.lastFetchedDate)}'
                            : 'Drift Offline Storage Aktif • Mode Lokal Terstruktur',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF2E7D32)),
                      ),
                    ),
                    if (finance.isLoading)
                      const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF2E7D32)),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
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
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.search, color: AppColors.textMuted, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) => setState(() => _searchQuery = val),
                      decoration: const InputDecoration(
                        hintText: 'Cari transaksi, toko, atau kategori...',
                        hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 13),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  if (_searchQuery.isNotEmpty)
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _searchController.clear();
                          _searchQuery = '';
                        });
                      },
                      child: const Icon(Icons.clear, color: AppColors.textMuted, size: 18),
                    )
                  else
                    const Icon(Icons.mic_none, color: AppColors.textMuted, size: 20),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Header Filter Bulan
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () => _showMonthPicker(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(
                        color: _selectedMonth != null ? AppColors.primaryBrown : AppColors.inputBorder,
                        width: 1.2,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primaryBrown.withValues(alpha: 0.04),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.calendar_month_outlined, size: 16, color: AppColors.primaryBrown),
                        const SizedBox(width: 8),
                        Text(
                          _selectedMonthLabel,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryBrown,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.keyboard_arrow_down, size: 16, color: AppColors.primaryBrown),
                      ],
                    ),
                  ),
                ),
                if (_selectedMonth != null)
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedMonth = null;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F0EB),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.clear, size: 12, color: AppColors.textMuted),
                          SizedBox(width: 4),
                          Text(
                            'Semua Bulan',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),
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
                        children: [
                          const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.primaryBrown),
                          const SizedBox(width: 6),
                          Text(
                            _selectedMonth == null
                                ? 'Rekap Semua Transaksi'
                                : (_selectedMonth == 9 && _selectedYear == 2026
                                    ? 'Rekap 1 – 7 Sep 2026'
                                    : 'Rekap $_selectedMonthLabel'),
                            style: const TextStyle(
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
                        child: Text(
                          _selectedMonth == 9
                              ? 'Bulan Ini'
                              : (_selectedMonth == null ? 'Semua Periode' : _selectedMonthLabel),
                          style: const TextStyle(
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
                              Text(
                                '+Rp ${_formatAmount(totalIncome.toString())}',
                                style: const TextStyle(
                                  color: Color(0xFF16A34A),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text('$txMasuk transaksi masuk', style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
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
                              Text(
                                '-Rp ${_formatAmount(totalExpense.toString())}',
                                style: const TextStyle(
                                  color: Color(0xFFDC2626),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text('$txKeluar transaksi keluar', style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Global State Interactive Filter Tabs (Semua, Pemasukan, Pengeluaran)
            Row(
              children: [
                _buildFilterChip('Semua', finance.activeTypeFilter == 'Semua', () {
                  finance.setFilter('Semua');
                }),
                const SizedBox(width: 8),
                _buildFilterChip('Pemasukan', finance.activeTypeFilter == 'INCOME', () {
                  finance.setFilter('INCOME');
                }),
                const SizedBox(width: 8),
                _buildFilterChip('Pengeluaran', finance.activeTypeFilter == 'EXPENSE', () {
                  finance.setFilter('EXPENSE');
                }),
              ],
            ),
            const SizedBox(height: 16),
            if (hasRealData) ...[
              _buildDateHeader('Data Tersimpan Lokal (Drift SQLite)', '${filteredRealTx.length} Transaksi'),
              const SizedBox(height: 12),
              if (filteredRealTx.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF0E5D8)),
                  ),
                  child: Center(
                    child: Column(
                      children: [
                        const Icon(Icons.search_off_rounded, size: 36, color: AppColors.textMuted),
                        const SizedBox(height: 10),
                        Text(
                          'Tidak ada transaksi pada periode $_selectedMonthLabel',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textDark, fontSize: 13),
                          textAlign: TextAlign.center,
                        ),
                        if (finance.activeTypeFilter != 'Semua') ...[
                          const SizedBox(height: 4),
                          Text(
                            'Kategori filter: ${finance.activeTypeFilter}',
                            style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                          ),
                        ],
                      ],
                    ),
                  ),
                )
              else
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF0E5D8)),
                  ),
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredRealTx.length,
                    separatorBuilder: (context, index) =>
                        const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                    itemBuilder: (context, index) {
                      final tx = filteredRealTx[index];
                      final isExp = tx.type == 'EXPENSE';
                      final formatted = NumberFormat.currency(
                        locale: 'id_ID',
                        symbol: isExp ? '-Rp ' : '+Rp ',
                        decimalDigits: 0,
                      ).format(tx.amount);
                      return _buildTransactionItem(
                        icon: isExp ? Icons.shopping_bag_outlined : Icons.account_balance_wallet_outlined,
                        iconBg: isExp ? const Color(0xFFF5F0EB) : const Color(0xFFE8F5E9),
                        iconColor: isExp ? AppColors.primaryBrown : const Color(0xFF16A34A),
                        title: tx.title,
                        hasReceipt: false,
                        subtitle1: tx.categoryName.isNotEmpty ? tx.categoryName : 'Umum',
                        subtitle2: tx.notes?.isNotEmpty == true ? tx.notes! : 'Tersimpan Offline',
                        amount: formatted,
                        isExpense: isExp,
                        time: tx.date.isNotEmpty ? tx.date.split('T').first : 'Hari ini',
                      );
                    },
                  ),
                ),
            ] else if (isDummyMonth) ...[
              const SizedBox(height: 24),
              if (finance.activeTypeFilter != 'INCOME') ...[
                // Hari Ini Group
                _buildDateHeader('Hari Ini', '7 Sep 2026 • $netHariIniStr'),
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
                          icon: _getCategoryIcon(newTx['category']),
                          iconBg: newTx['isExpense'] ? const Color(0xFFF5F0EB) : const Color(0xFFE8F5E9),
                          iconColor: newTx['isExpense'] ? AppColors.primaryBrown : const Color(0xFF16A34A),
                          title: newTx['category'],
                          hasReceipt: false,
                          subtitle1: (newTx['note'] != null && newTx['note'].toString().isNotEmpty)
                              ? newTx['note'].toString()
                              : newTx['category'],
                          subtitle2: 'Tunai',
                          amount: '${newTx['isExpense'] ? '-' : '+'}Rp ${_formatAmount(newTx['amount'].toString())}',
                          isExpense: newTx['isExpense'],
                          time: '${DateFormat('HH:mm').format(DateTime.now())} WIB',
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
              ],
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
                    if (finance.activeTypeFilter != 'EXPENSE')
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
                    if (finance.activeTypeFilter == 'Semua')
                      const Divider(color: Color(0xFFF0E5D8), height: 1, indent: 64),
                    if (finance.activeTypeFilter != 'INCOME') ...[
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
                  ],
                ),
              ),
              if (finance.activeTypeFilter != 'INCOME') ...[
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
              ],
            ] else ...[
              const SizedBox(height: 24),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFF0E5D8)),
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: const BoxDecoration(
                        color: Color(0xFFFBECE5),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.calendar_today_outlined, size: 28, color: AppColors.primaryBrown),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      'Belum ada transaksi di bulan $_selectedMonthLabel',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Semua transaksi yang kamu catat pada periode ini akan tampil di sini.',
                      style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 18),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const AddTransactionScreen()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryBrown,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      ),
                      child: const Text(
                        '+ Catat Transaksi Baru',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 100), // spacing for bottom nav
          ],
        ),
      ),
    ),
  );
}

  Widget _buildFilterChip(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBrown : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primaryBrown : AppColors.inputBorder,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? Colors.white : AppColors.textDark,
          ),
        ),
      ),
    );
  }

  /// Format angka menjadi format ribuan Indonesia, contoh: "50000" → "50.000"
  String _formatAmount(String raw) {
    final cleaned = raw.replaceAll(RegExp(r'[^0-9]'), '');
    if (cleaned.isEmpty) return '0';
    final number = int.tryParse(cleaned) ?? 0;
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
