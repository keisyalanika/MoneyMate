import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import '../models/budget_model.dart';
import '../models/category_model.dart';
import '../services/api_service.dart';
import '../utils/budget_icons.dart';
import '../utils/currency_formatter.dart';
import 'kelola_kategori_screen.dart';
import 'detail_anggaran_screen.dart';

class BudgetScreen extends StatefulWidget {
  const BudgetScreen({super.key});

  @override
  State<BudgetScreen> createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  DateTime _currentDate = DateTime(DateTime.now().year, DateTime.now().month, 1);

  List<Map<String, dynamic>> _categories = [];
  List<CategoryModel> _expenseCategories = [];
  bool _isLoading = true;
  double _monthIncome = 0;

  static const List<Color> _iconBackgrounds = [
    Color(0xFFFFF3ED),
    Color(0xFFFFF0F3),
    Color(0xFFFFF9E6),
    Color(0xFFEBF9F0),
    Color(0xFFF3E8FF),
    Color(0xFFEAF4FF),
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    final budgets = await ApiService.fetchBudgets(
      month: _currentDate.month,
      year: _currentDate.year,
    );
    if (!mounted) return;
    if (budgets == null) {
      setState(() {
        _categories = [];
        _expenseCategories = [];
        _monthIncome = 0;
        _isLoading = false;
      });
      return;
    }

    final categories = await ApiService.fetchCategories();
    final start = DateTime(_currentDate.year, _currentDate.month, 1);
    final end = DateTime(_currentDate.year, _currentDate.month + 1, 0);
    final transactions = await ApiService.fetchTransactions(
      startDate: start,
      endDate: end,
      limit: 1000,
    );

    if (!mounted) return;

    final budgetItems = budgets.map(_mapBudget).toList();

    double income = 0;
    for (final tx in transactions) {
      if (tx.type.toUpperCase() == 'INCOME') {
        income += tx.amount;
      }
    }

    setState(() {
      _expenseCategories = categories
          .where((c) => c.type.toUpperCase() == 'EXPENSE')
          .where((c) {
            final name = c.name.trim().toLowerCase();
            return name != 'tambah saldo' && name != 'kurangi saldo';
          })
          .toList();
      _categories = budgetItems;
      _monthIncome = income;
      _isLoading = false;
    });
  }

  void _changeMonth(int delta) {
    setState(() {
      _currentDate = DateTime(_currentDate.year, _currentDate.month + delta, 1);
    });
    _loadData();
  }

  Map<String, dynamic> _mapBudget(BudgetModel budget) {
    final limit = budget.limitAmount.round();
    final spent = budget.spentAmount.round();
    final pct = limit > 0 ? (spent / limit) * 100 : 0.0;
    final isOver = pct > 100;
    final remaining = limit - spent;
    final over = spent - limit;
    final colorIndex = (budget.categoryId.hashCode.abs()) % _iconBackgrounds.length;

    final tagBg = isOver
        ? const Color(0xFFFFE5E0)
        : pct >= 80
            ? const Color(0xFFFFF4D6)
            : const Color(0xFFE2F8E9);
    final tagColor = isOver
        ? const Color(0xFFD32F2F)
        : pct >= 80
            ? const Color(0xFFB78103)
            : const Color(0xFF1B8A46);

    return {
      'id': budget.id,
      'categoryId': budget.categoryId,
      'title': budget.categoryName,
      'icon': budget.categoryIcon,
      'month': _currentDate.month,
      'year': _currentDate.year,
      'iconBg': _iconBackgrounds[colorIndex],
      'limit': limit,
      'spent': spent,
      'percent': pct.round(),
      'tag': isOver
          ? 'Over ${(pct - 100).round()}% (+${_formatRupiah(over)})'
          : pct >= 80
              ? 'Tersisa ${_formatRupiah(remaining)}'
              : 'Aman (${pct.round()}%)',
      'tagBg': tagBg,
      'tagColor': tagColor,
      'statusText': isOver
          ? 'Melebihi kuota ${_formatRupiah(over)}'
          : pct >= 80
              ? 'Sisa ${(100 - pct).round()}% sebelum batas habis'
              : 'Sesuai target pengeluaran',
      'statusColor': isOver
          ? const Color(0xFFD32F2F)
          : pct >= 80
              ? const Color(0xFFB78103)
              : const Color(0xFF8C827A),
      'statusIcon': isOver
          ? Icons.access_time_rounded
          : pct >= 80
              ? Icons.warning_amber_rounded
              : null,
      'isOver': isOver,
      'actionLabel': 'Sesuaikan',
      'borderColor': isOver
          ? const Color(0xFFFFCDC3)
          : pct >= 80
              ? const Color(0xFFFFE9B6)
              : const Color(0xFFD4F2DE),
    };
  }

  int _toInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is num) return value.round();
    return double.tryParse(value.toString())?.round() ?? 0;
  }

  int get totalSpent => _categories.fold(0, (sum, item) => sum + _toInt(item['spent']));
  int get totalLimit => _categories.fold(0, (sum, item) => sum + _toInt(item['limit']));

  String _formatRupiah(dynamic number) {
    final int val = _toInt(number);
    final formatter = NumberFormat('#,###', 'id_ID');
    return 'Rp ${formatter.format(val)}';
  }

  void _showEditBudgetSheet(Map<String, dynamic> category) {
    final int currentLimit = _toInt(category['limit']);
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
                  // Handle pill
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

                  // Header Edit
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
                      if (category['id'] != null)
                        Container(
                          decoration: const BoxDecoration(
                            color: Color(0xFFF5F1EB),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFF8C827A), size: 20),
                            onPressed: () {
                              Navigator.pop(ctx);
                              _showDeleteBudgetSheet(category);
                            },
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Category Summary Card
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
                            color: (category['iconBg'] as Color?) ?? const Color(0xFFFFF3ED),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          alignment: Alignment.center,
                          child: Icon(
                            resolveBudgetIcon(category),
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
                                      category['title']?.toString() ?? 'Kategori',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: Color(0xFF2E150D),
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  if (category['isOver'] == true)
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
                                'Limit lama: ${_formatRupiah(category['limit'])}',
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
                              _formatRupiah(category['spent']),
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: category['isOver'] == true
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

                  // LIMIT ANGGARAN BULANAN BARU
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
                            overlayColor: const Color(0xFF4A2518).withValues(alpha: 0.12),
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
                        Row(
                          children: [
                            const Text(
                              'Ingatkan saat:',
                              style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                            ),
                            const Spacer(),
                            _buildPercentChip('80%', alertPercent == 80, () {
                              setSheetState(() => alertPercent = 80);
                            }),
                            const SizedBox(width: 8),
                            _buildPercentChip('85%', alertPercent == 85, () {
                              setSheetState(() => alertPercent = 85);
                            }),
                            const SizedBox(width: 8),
                            _buildPercentChip('95%', alertPercent == 95, () {
                              setSheetState(() => alertPercent = 95);
                            }),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  const SizedBox(height: 24),

                  // Tombol Aksi
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

                        final String? budgetId = category['id']?.toString();
                        final bool isNewBudget =
                            budgetId == null || budgetId.isEmpty || budgetId == 'null';

                        final bool ok;
                        if (isNewBudget) {
                          ok = await ApiService.addBudget({
                            'category_id': int.tryParse(category['categoryId']?.toString() ?? '') ?? 0,
                            'amount': newLimit,
                            'month': _currentDate.month,
                            'year': _currentDate.year,
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

                        setState(() {
                          category['limit'] = newLimit;
                          final double pct = (_toInt(category['spent']) / newLimit) * 100;
                          category['percent'] = pct.toInt();
                          if (pct > 100) {
                            category['isOver'] = true;
                            final overDiff = _toInt(category['spent']) - newLimit;
                            category['tag'] = 'Over ${(pct - 100).toInt()}% (+${_formatRupiah(overDiff)})';
                            category['statusText'] = 'Melebihi kuota ${_formatRupiah(overDiff)}';
                            category['statusColor'] = const Color(0xFFD32F2F);
                            category['borderColor'] = const Color(0xFFFFCDC3);
                          } else {
                            category['isOver'] = false;
                            final rem = newLimit - _toInt(category['spent']);
                            category['tag'] = 'Tersisa ${_formatRupiah(rem)}';
                            category['statusText'] = 'Sisa ${(100 - pct).toInt()}% sebelum batas habis';
                            category['statusColor'] = const Color(0xFFB78103);
                            category['borderColor'] = const Color(0xFFFFE9B6);
                          }
                        });

                        Navigator.pop(ctx);
                        _loadData();
                        _showSuccessModal(
                          category['title']?.toString() ?? 'Kategori',
                          newLimit,
                          alertPercent: alertPercent,
                          isEdit: !isNewBudget,
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
                      child: const Text(
                        'Batal',
                        style: TextStyle(
                          color: Color(0xFF2E150D),
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
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

  void _showAddBudgetSheet() {
    final limitController = TextEditingController(text: '500.000');
    int targetAmount = 500000;
    double alertPercent = 80;
    final expenseCategories = _expenseCategories;
    String? selectedCategoryId =
        expenseCategories.isEmpty ? null : expenseCategories.first.id;

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
                  // Handle pill
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

                  // Header Buat Anggaran Baru
                  const Text(
                    'Buat Anggaran Baru',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2E150D),
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Tentukan batas pengeluaran kategori bulanan Anda.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                  ),
                  const SizedBox(height: 18),

                  // Pilih Kategori Pengeluaran
                  const Text(
                    'KATEGORI PENGELUARAN',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.6,
                      color: Color(0xFF2E150D),
                    ),
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    initialValue: selectedCategoryId,
                    isExpanded: true,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFF4A2518)),
                      ),
                    ),
                    hint: const Text('Pilih kategori', style: TextStyle(fontSize: 13)),
                    items: expenseCategories.map((cat) {
                      final catMap = {'icon': cat.icon, 'title': cat.name};
                      return DropdownMenuItem<String>(
                        value: cat.id,
                        child: Row(
                          children: [
                            Icon(resolveBudgetIcon(catMap), size: 18, color: const Color(0xFF592314)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                cat.name,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 13, color: Color(0xFF2E150D)),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (value) => setSheetState(() => selectedCategoryId = value),
                  ),
                  if (expenseCategories.isEmpty) ...[
                    const SizedBox(height: 6),
                    const Text(
                      'Belum ada kategori pengeluaran. Tambahkan kategori terlebih dahulu di menu Kelola Kategori.',
                      style: TextStyle(fontSize: 11, color: Color(0xFFD32F2F)),
                    ),
                  ],
                  const SizedBox(height: 14),

                  // Input Batas Anggaran (Rp)
                  TextField(
                    controller: limitController,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      ThousandsSeparatorInputFormatter(),
                    ],
                    onChanged: (val) {
                      final parsed = int.tryParse(val.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;
                      setSheetState(() => targetAmount = parsed);
                    },
                    decoration: InputDecoration(
                      labelText: 'Batas Anggaran (Rp)',
                      labelStyle: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                      hintText: 'Contoh: 1.500.000',
                      hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFF4A2518)),
                      ),
                    ),
                    style: const TextStyle(fontSize: 14, color: Color(0xFF2E150D), fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),

                  // Quick chips
                  Row(
                    children: [
                      _buildQuickAddChip('+100 rb', () {
                        setSheetState(() {
                          targetAmount += 100000;
                          limitController.text = NumberFormat('#,###', 'id_ID').format(targetAmount);
                        });
                      }, false),
                      const SizedBox(width: 8),
                      _buildQuickAddChip('+250 rb', () {
                        setSheetState(() {
                          targetAmount += 250000;
                          limitController.text = NumberFormat('#,###', 'id_ID').format(targetAmount);
                        });
                      }, false),
                      const SizedBox(width: 8),
                      _buildQuickAddChip('+500 rb', () {
                        setSheetState(() {
                          targetAmount += 500000;
                          limitController.text = NumberFormat('#,###', 'id_ID').format(targetAmount);
                        });
                      }, false),
                      const SizedBox(width: 8),
                      _buildQuickAddChip('+1 jt', () {
                        setSheetState(() {
                          targetAmount += 1000000;
                          limitController.text = NumberFormat('#,###', 'id_ID').format(targetAmount);
                        });
                      }, false),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Peringatan Batas Pemakaian
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF7F2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFF0EBE1)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Peringatan Batas Pemakaian',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2E150D),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
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
                  const SizedBox(height: 20),

                  // Tombol Buat Anggaran
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4A2518),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      onPressed: () async {
                        final int finalLimit = targetAmount > 0
                            ? targetAmount
                            : (int.tryParse(limitController.text.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0);

                        if (selectedCategoryId == null) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            const SnackBar(content: Text('Pilih kategori pengeluaran terlebih dahulu')),
                          );
                          return;
                        }

                        if (finalLimit <= 0) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            const SnackBar(content: Text('Batas anggaran harus lebih besar dari 0')),
                          );
                          return;
                        }

                        final selectedCategory = expenseCategories
                            .cast<CategoryModel?>()
                            .firstWhere(
                              (c) => c?.id == selectedCategoryId,
                              orElse: () => null,
                            );

                        final ok = await ApiService.addBudget({
                          'category_id': int.tryParse(selectedCategoryId!) ?? 0,
                          'amount': finalLimit,
                          'month': _currentDate.month,
                          'year': _currentDate.year,
                        });
                        if (!ctx.mounted) return;
                        if (!ok) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            const SnackBar(content: Text('Gagal menyimpan anggaran. Periksa koneksi ke server.')),
                          );
                          return;
                        }

                        Navigator.pop(ctx);
                        await _loadData();
                        if (!mounted) return;
                        _showSuccessModal(
                          selectedCategory?.name ?? 'Kategori',
                          finalLimit,
                          alertPercent: alertPercent,
                        );
                      },
                      child: const Text(
                        'Buat Anggaran',
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
                      child: const Text(
                        'Batal',
                        style: TextStyle(
                          color: Color(0xFF2E150D),
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
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

  Widget _buildQuickAddChip(String label, VoidCallback onTap, bool isHighlight) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isHighlight ? const Color(0xFFF9EFE7) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isHighlight ? const Color(0xFFD9B9A6) : const Color(0xFFE5DDD5),
            ),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2E150D),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPercentChip(String label, bool isSelected, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF4A2518) : const Color(0xFFF5F1EB),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF8C827A),
          ),
        ),
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

  void _showSuccessModal(
    String categoryName,
    int newLimit, {
    double alertPercent = 80,
    bool isEdit = false,
  }) {
    // Tampilkan snackbar floating di atas
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
              decoration: const BoxDecoration(
                color: Color(0xFF27AE60),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check, size: 12, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: RichText(
                text: TextSpan(
                  style: const TextStyle(fontSize: 12, color: Colors.white),
                  children: [
                    const TextSpan(text: 'Budget '),
                    TextSpan(
                      text: categoryName,
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFD54F)),
                    ),
                    TextSpan(text: isEdit ? ' berhasil diperbarui' : ' berhasil dibuat'),
                  ],
                ),
              ),
            ),
            const Text(
              'Lihat',
              style: TextStyle(fontSize: 12, color: Color(0xFFFFD54F), fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );

    // Tampilkan Bottom Sheet Sukses (Image 3)
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
            const SizedBox(height: 24),

            // Badge Sukses dengan sparkles
            Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 76,
                  height: 76,
                  decoration: const BoxDecoration(
                    color: Color(0xFFFBECE4),
                    shape: BoxShape.circle,
                  ),
                ),
                Container(
                  width: 52,
                  height: 52,
                  decoration: const BoxDecoration(
                    color: Color(0xFF4A2518),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check_rounded, color: Colors.white, size: 30),
                ),
                const Positioned(
                  top: 2,
                  right: 4,
                  child: Text('✦', style: TextStyle(color: Color(0xFF8C381E), fontSize: 16)),
                ),
                const Positioned(
                  bottom: 2,
                  left: 4,
                  child: Text('✦', style: TextStyle(color: Color(0xFF8C381E), fontSize: 14)),
                ),
              ],
            ),
            const SizedBox(height: 18),

            Text(
              isEdit ? 'Anggaran Berhasil Diperbarui!' : 'Anggaran Berhasil Dibuat!',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2E150D),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Limit anggaran baru untuk kategori $categoryName telah aktif. MoneyMate akan memantau pengeluaranmu secara otomatis.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Color(0xFF6B4E44), height: 1.4),
            ),
            const SizedBox(height: 22),

            // Receipt Container
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFDF7F4),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFF0E5DF)),
              ),
              child: Column(
                children: [
                  _buildReceiptRow('Kategori', categoryName),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  _buildReceiptRow('Limit Baru', '${_formatRupiah(newLimit)} /bln'),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Peringatan', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5EBE6),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Saat mencapai ${alertPercent.toInt()}%',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF2E150D)),
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  _buildReceiptRow('Periode', _currentPeriodLabel()),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Status', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE8F8F0),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.circle, color: Color(0xFF1B8A46), size: 8),
                            SizedBox(width: 6),
                            Text(
                              'Aktif & Terpantau',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1B8A46)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Buttons
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
                    Text(
                      'Kembali ke Daftar Budget',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: TextButton.icon(
                style: TextButton.styleFrom(
                  backgroundColor: const Color(0xFFFAF3EC),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  Navigator.pop(ctx);
                  _showAddBudgetSheet();
                },
                icon: const Icon(Icons.add, color: Color(0xFF4A2518), size: 18),
                label: const Text(
                  'Buat Budget Kategori Lain',
                  style: TextStyle(color: Color(0xFF4A2518), fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Sinkronisasi footer
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.sync_rounded, color: Color(0xFF00897B), size: 14),
                SizedBox(width: 6),
                Text(
                  'Sinkronisasi instan ke dashboard utama',
                  style: TextStyle(fontSize: 11, color: Color(0xFF00897B), fontWeight: FontWeight.w500),
                ),
              ],
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  Widget _buildReceiptRow(String title, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
        Text(
          value,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2E150D)),
        ),
      ],
    );
  }

  void _showDeleteBudgetSheet(Map<String, dynamic> category) {
    if (category['id'] == null) return;
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
              'Anggaran untuk "${category['title']}" akan dihapus. Riwayat transaksi pengeluaran tidak akan terhapus, namun Anda tidak akan lagi menerima peringatan batas kuota.',
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
                          color: (category['iconBg'] as Color?) ?? const Color(0xFFFFF3ED),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Icon(resolveBudgetIcon(category), color: const Color(0xFF592314), size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              category['title']?.toString() ?? 'Kategori',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: Color(0xFF2E150D),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Batas: ${_formatRupiah(category['limit'])} / bulan',
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
                          '${category['percent']}%',
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
                        _formatRupiah(category['spent']),
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
                        final ok = await ApiService.deleteBudget(category['id'].toString());
                        if (!ctx.mounted) return;
                        if (!ok) {
                          ScaffoldMessenger.of(ctx).showSnackBar(
                            const SnackBar(content: Text('Gagal menghapus anggaran. Periksa koneksi ke server.')),
                          );
                          return;
                        }
                        if (!context.mounted) return;
                        if (!mounted) return;
                        Navigator.pop(ctx);
                        _loadData();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Anggaran "${category['title']}" berhasil dihapus')),
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

  @override
  Widget build(BuildContext context) {
    final overCats = _categories.where((c) => c['isOver'] == true).toList();
    final overCount = overCats.length;
    final overNames = overCats
        .map((c) => c['title']?.toString() ?? '')
        .where((name) => name.isNotEmpty)
        .join(', ');
    final overallPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0.0;
    final isTotalOver = totalLimit > 0 && totalSpent > totalLimit;
    final double totalRatio = (totalLimit > 0 ? totalSpent / totalLimit : 0.0).clamp(0.0, 1.0);
    final hasBudgets = _categories.isNotEmpty;
    final isCritical = overCount > 0;

    final bannerBg = isCritical
        ? const Color(0xFFFFF0ED)
        : hasBudgets
            ? const Color(0xFFEFFAF3)
            : const Color(0xFFF7F2ED);
    final bannerBorder = isCritical
        ? const Color(0xFFFFDDD5)
        : hasBudgets
            ? const Color(0xFFD4F2DE)
            : const Color(0xFFE5DDD5);
    final bannerIconBg = isCritical
        ? const Color(0xFFFFE0D8)
        : hasBudgets
            ? const Color(0xFFE2F8E9)
            : const Color(0xFFEFE8E1);
    final bannerAccent = isCritical
        ? const Color(0xFFD32F2F)
        : hasBudgets
            ? const Color(0xFF1B8A46)
            : const Color(0xFF8A3A23);

    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top App Bar
                    Row(
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
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Anggaran & Budget',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2E150D),
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Kelola pengeluaran bulanan',
                                style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),

                    // Banner: PERINGATAN KUOTA / ANGGARAN AMAN
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: bannerBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: bannerBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 38,
                                height: 38,
                                decoration: BoxDecoration(
                                  color: bannerIconBg,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Icon(
                                  isCritical
                                      ? Icons.warning_amber_rounded
                                      : hasBudgets
                                          ? Icons.verified_rounded
                                          : Icons.inbox_outlined,
                                  color: bannerAccent,
                                  size: 22,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            isCritical
                                                ? 'PERINGATAN KUOTA'
                                                : hasBudgets
                                                    ? 'ANGGARAN AMAN'
                                                    : 'BELUM ADA ANGGARAN',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              letterSpacing: 0.6,
                                              color: bannerAccent,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: bannerAccent,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            isCritical
                                                ? 'Kritis'
                                                : hasBudgets
                                                    ? 'Aman'
                                                    : 'Info',
                                            style: const TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.white,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      isCritical
                                          ? '$overCount Kategori Melebihi Anggaran!'
                                          : hasBudgets
                                              ? 'Semua kategori dalam batas'
                                              : 'Belum ada anggaran bulan ini',
                                      style: const TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF2E150D),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            isCritical
                                ? 'Kategori $overNames melampaui limit. Pertimbangkan penyesuaian atau kurangi pengeluaran non-esensial.'
                                : hasBudgets
                                    ? 'Belum ada kategori yang melewati limit pada bulan ini. Pertahankan pola pengeluaranmu.'
                                    : 'Tambahkan anggaran kategori agar pengeluaran bisa dipantau per bulan.',
                            style: const TextStyle(fontSize: 11, color: Color(0xFF6B4E44), height: 1.4),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Card: TOTAL TERPAKAI BULAN INI
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF381E15),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF381E15).withValues(alpha: 0.18),
                            blurRadius: 16,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  'TOTAL TERPAKAI ${DateFormat('MMM yyyy', 'id_ID').format(_currentDate).toUpperCase()}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    color: Colors.white70,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF5A271B),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.circle,
                                      size: 6,
                                      color: isTotalOver ? const Color(0xFFFF7A68) : const Color(0xFF81C784),
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      totalLimit <= 0
                                          ? 'Belum ada budget'
                                          : isTotalOver
                                              ? '${overallPct.round()}% Overbudget'
                                              : '${overallPct.round()}% Terpakai',
                                      style: TextStyle(
                                        color: totalLimit <= 0
                                            ? Colors.white70
                                            : isTotalOver
                                                ? const Color(0xFFFF9E91)
                                                : const Color(0xFF81C784),
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),

                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.baseline,
                                    textBaseline: TextBaseline.alphabetic,
                                    children: [
                                      const Text(
                                        'Rp ',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white70,
                                        ),
                                      ),
                                      Text(
                                        NumberFormat('#,###', 'id_ID').format(totalSpent),
                                        style: const TextStyle(
                                          fontSize: 28,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Batas Anggaran: ${_formatRupiah(totalLimit)}',
                                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Pemasukan bulan ini: ${_formatRupiah(_monthIncome)}',
                                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: const Color(0x33000000),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  children: [
                                    Text(
                                      totalLimit <= 0
                                          ? '—'
                                          : isTotalOver
                                              ? '- ${_formatRupiah(totalSpent - totalLimit)}'
                                              : _formatRupiah(totalLimit - totalSpent),
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: totalLimit <= 0
                                            ? Colors.white70
                                            : isTotalOver
                                                ? const Color(0xFFFF7A68)
                                                : const Color(0xFF81C784),
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      totalLimit <= 0 ? 'Budget' : (isTotalOver ? 'Defisit' : 'Sisa'),
                                      style: const TextStyle(fontSize: 10, color: Colors.white70),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 18),

                          // Progress Bar dengan Jebol marker
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
                                widthFactor: totalRatio,
                                child: Container(
                                  height: 8,
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFFFFA726),
                                        Color(0xFFE53935),
                                        Color(0xFF8B1E12),
                                      ],
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
                              const Flexible(
                                child: Text(
                                  '0%',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: Colors.white60, fontSize: 10),
                                ),
                              ),
                              const Flexible(
                                child: Text(
                                  '50%',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: Colors.white60, fontSize: 10),
                                ),
                              ),
                              const Flexible(
                                child: Text(
                                  '100% Limit',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: Colors.white70, fontSize: 10),
                                ),
                              ),
                              Flexible(
                                child: Text(
                                  isTotalOver ? '${overallPct.round()}% (Jebol)' : '${overallPct.round()}%',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  textAlign: TextAlign.end,
                                  style: TextStyle(
                                    color: isTotalOver ? const Color(0xFFFF9E91) : const Color(0xFF81C784),
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Date Selector
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFF0EBE1)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.chevron_left_rounded, size: 20, color: Color(0xFF2E150D)),
                            onPressed: () => _changeMonth(-1),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.calendar_month_outlined, color: Color(0xFFD95B27), size: 18),
                              const SizedBox(width: 8),
                              Text(
                                DateFormat('MMMM yyyy', 'id_ID').format(_currentDate),
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: Color(0xFF2E150D),
                                ),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.chevron_right_rounded, size: 20, color: Color(0xFF2E150D)),
                            onPressed: () => _changeMonth(1),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Pill Button: Semua (5)
                    Container(
                      width: double.infinity,
                      height: 38,
                      decoration: BoxDecoration(
                        color: const Color(0xFF4A2518),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'Semua (${_categories.length})',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Section Title: RINCIAN KATEGORI
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'RINCIAN KATEGORI',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.6,
                            color: Color(0xFF2E150D),
                          ),
                        ),
                        GestureDetector(
                          onTap: () async {
                            await Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const KelolaCategoryScreen()),
                            );
                            if (mounted) _loadData();
                          },
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Kelola Kategori',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF8A3A23),
                                ),
                              ),
                              SizedBox(width: 2),
                              Icon(Icons.chevron_right, size: 14, color: Color(0xFF8A3A23)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Category List Cards
                    if (_isLoading)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 32),
                        child: Center(
                          child: CircularProgressIndicator(color: Color(0xFF4A2518)),
                        ),
                      )
                    else if (_categories.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFF0EBE1)),
                        ),
                        child: Column(
                          children: [
                            const Icon(Icons.account_balance_wallet_outlined, size: 36, color: Color(0xFFB9A99E)),
                            const SizedBox(height: 12),
                            Text(
                              'Belum ada anggaran untuk ${DateFormat('MMMM yyyy', 'id_ID').format(_currentDate)}',
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 13, color: Color(0xFF6B4E44), fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Tambahkan anggaran kategori agar pengeluaran bisa dipantau per bulan.',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 11, color: Color(0xFF8C827A), height: 1.4),
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF4A2518),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                elevation: 0,
                              ),
                              onPressed: _showAddBudgetSheet,
                              icon: const Icon(Icons.add, color: Colors.white, size: 18),
                              label: const Text(
                                'Buat Anggaran',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      )
                    else
                      ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _categories.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final item = _categories[index];
                        final bool isOver = item['isOver'] == true;
                        final int spent = _toInt(item['spent']);
                        final int limit = _toInt(item['limit']);
                        final int percent = _toInt(item['percent']);
                        final double progressRatio = (limit > 0 ? (spent / limit) : 0.0).clamp(0.0, 1.0);

                        return InkWell(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => DetailAnggaranScreen(
                                  category: item,
                                  onUpdate: (updatedCat) {
                                    setState(() {
                                      final idx = _categories.indexWhere((c) => c['id'] == updatedCat['id']);
                                      if (idx != -1) {
                                        _categories[idx] = updatedCat;
                                      }
                                    });
                                    _loadData();
                                  },
                                  onDelete: (id) {
                                    setState(() {
                                      _categories.removeWhere((c) => c['id'] == id);
                                    });
                                  },
                                ),
                              ),
                            );
                          },
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: (item['borderColor'] as Color?) ?? const Color(0xFFE5DDD5)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.02),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Top Row
                              Row(
                                children: [
                                  Container(
                                    width: 40,
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: (item['iconBg'] as Color?) ?? const Color(0xFFFFF3ED),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    alignment: Alignment.center,
                                    child: Icon(
                                      resolveBudgetIcon(item),
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
                                          item['title']?.toString() ?? 'Kategori',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                            color: Color(0xFF2E150D),
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          'Batas: ${_formatRupiah(limit)}',
                                          style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: (item['tagBg'] as Color?) ?? const Color(0xFFFFE5E0),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      item['tag']?.toString() ?? '',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: (item['tagColor'] as Color?) ?? const Color(0xFFD32F2F),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),

                              // Amounts & Percentage Row
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.baseline,
                                    textBaseline: TextBaseline.alphabetic,
                                    children: [
                                      Text(
                                        _formatRupiah(spent),
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: isOver
                                              ? const Color(0xFFD32F2F)
                                              : percent > 80
                                                  ? const Color(0xFFE68A00)
                                                  : const Color(0xFF2E150D),
                                        ),
                                      ),
                                      Text(
                                        limit > 0
                                            ? ' / ${_formatLimitShort(limit)}'
                                            : ' / belum ada budget',
                                        style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                                      ),
                                    ],
                                  ),
                                  Text(
                                    limit > 0 ? '$percent%' : '—',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                      color: limit <= 0
                                          ? const Color(0xFF8C827A)
                                          : isOver
                                              ? const Color(0xFFD32F2F)
                                              : percent > 80
                                                  ? const Color(0xFFE68A00)
                                                  : const Color(0xFF1B8A46),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),

                              // Progress bar
                              Stack(
                                children: [
                                  Container(
                                    height: 7,
                                    width: double.infinity,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF3ECE6),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                                  FractionallySizedBox(
                                    widthFactor: progressRatio,
                                    child: Container(
                                      height: 7,
                                      decoration: BoxDecoration(
                                        color: isOver
                                            ? const Color(0xFFE53935)
                                            : percent > 80
                                                ? const Color(0xFFFFA000)
                                                : const Color(0xFF00A854),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),

                              // Footer Row
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      if (item['statusIcon'] != null) ...[
                                        Icon(
                                          item['statusIcon'] as IconData,
                                          size: 14,
                                          color: (item['statusColor'] as Color?) ?? Colors.grey,
                                        ),
                                        const SizedBox(width: 4),
                                      ],
                                      Text(
                                        item['statusText']?.toString() ?? '',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                          color: (item['statusColor'] as Color?) ?? Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (item['actionLabel'] == 'Sesuaikan')
                                    InkWell(
                                      onTap: () => _showEditBudgetSheet(item),
                                      borderRadius: BorderRadius.circular(10),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF5F1EB),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Text(
                                          item['actionLabel']?.toString() ?? 'Sesuaikan',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF2E150D),
                                          ),
                                        ),
                                      ),
                                    )
                                  else
                                    InkWell(
                                      onTap: () => _showEditBudgetSheet(item),
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                        child: Text(
                                          item['actionLabel']?.toString() ?? 'Sesuaikan',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF2E150D),
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                      },
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),

            // Bottom Buat Anggaran Baru Button
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 10,
                    offset: const Offset(0, -3),
                  ),
                ],
              ),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4A2518),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  onPressed: () {
                    _showAddBudgetSheet();
                  },
                  icon: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: Colors.white24,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.add, color: Colors.white, size: 16),
                  ),
                  label: const Text(
                    'Buat Anggaran Baru',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatLimitShort(dynamic limitRaw) {
    final int limit = _toInt(limitRaw);
    if (limit >= 1000000) {
      final double val = limit / 1000000;
      return 'Rp ${val.toStringAsFixed(val.truncateToDouble() == val ? 0 : 1)} jt';
    } else {
      final int val = limit ~/ 1000;
      return 'Rp $val rb';
    }
  }
}
