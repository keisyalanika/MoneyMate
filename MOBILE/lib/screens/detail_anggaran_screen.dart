import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/transaction_model.dart';
import '../services/api_service.dart';
import '../utils/budget_icons.dart';
import '../utils/currency_formatter.dart';

class DetailAnggaranScreen extends StatefulWidget {
  final Map<String, dynamic> category;
  final Function(Map<String, dynamic>) onUpdate;
  final Function(String) onDelete;

  const DetailAnggaranScreen({
    Key? key,
    required this.category,
    required this.onUpdate,
    required this.onDelete,
  }) : super(key: key);

  @override
  State<DetailAnggaranScreen> createState() => _DetailAnggaranScreenState();
}

class _DetailAnggaranScreenState extends State<DetailAnggaranScreen> {
  late Map<String, dynamic> _category;
  List<TransactionModel> _transactions = [];
  bool _isLoadingTransactions = true;

  @override
  void initState() {
    super.initState();
    _category = Map<String, dynamic>.from(widget.category);
    _loadTransactions();
  }

  Future<void> _loadTransactions() async {
    final categoryId = _category['categoryId']?.toString();
    if (categoryId == null || categoryId.isEmpty) {
      setState(() => _isLoadingTransactions = false);
      return;
    }

    final now = DateTime.now();
    final month = _toInt(_category['month']) > 0 ? _toInt(_category['month']) : now.month;
    final year = _toInt(_category['year']) > 0 ? _toInt(_category['year']) : now.year;

    final items = await ApiService.fetchCategoryTransactions(
      categoryId: categoryId,
      month: month,
      year: year,
    );

    if (!mounted) return;
    setState(() {
      _transactions = items;
      _isLoadingTransactions = false;
    });
  }

  String get _periodLabel {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    final now = DateTime.now();
    final month = _toInt(_category['month']) > 0 ? _toInt(_category['month']) : now.month;
    final year = _toInt(_category['year']) > 0 ? _toInt(_category['year']) : now.year;
    return '${months[month - 1]} $year';
  }

  String _formatTransactionDate(String raw) {
    final parsed = DateTime.tryParse(raw);
    if (parsed == null) return raw;
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    return '${parsed.day} ${months[parsed.month - 1]} ${parsed.year}';
  }

  int _toInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is num) return value.round();
    return double.tryParse(value.toString())?.round() ?? 0;
  }

  String _formatRupiah(dynamic number) {
    final int val = _toInt(number);
    final formatter = NumberFormat('#,###', 'id_ID');
    return 'Rp ${formatter.format(val)}';
  }

  void _showDeleteModal() {
    if (_category['id'] == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Kategori ini belum memiliki budget untuk dihapus.')),
      );
      return;
    }
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle pill
            Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2.5),
              ),
            ),
            const SizedBox(height: 20),

            // Circle icon trash
            Container(
              width: 60,
              height: 60,
              decoration: const BoxDecoration(
                color: Color(0xFFFFEEEE),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.delete_outline_rounded, color: Color(0xFFD32F2F), size: 28),
            ),
            const SizedBox(height: 16),

            const Text(
              'Hapus Anggaran Kategori?',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2E150D),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Anggaran untuk "${_category['title']?.toString() ?? 'Kategori'}" akan dihapus. Riwayat transaksi pengeluaran tidak akan terhapus, namun Anda tidak akan lagi menerima peringatan batas kuota.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Color(0xFF6B4E44), height: 1.4),
            ),
            const SizedBox(height: 18),

            // Preview snippet
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFFDF7F4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFF0E5DF)),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: (_category['iconBg'] as Color?) ?? const Color(0xFFFFF3ED),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Icon(
                          resolveBudgetIcon(_category),
                          color: const Color(0xFF592314),
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _category['title']?.toString() ?? 'Kategori',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: Color(0xFF2E150D),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Batas: ${_formatRupiah(_category['limit'])} / bulan',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFE5E0),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${_category['percent']}%',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFD32F2F),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: Color(0xFFF0E5DF), height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total Terpakai Saat Ini',
                        style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                      ),
                      Text(
                        _formatRupiah(_category['spent']),
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFD32F2F),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),

            Row(
              children: [
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: TextButton(
                      style: TextButton.styleFrom(
                        backgroundColor: const Color(0xFFF3EDE4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text(
                        'Batal',
                        style: TextStyle(color: Color(0xFF2E150D), fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD32F2F),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                      onPressed: () async {
                        final ok = await ApiService.deleteBudget(_category['id']?.toString() ?? '');
                        if (!ctx.mounted) return;
                        if (!ok) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            const SnackBar(content: Text('Gagal menghapus anggaran. Periksa koneksi ke server.')),
                          );
                          return;
                        }
                        widget.onDelete(_category['id']?.toString() ?? '');
                        Navigator.pop(ctx); // Close sheet
                        if (!mounted) return;
                        Navigator.pop(context); // Back to budget list
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Anggaran "${_category['title']}" berhasil dihapus'),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: const Color(0xFF2E150D),
                          ),
                        );
                      },
                      icon: const Icon(Icons.delete_outline_rounded, color: Colors.white, size: 18),
                      label: const Text(
                        'Hapus Budget',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.verified_user_rounded, color: Color(0xFF1B8A46), size: 14),
                SizedBox(width: 6),
                Text(
                  'Transaksi Anda tetap aman & tersimpan di riwayat',
                  style: TextStyle(fontSize: 11, color: Color(0xFF1B8A46), fontWeight: FontWeight.w500),
                ),
              ],
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  void _showEditModal() {
    final int currentLimit = _toInt(_category['limit']);
    final targetController = TextEditingController(
      text: currentLimit > 0 ? CurrencyFormatter.formatDots(currentLimit) : '',
    );
    double alertPercent = 85;
    int parseTarget() =>
        int.tryParse(targetController.text.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
              left: 20,
              right: 20,
              top: 12,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Edit Anggaran Kategori',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF2E150D),
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Sesuaikan target pengeluaran bulananmu',
                            style: TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                          ),
                        ],
                      ),
                      if (_category['id'] != null)
                        Container(
                          decoration: const BoxDecoration(
                            color: Color(0xFFF5F1EB),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFF8C827A), size: 20),
                            onPressed: () {
                              Navigator.pop(ctx);
                              _showDeleteModal();
                            },
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Category Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFF0EBE1)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: (_category['iconBg'] as Color?) ?? const Color(0xFFFFF3ED),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          alignment: Alignment.center,
                          child: Icon(
                            resolveBudgetIcon(_category),
                            color: const Color(0xFF592314),
                            size: 22,
                          ),
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
                                      _category['title']?.toString() ?? 'Kategori',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: Color(0xFF2E150D),
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  if (_category['isOver'] == true)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFFFE5E0),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: const Text(
                                        'Over',
                                        style: TextStyle(
                                          color: Color(0xFFD32F2F),
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Limit lama: ${_formatRupiah(_category['limit'])}',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'Terpakai',
                              style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _formatRupiah(_category['spent']),
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: _category['isOver'] == true
                                    ? const Color(0xFFD32F2F)
                                    : const Color(0xFF2E150D),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  const Text(
                    'LIMIT ANGGARAN BULANAN BARU',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.6,
                      color: Color(0xFF2E150D),
                    ),
                  ),
                  const SizedBox(height: 8),

                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE5DDD5)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Nominal Target (IDR)',
                          style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Text(
                              'Rp ',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2E150D),
                              ),
                            ),
                            Expanded(
                              child: TextField(
                                controller: targetController,
                                keyboardType: TextInputType.number,
                                inputFormatters: [ThousandsSeparatorInputFormatter()],
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2E150D),
                                ),
                                decoration: const InputDecoration(
                                  isDense: true,
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.zero,
                                  hintText: '0',
                                  hintStyle: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFD8CFC7),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Peringatan Batas Pemakaian
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFF0EBE1)),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Peringatan Batas Pemakaian',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2E150D),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFF4D6),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                '${alertPercent.toInt()}% Limit',
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF8A6000),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SliderTheme(
                          data: SliderTheme.of(ctx).copyWith(
                            activeTrackColor: const Color(0xFF4A2518),
                            inactiveTrackColor: const Color(0xFFEBE5DF),
                            thumbColor: const Color(0xFF4A2518),
                            trackHeight: 4,
                          ),
                          child: Slider(
                            value: alertPercent,
                            min: 50,
                            max: 100,
                            divisions: 10,
                            onChanged: (val) {
                              setSheetState(() => alertPercent = val);
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4A2518),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      onPressed: () async {
                        final int newLimit = parseTarget();
                        if (newLimit <= 0) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Nominal anggaran harus lebih besar dari 0')),
                          );
                          return;
                        }

                        final String? budgetId = _category['id']?.toString();
                        final bool isNewBudget =
                            budgetId == null || budgetId.isEmpty || budgetId == 'null';
                        final bool ok;
                        if (isNewBudget) {
                          ok = await ApiService.addBudget({
                            'category_id': int.tryParse(_category['categoryId']?.toString() ?? '') ?? 0,
                            'amount': newLimit,
                            'month': _toInt(_category['month']),
                            'year': _toInt(_category['year']),
                          });
                        } else {
                          ok = await ApiService.updateBudget(
                            budgetId,
                            amount: newLimit,
                          );
                        }
                        if (!ctx.mounted) return;
                        if (!ok) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            const SnackBar(content: Text('Gagal menyimpan anggaran. Periksa koneksi ke server.')),
                          );
                          return;
                        }
                        if (!mounted) return;

                        setState(() {
                          _category['limit'] = newLimit;
                          final double pct = (_toInt(_category['spent']) / newLimit) * 100;
                          _category['percent'] = pct.toInt();
                          if (pct > 100) {
                            _category['isOver'] = true;
                            final overDiff = _toInt(_category['spent']) - newLimit;
                            _category['tag'] = 'Over ${(pct - 100).toInt()}% (+${_formatRupiah(overDiff)})';
                            _category['statusText'] = 'Melebihi kuota ${_formatRupiah(overDiff)}';
                            _category['statusColor'] = const Color(0xFFD32F2F);
                            _category['borderColor'] = const Color(0xFFFFCDC3);
                          } else {
                            _category['isOver'] = false;
                            final rem = newLimit - _toInt(_category['spent']);
                            _category['tag'] = 'Tersisa ${_formatRupiah(rem)}';
                            _category['statusText'] = 'Sisa ${(100 - pct).toInt()}% sebelum batas habis';
                            _category['statusColor'] = const Color(0xFFB78103);
                            _category['borderColor'] = const Color(0xFFFFE9B6);
                          }
                        });

                        widget.onUpdate(_category);
                        Navigator.pop(ctx);

                        // Show Success Modal
                        _showSuccessSheet(
                          _category['title']?.toString() ?? 'Kategori',
                          newLimit,
                          alertPercent: alertPercent,
                        );
                      },
                      icon: const Icon(Icons.check_rounded, color: Colors.white, size: 18),
                      label: const Text(
                        'Simpan Perubahan',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: TextButton(
                      style: TextButton.styleFrom(
                        backgroundColor: const Color(0xFFF3EDE4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Batal', style: TextStyle(color: Color(0xFF2E150D), fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String _currentPeriodLabel() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    final now = DateTime.now();
    final lastDay = DateTime(now.year, now.month + 1, 0).day;
    final month = months[now.month - 1];
    return '1 $month – $lastDay $month ${now.year}';
  }

  void _showSuccessSheet(
    String categoryName,
    int newLimit, {
    double alertPercent = 80,
  }) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: const Color(0xFF2E150D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(color: Color(0xFF27AE60), shape: BoxShape.circle),
              child: const Icon(Icons.check, size: 12, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text.rich(
                TextSpan(
                  style: const TextStyle(fontSize: 12, color: Colors.white),
                  children: [
                    const TextSpan(text: 'Budget '),
                    TextSpan(
                      text: categoryName,
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFD54F)),
                    ),
                    const TextSpan(text: ' berhasil diperbarui'),
                  ],
                ),
              ),
            ),
            const Text('Lihat', style: TextStyle(fontSize: 12, color: Color(0xFFFFD54F), fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2.5)),
            ),
            const SizedBox(height: 24),
            Stack(
              alignment: Alignment.center,
              children: [
                Container(width: 76, height: 76, decoration: const BoxDecoration(color: Color(0xFFFBECE4), shape: BoxShape.circle)),
                Container(
                  width: 52,
                  height: 52,
                  decoration: const BoxDecoration(color: Color(0xFF4A2518), shape: BoxShape.circle),
                  child: const Icon(Icons.check_rounded, color: Colors.white, size: 30),
                ),
                const Positioned(top: 2, right: 4, child: Text('✦', style: TextStyle(color: Color(0xFF8C381E), fontSize: 16))),
                const Positioned(bottom: 2, left: 4, child: Text('✦', style: TextStyle(color: Color(0xFF8C381E), fontSize: 14))),
              ],
            ),
            const SizedBox(height: 18),
            const Text('Anggaran Berhasil Diperbarui!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF2E150D))),
            const SizedBox(height: 8),
            Text(
              'Limit anggaran baru untuk kategori $categoryName telah aktif. MoneyMate akan memantau pengeluaranmu secara otomatis.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Color(0xFF6B4E44), height: 1.4),
            ),
            const SizedBox(height: 22),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFDF7F4),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFF0E5DF)),
              ),
              child: Column(
                children: [
                  _receiptRow('Kategori', categoryName),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  _receiptRow('Limit Baru', '${_formatRupiah(newLimit)} /bln'),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Peringatan', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFFF5EBE6), borderRadius: BorderRadius.circular(8)),
                        child: Text('Saat mencapai ${alertPercent.toInt()}%', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF2E150D))),
                      ),
                    ],
                  ),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  _receiptRow('Periode', _currentPeriodLabel()),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Status', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFFE8F8F0), borderRadius: BorderRadius.circular(12)),
                        child: const Row(
                          children: [
                            Icon(Icons.circle, color: Color(0xFF1B8A46), size: 8),
                            SizedBox(width: 6),
                            Text('Aktif & Terpantau', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1B8A46))),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4A2518),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                onPressed: () => Navigator.pop(ctx),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Kembali ke Daftar Budget', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.sync_rounded, color: Color(0xFF00897B), size: 14),
                SizedBox(width: 6),
                Text('Sinkronisasi instan ke dashboard utama', style: TextStyle(fontSize: 11, color: Color(0xFF00897B), fontWeight: FontWeight.w500)),
              ],
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  Widget _receiptRow(String title, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2E150D))),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isOver = _category['isOver'] == true;
    final int spent = _toInt(_category['spent']);
    final int limit = _toInt(_category['limit']);
    final int percent = _toInt(_category['percent']);
    final double progressRatio = (limit > 0 ? (spent / limit) : 0.0).clamp(0.0, 1.0);
    final int overDiff = spent > limit ? (spent - limit) : (limit - spent);

    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: IconButton(
                      padding: EdgeInsets.zero,
                      icon: const Icon(Icons.chevron_left_rounded, size: 24, color: Color(0xFF2E150D)),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Text(
                      'Detail Anggaran',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2E150D),
                      ),
                    ),
                  ),
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: PopupMenuButton<String>(
                      padding: EdgeInsets.zero,
                      icon: const Icon(Icons.more_vert_rounded, size: 20, color: Color(0xFF2E150D)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      onSelected: (val) {
                        if (val == 'edit') {
                          _showEditModal();
                        } else if (val == 'delete') {
                          _showDeleteModal();
                        }
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'edit',
                          child: Row(
                            children: [
                              Icon(Icons.edit_outlined, size: 18, color: Color(0xFF4A2518)),
                              SizedBox(width: 10),
                              Text('Sesuaikan Anggaran', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: 'delete',
                          child: Row(
                            children: [
                              Icon(Icons.delete_outline_rounded, size: 18, color: Color(0xFFD32F2F)),
                              SizedBox(width: 10),
                              Text('Hapus Anggaran', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFFD32F2F))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Card Besar Kategori Bulanan (Sesuai Figma Gambar 1)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: const Color(0xFF381E15),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF381E15).withValues(alpha: 0.2),
                            blurRadius: 18,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'KATEGORI BULANAN',
                                style: TextStyle(
                                  color: Colors.white.withValues(alpha: 0.7),
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.8,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isOver ? const Color(0xFF5A271B) : const Color(0xFF1B8A46).withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  limit <= 0 ? 'BELUM DIANGGARKAN' : (isOver ? 'OVERBUDGET' : 'AMAN'),
                                  style: TextStyle(
                                    color: isOver ? const Color(0xFFFF9E91) : const Color(0xFF81C784),
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // Nominal Terpakai
                          Text(
                            _formatRupiah(spent),
                            style: const TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            limit > 0
                                ? 'Dibatasi hingga ${_formatRupiah(limit)}/bln'
                                : 'Belum ada budget bulan ini',
                            style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 12),
                          ),
                          const SizedBox(height: 18),

                          // Progress bar
                          Stack(
                            children: [
                              Container(
                                height: 8,
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                              FractionallySizedBox(
                                widthFactor: progressRatio,
                                child: Container(
                                  height: 8,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: isOver
                                          ? [const Color(0xFFFFA726), const Color(0xFFE53935), const Color(0xFF8B1E12)]
                                          : [const Color(0xFF81C784), const Color(0xFF2E7D32)],
                                    ),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),

                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                limit > 0 ? 'Terpakai $percent%' : 'Pengeluaran tercatat',
                                style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 11, fontWeight: FontWeight.w600),
                              ),
                              Text(
                                isOver ? '+${_formatRupiah(overDiff)}' : 'Sisa ${_formatRupiah(overDiff)}',
                                style: TextStyle(
                                  color: isOver ? const Color(0xFFFF9E91) : const Color(0xFF81C784),
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Riwayat Transaksi Kategori
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'TRANSAKSI TERKAIT',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.6,
                            color: Color(0xFF2E150D),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F1EB),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            _periodLabel,
                            style: TextStyle(fontSize: 11, color: Colors.grey.shade700, fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    if (_isLoadingTransactions)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 24),
                        child: Center(child: CircularProgressIndicator(color: Color(0xFF4A2518))),
                      )
                    else if (_transactions.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFF0EBE1)),
                        ),
                        child: Column(
                          children: [
                            const Icon(Icons.receipt_long_outlined, size: 30, color: Color(0xFFB9A99E)),
                            const SizedBox(height: 8),
                            Text(
                              'Belum ada transaksi $_periodLabel untuk kategori ini.',
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                            ),
                          ],
                        ),
                      )
                    else
                      for (final tx in _transactions) ...[
                        _buildTransactionItem(
                          tx.title,
                          _formatTransactionDate(tx.date),
                          '- ${_formatRupiah(tx.amount)}',
                        ),
                        const SizedBox(height: 8),
                      ],
                    const SizedBox(height: 24),

                    // Action Buttons (Sesuaikan & Hapus)
                    Row(
                      children: [
                        Expanded(
                          child: SizedBox(
                            height: 50,
                            child: OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: Color(0xFFD32F2F), width: 1.5),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                              onPressed: _showDeleteModal,
                              icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFD32F2F), size: 18),
                              label: const Text(
                                'Hapus Budget',
                                style: TextStyle(color: Color(0xFFD32F2F), fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: SizedBox(
                            height: 50,
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF4A2518),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                elevation: 0,
                              ),
                              onPressed: _showEditModal,
                              icon: const Icon(Icons.tune_rounded, color: Colors.white, size: 18),
                              label: const Text(
                                'Sesuaikan',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionItem(String title, String time, String amount) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF0EBE1)),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: const Color(0xFFFFF0ED),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.restaurant_rounded, color: Color(0xFFD32F2F), size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF2E150D))),
                const SizedBox(height: 2),
                Text(time, style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
              ],
            ),
          ),
          Text(amount, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFD32F2F))),
        ],
      ),
    );
  }
}
