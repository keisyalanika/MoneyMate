import 'package:flutter/material.dart';
import '../utils/theme.dart';

class KelolaCategoryItem {
  final String name;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  bool isPinned;

  KelolaCategoryItem({
    required this.name,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    this.isPinned = false,
  });
}

class KelolaCategoryScreen extends StatefulWidget {
  const KelolaCategoryScreen({super.key});

  @override
  State<KelolaCategoryScreen> createState() => _KelolaCategoryScreenState();
}

class _KelolaCategoryScreenState extends State<KelolaCategoryScreen> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  int _selectedIconIndex = 0;
  int _selectedColorIndex = 0;

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

  final List<KelolaCategoryItem> _categories = [
    KelolaCategoryItem(
      name: 'Makanan & Minum',
      subtitle: '5 Transaksi bulan ini · Rp 1.42j',
      icon: Icons.restaurant,
      iconColor: const Color(0xFF592314),
      isPinned: true,
    ),
    KelolaCategoryItem(
      name: 'Belanja & Supermarket',
      subtitle: '3 Transaksi bulan ini · Rp 1.2j',
      icon: Icons.shopping_cart,
      iconColor: const Color(0xFFD95B27),
    ),
    KelolaCategoryItem(
      name: 'Transportasi',
      subtitle: '4 Transaksi bulan ini · Rp 380rb',
      icon: Icons.directions_car,
      iconColor: const Color(0xFF8B6355),
    ),
    KelolaCategoryItem(
      name: 'Hiburan & Streaming',
      subtitle: '3 Transaksi bulan ini · Rp 200rb',
      icon: Icons.movie,
      iconColor: const Color(0xFFC1440E),
    ),
    KelolaCategoryItem(
      name: 'Edukasi & Buku',
      subtitle: '3 Transaksi bulan ini · Rp 200rb',
      icon: Icons.school,
      iconColor: const Color(0xFF6D4C41),
    ),
    KelolaCategoryItem(
      name: 'Kesehatan & Medis',
      subtitle: '3 Transaksi bulan ini · Rp 20rb',
      icon: Icons.local_hospital,
      iconColor: const Color(0xFF9C4221),
    ),
  ];

  List<KelolaCategoryItem> get _filteredCategories {
    final query = _searchController.text.toLowerCase();
    if (query.isEmpty) return _categories;
    return _categories.where((c) => c.name.toLowerCase().contains(query)).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _addCategory() {
    if (_nameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nama kategori tidak boleh kosong!')),
      );
      return;
    }
    final newCat = KelolaCategoryItem(
      name: _nameController.text.trim(),
      subtitle: '0 Transaksi bulan ini',
      icon: _availableIcons[_selectedIconIndex],
      iconColor: _availableColors[_selectedColorIndex],
    );
    setState(() {
      _categories.add(newCat);
      _nameController.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Kategori "${newCat.name}" berhasil ditambahkan!'),
        backgroundColor: AppColors.primaryBrown,
      ),
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
              child: SingleChildScrollView(
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
                          hintText: 'Cari nama kategori atau transaksi...',
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
                                'Buat Kategori Kustom',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: AppColors.textDark,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFFD4A017), Color(0xFFF5C842)],
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text(
                                  'Ekstra',
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Personalisasikan pengelolaan keuangan Anda',
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

                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Pilih Simbol Ikon',
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
                              ),
                              Text('+++', style: TextStyle(fontSize: 12, color: AppColors.primaryBrown.withOpacity(0.7))),
                            ],
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
                                        ? [BoxShadow(color: _availableColors[index].withOpacity(0.5), blurRadius: 6, spreadRadius: 1)]
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
                                color: _availableColors[_selectedColorIndex].withOpacity(0.08),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: _availableColors[_selectedColorIndex].withOpacity(0.2)),
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
                              onPressed: _addCategory,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primaryBrown,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              child: const Text('+ Tambah Kategori Ini'),
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
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Text(
                                      'Tips Kecerdasan Keuangan',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.textDark),
                                    ),
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: AppColors.greenAccent,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: const Text(
                                        '40% Akurasi',
                                        style: TextStyle(fontSize: 9, color: Colors.white, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'Membuat kategori spesifik meningkatkan akurasi analisis pengeluaran mingguan Anda hingga 40%.',
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
                          'Tahan & geser urutan',
                          style: TextStyle(fontSize: 10, color: AppColors.primaryBrown.withOpacity(0.8)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    ReorderableListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _filteredCategories.length,
                      onReorder: (oldIndex, newIndex) {
                        setState(() {
                          if (newIndex > oldIndex) newIndex--;
                          final item = _categories.removeAt(oldIndex);
                          _categories.insert(newIndex, item);
                        });
                      },
                      itemBuilder: (context, index) {
                        final cat = _filteredCategories[index];
                        return _buildCategoryTile(cat, key: ValueKey('${cat.name}$index'));
                      },
                    ),
                    const SizedBox(height: 80),
                  ],
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
            color: cat.iconColor.withOpacity(0.12),
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
            const Icon(Icons.edit_outlined, color: AppColors.textMuted, size: 18),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () => setState(() => _categories.removeWhere((c) => c == cat)),
              child: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 18),
            ),
          ],
        ),
      ),
    );
  }
}
