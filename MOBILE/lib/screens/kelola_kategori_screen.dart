import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../utils/budget_icons.dart';
import '../utils/currency_formatter.dart';
import '../utils/theme.dart';

class KelolaCategoryItem {
  final String id;
  final String name;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final String iconKey;
  bool isPinned;

  KelolaCategoryItem({
    required this.id,
    required this.name,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.iconKey,
    this.isPinned = false,
  });
}

class KelolaCategoryScreen extends StatefulWidget {
  const KelolaCategoryScreen({super.key});

  @override
  State<KelolaCategoryScreen> createState() => _KelolaCategoryScreenState();
}

typedef KelolaKategoriScreen = KelolaCategoryScreen;

class _KelolaCategoryScreenState extends State<KelolaCategoryScreen> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  int _selectedIconIndex = 0;
  int _selectedColorIndex = 0;

  List<KelolaCategoryItem> _categories = [];
  bool _isLoading = true;
  bool _isSubmitting = false;

  final List<IconData> _availableIcons = [
    Icons.restaurant,
    Icons.shopping_cart,
    Icons.directions_car,
    Icons.movie,
    Icons.local_hospital,
    Icons.school,
    Icons.sports_soccer,
    Icons.flight,
    Icons.home,
    Icons.pets,
    Icons.music_note,
    Icons.fitness_center,
    Icons.local_cafe,
    Icons.beach_access,
    Icons.build,
    Icons.celebration,
  ];

  final List<Color> _availableColors = [
    const Color(0xFF592314),
    const Color(0xFFD95B27),
    const Color(0xFFE07B54),
    const Color(0xFF8B6355),
    const Color(0xFF6D4C41),
    const Color(0xFFC1440E),
    const Color(0xFF9C4221),
    const Color(0xFFA0522D),
  ];

  List<KelolaCategoryItem> get _filteredCategories {
    final query = _searchController.text.toLowerCase();
    if (query.isEmpty) return _categories;
    return _categories.where((c) => c.name.toLowerCase().contains(query)).toList();
  }

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    setState(() => _isLoading = true);

    final categories = await ApiService.fetchCategories(type: 'expense');
    final now = DateTime.now();
    final transactions = await ApiService.fetchTransactions(
      startDate: DateTime(now.year, now.month, 1),
      endDate: DateTime(now.year, now.month + 1, 0),
      limit: 500,
    );

    final counts = <String, int>{};
    final totals = <String, double>{};
    for (final tx in transactions) {
      if (tx.type.toUpperCase() != 'EXPENSE') continue;
      counts[tx.categoryId] = (counts[tx.categoryId] ?? 0) + 1;
      totals[tx.categoryId] = (totals[tx.categoryId] ?? 0) + tx.amount;
    }

    final items = <KelolaCategoryItem>[];
    final seen = <String>{};
    for (final cat in categories) {
      if (cat.type.toUpperCase() != 'EXPENSE') continue;
      if (!seen.add(cat.id)) continue;
      final count = counts[cat.id] ?? 0;
      final total = totals[cat.id] ?? 0;
      items.add(
        KelolaCategoryItem(
          id: cat.id,
          name: cat.name,
          subtitle: count == 0
              ? 'Belum ada transaksi bulan ini'
              : '$count Transaksi bulan ini · ${CurrencyFormatter.formatRupiah(total)}',
          icon: resolveBudgetIcon({'icon': cat.icon, 'title': cat.name}),
          iconColor: _availableColors[items.length % _availableColors.length],
          iconKey: cat.icon,
        ),
      );
    }

    if (!mounted) return;
    setState(() {
      _categories = items;
      _isLoading = false;
    });
  }

  Future<void> _addCategory() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nama kategori tidak boleh kosong!')),
      );
      return;
    }
    if (_isSubmitting) return;

    setState(() => _isSubmitting = true);
    final created = await ApiService.createCategory(
      name: name,
      type: 'expense',
      icon: budgetIconKey(_availableIcons[_selectedIconIndex]),
    );
    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (created == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(ApiService.lastCategoryError ?? 'Gagal menambahkan kategori.')),
      );
      return;
    }

    _nameController.clear();
    await _loadCategories();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Kategori "${created.name}" berhasil ditambahkan!'),
        backgroundColor: AppColors.primaryBrown,
      ),
    );
  }

  Future<void> _editCategory(KelolaCategoryItem cat) async {
    final controller = TextEditingController(text: cat.name);
    final newName = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Ubah Nama Kategori', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: InputDecoration(
            labelText: 'Nama Kategori',
            filled: true,
            fillColor: AppColors.inputBg,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryBrown),
            onPressed: () => Navigator.pop(ctx, controller.text.trim()),
            child: const Text('Simpan', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (newName == null || newName.isEmpty || newName == cat.name) return;

    final ok = await ApiService.updateCategory(cat.id, name: newName);
    if (!mounted) return;
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(ApiService.lastCategoryError ?? 'Gagal menyimpan kategori.')),
      );
      return;
    }
    await _loadCategories();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Nama kategori berhasil diperbarui.')),
    );
  }

  Future<void> _deleteCategory(KelolaCategoryItem cat) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Hapus Kategori?', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: Text(
          'Kategori "${cat.name}" akan dihapus. Kategori yang masih dipakai transaksi atau anggaran tidak bisa dihapus.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFD32F2F)),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Hapus', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirmed != true) return;
    if (!mounted) return;

    final ok = await ApiService.deleteCategory(cat.id);
    if (!mounted) return;
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(ApiService.lastCategoryError ?? 'Gagal menghapus kategori.')),
      );
      return;
    }
    await _loadCategories();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Kategori "${cat.name}" berhasil dihapus.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // AppBar
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
                      'Kelola Kategori',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.primaryBrown,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.add, size: 13, color: Colors.white),
                        SizedBox(width: 4),
                        Text(
                          'Kategori Baru',
                          style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: RefreshIndicator(
                color: AppColors.primaryBrown,
                onRefresh: _loadCategories,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Search Bar
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.inputBorder),
                        ),
                        child: TextField(
                          controller: _searchController,
                          onChanged: (_) => setState(() {}),
                          decoration: const InputDecoration(
                            hintText: 'Cari nama kategori...',
                            hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 13),
                            prefixIcon: Icon(Icons.search, color: AppColors.textMuted, size: 20),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      const Text(
                        'STRUKTUR AKUN',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMuted,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Form Buat Kategori Kustom
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
                                const Text(
                                  'Buat Kategori Pengeluaran',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: AppColors.textDark,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryBrown.withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text(
                                    'Kategori',
                                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.primaryBrown),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Kategori ini akan langsung muncul di pilihan anggaran.',
                              style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                            ),
                            const SizedBox(height: 16),

                            const Text(
                              'Nama Kategori',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: AppColors.inputBg,
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(color: AppColors.inputBorder),
                                    ),
                                    child: TextField(
                                      controller: _nameController,
                                      onChanged: (_) => setState(() {}),
                                      style: const TextStyle(fontSize: 13, color: AppColors.textDark),
                                      decoration: const InputDecoration(
                                        hintText: 'Contoh: Skincare & Self-Care',
                                        hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 13),
                                        border: InputBorder.none,
                                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: AppColors.inputBg,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: AppColors.inputBorder),
                                  ),
                                  child: const Text(
                                    'Aa',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textDark, fontSize: 14),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),

                            const Text(
                              'Pilih Simbol Ikon',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
                            ),
                            const SizedBox(height: 10),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: List.generate(_availableIcons.length, (index) {
                                final isSelected = _selectedIconIndex == index;
                                return GestureDetector(
                                  onTap: () => setState(() => _selectedIconIndex = index),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    width: 36,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      color: isSelected ? AppColors.primaryBrown : AppColors.inputBg,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: isSelected ? AppColors.primaryBrown : AppColors.inputBorder,
                                      ),
                                    ),
                                    child: Icon(
                                      _availableIcons[index],
                                      size: 18,
                                      color: isSelected ? Colors.white : AppColors.textMuted,
                                    ),
                                  ),
                                );
                              }),
                            ),
                            const SizedBox(height: 16),

                            const Text(
                              'Warna Aksen Palet',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
                            ),
                            const SizedBox(height: 10),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: List.generate(_availableColors.length, (index) {
                                final isSelected = _selectedColorIndex == index;
                                return GestureDetector(
                                  onTap: () => setState(() => _selectedColorIndex = index),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    width: 28,
                                    height: 28,
                                    decoration: BoxDecoration(
                                      color: _availableColors[index],
                                      shape: BoxShape.circle,
                                      border: isSelected ? Border.all(color: AppColors.textDark, width: 2.5) : null,
                                      boxShadow: isSelected
                                          ? [
                                              BoxShadow(
                                                color: _availableColors[index].withValues(alpha: 0.5),
                                                blurRadius: 6,
                                                spreadRadius: 1,
                                              )
                                            ]
                                          : null,
                                    ),
                                    child: isSelected ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
                                  ),
                                );
                              }),
                            ),
                            const SizedBox(height: 16),

                            // Preview
                            if (_nameController.text.isNotEmpty) ...[
                              AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: _availableColors[_selectedColorIndex].withValues(alpha: 0.08),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: _availableColors[_selectedColorIndex].withValues(alpha: 0.2)),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: _availableColors[_selectedColorIndex],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Icon(_availableIcons[_selectedIconIndex], color: Colors.white, size: 18),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        _nameController.text,
                                        style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.textDark),
                                      ),
                                    ),
                                    const Text('Preview', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 12),
                            ],

                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _isSubmitting ? null : _addCategory,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primaryBrown,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                                child: _isSubmitting
                                    ? const SizedBox(
                                        width: 18,
                                        height: 18,
                                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                      )
                                    : const Text('+ Tambah Kategori Ini'),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Tips Kecerdasan Keuangan
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF7F2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFDE3D3)),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: AppColors.accentOrange,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.lightbulb, color: Colors.white, size: 16),
                            ),
                            const SizedBox(width: 10),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Tips Kecerdasan Keuangan',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.textDark),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    'Semakin spesifik kategori pengeluaranmu, semakin mudah melihat ke mana uang pergi setiap bulan.',
                                    style: TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.5),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Daftar Kategori Aktif
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'DAFTAR KATEGORI AKTIF',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 1.2),
                          ),
                          Text(
                            '${_filteredCategories.length} kategori',
                            style: TextStyle(fontSize: 10, color: AppColors.primaryBrown.withValues(alpha: 0.8)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      if (_isLoading)
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 32),
                          child: Center(child: CircularProgressIndicator(color: AppColors.primaryBrown)),
                        )
                      else if (_filteredCategories.isEmpty)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.inputBorder),
                          ),
                          child: Column(
                            children: [
                              const Icon(Icons.category_outlined, size: 32, color: AppColors.textMuted),
                              const SizedBox(height: 8),
                              Text(
                                _searchController.text.isEmpty
                                    ? 'Belum ada kategori pengeluaran.'
                                    : 'Kategori tidak ditemukan.',
                                style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                              ),
                            ],
                          ),
                        )
                      else
                        Column(
                          children: [
                            for (final cat in _filteredCategories)
                              _buildCategoryTile(cat, key: ValueKey(cat.id)),
                          ],
                        ),
                      const SizedBox(height: 80),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryTile(KelolaCategoryItem cat, {required Key key}) {
    return Container(
      key: key,
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: cat.iconColor.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(cat.icon, color: cat.iconColor, size: 22),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                cat.name,
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppColors.textDark),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (cat.isPinned) ...[
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: AppColors.greenBg, borderRadius: BorderRadius.circular(4)),
                child: const Text('Utama', style: TextStyle(fontSize: 9, color: AppColors.greenAccent, fontWeight: FontWeight.bold)),
              ),
            ]
          ],
        ),
        subtitle: Text(cat.subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            GestureDetector(
              onTap: () => setState(() => cat.isPinned = !cat.isPinned),
              child: Icon(
                cat.isPinned ? Icons.push_pin : Icons.push_pin_outlined,
                color: cat.isPinned ? AppColors.primaryBrown : AppColors.textMuted,
                size: 18,
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () => _editCategory(cat),
              child: const Icon(Icons.edit_outlined, color: AppColors.textMuted, size: 18),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () => _deleteCategory(cat),
              child: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 18),
            ),
          ],
        ),
      ),
    );
  }
}
