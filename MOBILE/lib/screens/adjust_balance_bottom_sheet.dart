import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/category_model.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';
import '../services/auth_provider.dart';

class AdjustBalanceBottomSheet extends StatefulWidget {
  final double currentBalance;
  final bool initialIsAdd;

  const AdjustBalanceBottomSheet({
    super.key,
    this.currentBalance = 0,
    this.initialIsAdd = true,
  });

  static Future<bool?> show(BuildContext context, {bool isAdd = true}) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AdjustBalanceBottomSheet(initialIsAdd: isAdd),
    );
  }

  @override
  State<AdjustBalanceBottomSheet> createState() =>
      _AdjustBalanceBottomSheetState();
}

class _AdjustBalanceBottomSheetState extends State<AdjustBalanceBottomSheet> {
  late bool _isAdd;
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _customCategoryController = TextEditingController();
  int _selectedAmount = 0;
  bool _isLoading = false;

  List<CategoryModel> _categories = [];
  String? _selectedCategoryId;
  String _selectedCategoryName = '';
  bool _isLoadingCategories = true;

  List<CategoryModel> get _filteredCategories => _categories
      .where((cat) => cat.type.toUpperCase() == (_isAdd ? 'INCOME' : 'EXPENSE'))
      .toList();

  @override
  void initState() {
    super.initState();
    _isAdd = widget.initialIsAdd;
    _loadCategories();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _customCategoryController.dispose();
    super.dispose();
  }

  String _formatCurrency(num value) {
    final int intVal = value.round();
    return intVal.toString().replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.');
  }

  void _onAmountChanged(String val) {
    String clean = val.replaceAll(RegExp(r'[^0-9]'), '');
    if (clean.isEmpty) {
      setState(() {
        _selectedAmount = 0;
      });
      return;
    }
    int? parsed = int.tryParse(clean);
    if (parsed != null) {
      String formatted = _formatCurrency(parsed);
      _amountController.value = TextEditingValue(
        text: formatted,
        selection: TextSelection.collapsed(offset: formatted.length),
      );
      setState(() {
        _selectedAmount = parsed;
      });
    }
  }

  Future<void> _loadCategories() async {
    setState(() => _isLoadingCategories = true);
    final list = await ApiService.fetchCategories();
    if (!mounted) return;
    setState(() {
      _categories = list;
      _isLoadingCategories = false;
      _selectDefaultCategory();
    });
  }

  void _selectDefaultCategory() {
    final filtered = _filteredCategories;
    if (filtered.isEmpty) {
      _selectedCategoryId = null;
      _selectedCategoryName = '';
      return;
    }

    final systemName = _isAdd ? 'tambah saldo' : 'kurangi saldo';
    final system = filtered
        .where((cat) => cat.name.trim().toLowerCase() == systemName)
        .toList();
    final chosen = system.isNotEmpty ? system.first : filtered.first;
    _selectedCategoryId = chosen.id;
    _selectedCategoryName = chosen.name;
  }

  void _setType(bool isAdd) {
    if (_isAdd == isAdd) return;
    setState(() {
      _isAdd = isAdd;
      _selectDefaultCategory();
    });
  }

  Future<CategoryModel?> _createCustomCategory() async {
    _customCategoryController.clear();
    final name = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          _isAdd ? 'Tambah Kategori Pemasukan' : 'Tambah Kategori Pengeluaran',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        content: TextField(
          controller: _customCategoryController,
          autofocus: true,
          textCapitalization: TextCapitalization.words,
          textInputAction: TextInputAction.done,
          decoration: InputDecoration(
            hintText: 'Contoh: Uang Saku, Skincare, dll.',
            filled: true,
            fillColor: const Color(0xFFFAF8F5),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.primary),
            ),
          ),
          onSubmitted: (value) => Navigator.pop(ctx, value),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal', style: TextStyle(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, _customCategoryController.text),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text(
              'Simpan',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );

    if (!mounted) return null;
    final trimmed = (name ?? '').trim();
    if (trimmed.isEmpty) return null;

    final categoryType = _isAdd ? 'income' : 'expense';
    final exists = _categories.any(
      (cat) =>
          cat.name.trim().toLowerCase() == trimmed.toLowerCase() &&
          cat.type.toUpperCase() == categoryType.toUpperCase(),
    );
    if (exists) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Kategori "$trimmed" sudah ada.'),
          backgroundColor: AppColors.errorText,
        ),
      );
      return null;
    }

    final created = await ApiService.createCategory(
      name: trimmed,
      type: categoryType,
    );
    if (!mounted) return null;
    if (created == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(ApiService.lastCategoryError ?? 'Gagal menambahkan kategori.'),
          backgroundColor: AppColors.errorText,
        ),
      );
      return null;
    }

    setState(() {
      _categories = [..._categories, created];
      _selectedCategoryId = created.id;
      _selectedCategoryName = created.name;
    });
    return created;
  }

  Future<void> _showCategoryPicker() async {
    final filtered = _filteredCategories;

    final selected = await showModalBottomSheet<CategoryModel>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(ctx).size.height * 0.65,
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
                _isAdd ? 'Pilih Kategori Pemasukan' : 'Pilih Kategori Pengeluaran',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: InkWell(
                onTap: () async {
                  final created = await _createCustomCategory();
                  if (created != null && ctx.mounted) {
                    Navigator.pop(ctx, created);
                  }
                },
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF7F2),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE8CDBD)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5E6DB),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.add_rounded,
                          size: 18,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Lainnya',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textDark,
                              ),
                            ),
                            Text(
                              'Tambah kategori ${_isAdd ? 'pemasukan' : 'pengeluaran'} sendiri',
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.chevron_right_rounded,
                        size: 20,
                        color: AppColors.primary,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: filtered.isEmpty
                  ? const Center(
                      child: Padding(
                        padding: EdgeInsets.all(24),
                        child: Text(
                          'Belum ada kategori. Ketuk "Lainnya" di atas untuk menambah.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                        ),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      itemCount: filtered.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 4),
                      itemBuilder: (context, index) {
                        final category = filtered[index];
                        final isSelected = _selectedCategoryId == category.id;
                        return InkWell(
                          borderRadius: BorderRadius.circular(14),
                          onTap: () => Navigator.pop(ctx, category),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFFFAF1EB) : Colors.white,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isSelected
                                    ? AppColors.primary
                                    : const Color(0xFFEBE6DF),
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
                                  child: const Icon(
                                    Icons.local_offer_outlined,
                                    size: 18,
                                    color: AppColors.primary,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    category.name,
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: AppColors.textDark,
                                      fontWeight: isSelected
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                    ),
                                  ),
                                ),
                                if (isSelected)
                                  const Icon(
                                    Icons.check_circle,
                                    color: AppColors.primary,
                                    size: 20,
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );

    if (selected != null && mounted) {
      setState(() {
        _selectedCategoryId = selected.id;
        _selectedCategoryName = selected.name;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final double currentBalance = auth.saldo;
    double estimatedBalance = _isAdd
        ? currentBalance + _selectedAmount
        : currentBalance - _selectedAmount;
    if (estimatedBalance < 0) estimatedBalance = 0;

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFFFBF8F3), // Background krem lembut sesuai UI
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 12,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Drag handle
            Container(
              width: 48,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFD3C8B8),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),

            // Header Title & Close Button
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Atur & Sesuaikan Saldo',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _isAdd
                            ? 'Masukkan nominal saldo yang ingin kamu tambahkan.'
                            : 'Masukkan nominal saldo yang ingin kamu kurangkan.',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF8C827A),
                          height: 1.3,
                        ),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEFE8DF),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.close,
                        size: 18, color: Color(0xFF70655D)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Section 1: Tujuan Dompet
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'TUJUAN DOMPET',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF9E948C),
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFEFE8DF)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.account_balance_wallet_outlined,
                            color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Dompet Utama',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF3B2D26),
                              ),
                            ),
                            Text(
                              'Saldo saat ini: Rp ${_formatCurrency(currentBalance)}',
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF8C827A),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Section 2: Card Penyesuaian Saldo
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFEFE8DF)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Toggle Tab: Tambah / Kurangi
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F0EB),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _setType(true),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: _isAdd
                                    ? AppColors.primary
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Center(
                                child: Text(
                                  '+ Tambah Saldo',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: _isAdd
                                        ? Colors.white
                                        : const Color(0xFF70655D),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _setType(false),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: !_isAdd
                                    ? AppColors.primary
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Center(
                                child: Text(
                                  '- Kurangi Saldo',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: !_isAdd
                                        ? Colors.white
                                        : const Color(0xFF70655D),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Title Label Nominal
                  Text(
                    _isAdd ? 'MASUKKAN NOMINAL TAMBAH' : 'MASUKKAN NOMINAL PENGURANGAN',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF9E948C),
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Input Box for Nominal (Customizable by user)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF7F2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: _isAdd
                            ? const Color(0xFF00A86B).withValues(alpha: 0.4)
                            : AppColors.primary.withValues(alpha: 0.4),
                        width: 1.5,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          _isAdd ? '+Rp' : '-Rp',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: _isAdd
                                ? const Color(0xFF00A86B)
                                : const Color(0xFFE53935),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: _amountController,
                            keyboardType: TextInputType.number,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                            decoration: const InputDecoration(
                              hintText: '0',
                              hintStyle: TextStyle(
                                color: Color(0xFFB0A49B),
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.symmetric(vertical: 8),
                            ),
                            onChanged: _onAmountChanged,
                          ),
                        ),
                        if (_selectedAmount > 0)
                          GestureDetector(
                            onTap: () {
                              _amountController.clear();
                              setState(() {
                                _selectedAmount = 0;
                              });
                            },
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Color(0xFFE5DDD8),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.close, size: 14, color: Color(0xFF70655D)),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Kategori transaksi
                  const Text(
                    'KATEGORI',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF9E948C),
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 8),
                  InkWell(
                    onTap: _isLoadingCategories ? null : _showCategoryPicker,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFAF7F2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE5DDD5)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(7),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF5E6DB),
                              borderRadius: BorderRadius.circular(9),
                            ),
                            child: const Icon(
                              Icons.local_offer_outlined,
                              size: 17,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _selectedCategoryName.isEmpty
                                      ? 'Pilih kategori'
                                      : _selectedCategoryName,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textDark,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _isAdd ? 'Kategori pemasukan' : 'Kategori pengeluaran',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: AppColors.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (_isLoadingCategories)
                            const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: AppColors.primary,
                              ),
                            )
                          else
                            const Icon(
                              Icons.chevron_right_rounded,
                              size: 20,
                              color: AppColors.textMuted,
                            ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Breakdown Calculation Box
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF6F0),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Saldo Saat Ini',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF8C827A),
                              ),
                            ),
                            Text(
                              'Rp ${_formatCurrency(currentBalance)}',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF3B2D26),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Penyesuaian',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF8C827A),
                              ),
                            ),
                            Text(
                              _isAdd
                                  ? '+ Rp ${_formatCurrency(_selectedAmount)}'
                                  : '- Rp ${_formatCurrency(_selectedAmount)}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: _isAdd
                                    ? const Color(0xFF00A86B)
                                    : const Color(0xFFE53935),
                              ),
                            ),
                          ],
                        ),
                        const Divider(color: Color(0xFFEBE2D8), height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Estimasi Saldo Baru',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF3B2D26),
                              ),
                            ),
                            Text(
                              'Rp ${_formatCurrency(estimatedBalance)}',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Main Submit Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                        if (_selectedAmount <= 0) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Silakan masukkan nominal saldo terlebih dahulu'),
                              backgroundColor: Colors.orange,
                            ),
                          );
                          return;
                        }

                        if (!_isAdd && _selectedAmount > currentBalance) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Saldo tidak mencukupi untuk penarikan.'),
                              backgroundColor: Color(0xFFE53935),
                            ),
                          );
                          return;
                        }

                        setState(() => _isLoading = true);
                        final messenger = ScaffoldMessenger.of(context);
                        final navigator = Navigator.of(context);
                        final authProvider = Provider.of<AuthProvider>(context, listen: false);
                        await authProvider.adjustBalance(
                          isAdd: _isAdd,
                          amount: _selectedAmount.toDouble(),
                          categoryId: int.tryParse(_selectedCategoryId ?? ''),
                        );

                        if (!mounted) return;
                        setState(() => _isLoading = false);

                        navigator.pop(true);

                        messenger.showSnackBar(
                          SnackBar(
                            backgroundColor:
                                _isAdd ? const Color(0xFF00A86B) : const Color(0xFF5E2B16),
                            content: Text(
                              _isAdd
                                  ? '✅ Saldo berhasil bertambah Rp ${_formatCurrency(_selectedAmount)}'
                                  : '✅ Saldo berhasil berkurang Rp ${_formatCurrency(_selectedAmount)}',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        );
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  elevation: 4,
                  shadowColor: AppColors.primary.withValues(alpha: 0.3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2.5,
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _isAdd ? Icons.check : Icons.remove,
                            color: Colors.white,
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _isAdd
                                ? 'Simpan Perubahan Saldo'
                                : 'Konfirmasi Pengurangan Saldo',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 12),

            // Footer Info Text
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.check_circle_outline,
                    size: 14, color: Color(0xFF00A86B)),
                SizedBox(width: 4),
                Text(
                  'Saldo dompet langsung terupdate secara instan',
                  style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
