import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../utils/notification_helper.dart';
import '../utils/currency_formatter.dart';
import '../models/category_model.dart';
import '../services/api_service.dart';
import '../services/auth_provider.dart';
import '../utils/budget_icons.dart';
import 'transaction_screen.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({super.key});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  bool isIncome = true;
  String _selectedCategory = '';
  DateTime _selectedDate = DateTime.now();
  List<CategoryModel> _categories = [];
  bool _isLoadingCategories = true;

  final TextEditingController _nominalController = TextEditingController();
  final TextEditingController _noteController = TextEditingController();

  List<CategoryModel> get _filteredCategories => _categories
      .where((c) => c.type.toUpperCase() == (isIncome ? 'INCOME' : 'EXPENSE'))
      .toList();

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    final list = await ApiService.fetchCategories();
    if (!mounted) return;
    setState(() {
      _categories = list;
      _isLoadingCategories = false;
      final filtered = _filteredCategories;
      if (filtered.isNotEmpty) {
        _selectedCategory = filtered.first.name;
      }
    });
  }

  void _setType(bool income) {
    setState(() {
      isIncome = income;
      final filtered = _categories
          .where((c) => c.type.toUpperCase() == (income ? 'INCOME' : 'EXPENSE'))
          .toList();
      _selectedCategory = filtered.isNotEmpty ? filtered.first.name : '';
    });
  }

  @override
  void dispose() {
    _nominalController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Tambah Transaksi',
          style: TextStyle(
            color: AppColors.textDark,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Tabs (Pemasukan / Pengeluaran)
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => _setType(true),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isIncome ? AppColors.primaryBrown : Colors.transparent,
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.arrow_upward,
                              size: 16,
                              color: isIncome ? Colors.white : AppColors.primaryBrown,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Pemasukan',
                              style: TextStyle(
                                color: isIncome ? Colors.white : AppColors.textDark,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => _setType(false),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: !isIncome ? AppColors.primaryBrown : Colors.transparent,
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.arrow_downward,
                              size: 16,
                              color: !isIncome ? Colors.white : AppColors.primaryBrown,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Pengeluaran',
                              style: TextStyle(
                                color: !isIncome ? Colors.white : AppColors.textDark,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Form Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.02),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Nominal
                  _buildLabel(Icons.account_balance_wallet_outlined, 'Nominal'),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF8F5),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Text(
                          'Rp ',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey,
                          ),
                        ),
                        Expanded(
                          child: TextField(
                            controller: _nominalController,
                            keyboardType: TextInputType.number,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                              ThousandsSeparatorInputFormatter(),
                            ],
                            decoration: const InputDecoration(
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                              border: InputBorder.none,
                              hintText: '0',
                              hintStyle: TextStyle(
                                color: AppColors.textDark,
                              ),
                            ),
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // 2. Kategori
                  _buildLabel(Icons.local_offer_outlined, 'Kategori'),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: () {
                      _showCategoryPicker(context);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFAF8F5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _selectedCategory.isEmpty ? 'Pilih kategori' : _selectedCategory,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textDark,
                            ),
                          ),
                          const Icon(Icons.chevron_right, color: AppColors.textMuted, size: 20),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // 3. Tanggal
                  _buildLabel(Icons.calendar_today_outlined, 'Tanggal'),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: () => _selectDate(context),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFAF8F5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            DateFormat('d MMM yyyy', 'id_ID').format(_selectedDate),
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textDark,
                            ),
                          ),
                          const Icon(Icons.calendar_month_outlined, color: AppColors.textMuted, size: 18),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // 4. Catatan
                  Row(
                    children: const [
                      Icon(Icons.description_outlined, size: 16, color: AppColors.textDark),
                      SizedBox(width: 8),
                      Text(
                        'Catatan ',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textDark,
                        ),
                      ),
                      Text(
                        '(opsional)',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF8F5),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        TextField(
                          controller: _noteController,
                          maxLines: 3,
                          decoration: InputDecoration(
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                            border: InputBorder.none,
                            hintText: 'Tambahkan catatan...',
                            hintStyle: TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 13,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '0/100',
                          style: TextStyle(
                            fontSize: 10,
                            color: AppColors.textMuted.withOpacity(0.7),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            // Simpan Button
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: () async {
                  final String nominal = _nominalController.text.trim();
                  if (nominal.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Silakan masukkan nominal transaksi.')),
                    );
                    return;
                  }

                  final double amount =
                      double.tryParse(nominal.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0.0;
                  if (amount <= 0) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Nominal transaksi harus lebih dari 0.')),
                    );
                    return;
                  }

                  if (_selectedCategory.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Pilih kategori transaksi terlebih dahulu.')),
                    );
                    return;
                  }

                  final auth = Provider.of<AuthProvider>(context, listen: false);
                  final success = await auth.addTransaction(
                    type: isIncome ? 'income' : 'expense',
                    amount: amount,
                    category: _selectedCategory,
                    date: DateFormat('yyyy-MM-dd').format(_selectedDate),
                    note: _noteController.text.trim(),
                  );

                  if (!mounted) return;
                  if (!success) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Gagal menyimpan transaksi. Periksa koneksi ke server.'),
                      ),
                    );
                    return;
                  }

                  final txMap = {
                    'category': _selectedCategory,
                    'amount': amount,
                    'isExpense': !isIncome,
                    'note': _noteController.text.trim(),
                    'date': DateFormat('yyyy-MM-dd').format(_selectedDate),
                  };
                  newTransactionNotifier.value = txMap;

                  if (!mounted) return;
                  NotificationHelper.showTopNotification(context, 'Transaksi berhasil dicatat!');
                  Navigator.pop(context, txMap);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBrown,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Simpan',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.textDark),
        const SizedBox(width: 8),
        Text(
          text,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
      ],
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
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
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _showCategoryPicker(BuildContext context) {
    String tempSelected = _selectedCategory;
    final searchController = TextEditingController();
    final categories = _filteredCategories;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final query = searchController.text.trim().toLowerCase();
            final visible = categories
                .where((cat) => cat.name.toLowerCase().contains(query))
                .toList();

            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: const BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 12),
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: const Color(0xFFD6CFC8),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Text(
                      isIncome ? 'Pilih Kategori Pemasukan' : 'Pilih Kategori Pengeluaran',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEBE6DF),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.search, color: AppColors.textMuted, size: 20),
                          const SizedBox(width: 8),
                          Expanded(
                            child: TextField(
                              controller: searchController,
                              onChanged: (_) => setModalState(() {}),
                              decoration: const InputDecoration(
                                hintText: 'Cari kategori...',
                                hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 14),
                                border: InputBorder.none,
                                isDense: true,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: _isLoadingCategories
                        ? const Center(child: CircularProgressIndicator(color: AppColors.primaryBrown))
                        : visible.isEmpty
                            ? const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(24),
                                  child: Text(
                                    'Kategori tidak ditemukan. Tambahkan kategori baru di menu Kelola Kategori.',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                                  ),
                                ),
                              )
                            : ListView.separated(
                                padding: const EdgeInsets.symmetric(horizontal: 20),
                                itemCount: visible.length,
                                separatorBuilder: (_, __) => const SizedBox(height: 4),
                                itemBuilder: (context, index) {
                                  final category = visible[index];
                                  final selected = tempSelected == category.name;
                                  final icon = resolveBudgetIcon({
                                    'icon': category.icon,
                                    'title': category.name,
                                  });

                                  return InkWell(
                                    borderRadius: BorderRadius.circular(14),
                                    onTap: () => setModalState(() => tempSelected = category.name),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                      decoration: BoxDecoration(
                                        color: selected ? const Color(0xFFFAF1EB) : Colors.white,
                                        borderRadius: BorderRadius.circular(14),
                                        border: Border.all(
                                          color: selected ? AppColors.primaryBrown : const Color(0xFFEBE6DF),
                                        ),
                                      ),
                                      child: Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFF5F0EB),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: Icon(icon, size: 18, color: AppColors.primaryBrown),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Text(
                                              category.name,
                                              style: TextStyle(
                                                fontSize: 13,
                                                color: AppColors.textDark,
                                                fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                                              ),
                                            ),
                                          ),
                                          if (selected)
                                            const Icon(Icons.check_circle, color: AppColors.primaryBrown, size: 20),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                  ),
                  Container(
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
                    child: SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: tempSelected.isEmpty
                            ? null
                            : () => Navigator.pop(context, tempSelected),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBrown,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 0,
                        ),
                        child: const Text(
                          'Pilih',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    ).then((selectedVal) {
      if (selectedVal != null && selectedVal is String) {
        setState(() {
          _selectedCategory = selectedVal;
        });
      }
    });
  }
}
