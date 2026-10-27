import 'package:flutter/material.dart';

class KelolaKategoriScreen extends StatefulWidget {
  const KelolaKategoriScreen({super.key});

  @override
  State<KelolaKategoriScreen> createState() => _KelolaKategoriScreenState();
}

class _CategoryItem {
  String id;
  String name;
  IconData icon;
  Color color;
  String colorName;
  int transactionCount;
  int totalAmount;

  _CategoryItem({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
    required this.colorName,
    required this.transactionCount,
    required this.totalAmount,
  });
}

class _KelolaKategoriScreenState extends State<KelolaKategoriScreen> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();

  // Daftar Pilihan Simbol Ikon
  final List<Map<String, dynamic>> _iconList = [
    {'icon': Icons.spa_outlined, 'name': 'spa'},
    {'icon': Icons.account_balance_wallet_outlined, 'name': 'dompet'},
    {'icon': Icons.local_cafe_outlined, 'name': 'kafe'},
    {'icon': Icons.sports_esports_outlined, 'name': 'game'},
    {'icon': Icons.open_in_full_outlined, 'name': 'ekspansi'},
    {'icon': Icons.menu_book_outlined, 'name': 'buku'},
    {'icon': Icons.medication_outlined, 'name': 'medis'},
    {'icon': Icons.directions_car_outlined, 'name': 'mobil'},
    {'icon': Icons.currency_bitcoin_outlined, 'name': 'kripto'},
    {'icon': Icons.flight_outlined, 'name': 'travel'},
    {'icon': Icons.pets_outlined, 'name': 'hewan'},
    {'icon': Icons.devices_outlined, 'name': 'gadget'},
  ];

  // Daftar Warna Aksen Palet
  final List<Map<String, dynamic>> _colorList = [
    {'color': const Color(0xFF8A3A23), 'name': 'Terracotta'},
    {'color': const Color(0xFF6B2A18), 'name': 'Rust'},
    {'color': const Color(0xFFB88A6E), 'name': 'Karamel'},
    {'color': const Color(0xFF6E9C7E), 'name': 'Sage'},
    {'color': const Color(0xFFF38C6D), 'name': 'Coral'},
  ];

  int _selectedIconIndex = 0;
  int _selectedColorIndex = 0;

  // Daftar Kategori Aktif
  late List<_CategoryItem> _categories;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _categories = [
      _CategoryItem(
        id: '1',
        name: 'Makanan & Minuman',
        icon: Icons.restaurant_outlined,
        color: const Color(0xFF8A3A23),
        colorName: 'Terracotta',
        transactionCount: 8,
        totalAmount: 1420000,
      ),
      _CategoryItem(
        id: '2',
        name: 'Belanja & Supermarket',
        icon: Icons.shopping_bag_outlined,
        color: const Color(0xFFB88A6E),
        colorName: 'Karamel',
        transactionCount: 5,
        totalAmount: 850000,
      ),
      _CategoryItem(
        id: '3',
        name: 'Transportasi',
        icon: Icons.directions_bus_outlined,
        color: const Color(0xFF6B2A18),
        colorName: 'Rust',
        transactionCount: 4,
        totalAmount: 380000,
      ),
      _CategoryItem(
        id: '4',
        name: 'Hiburan & Streaming',
        icon: Icons.movie_outlined,
        color: const Color(0xFFF38C6D),
        colorName: 'Coral',
        transactionCount: 3,
        totalAmount: 450000,
      ),
      _CategoryItem(
        id: '5',
        name: 'Edukasi & Buku',
        icon: Icons.menu_book_outlined,
        color: const Color(0xFF6E9C7E),
        colorName: 'Sage',
        transactionCount: 2,
        totalAmount: 200000,
      ),
      _CategoryItem(
        id: '6',
        name: 'Kesehatan & Medis',
        icon: Icons.shield_outlined,
        color: const Color(0xFF5F9E7D),
        colorName: 'Sage',
        transactionCount: 1,
        totalAmount: 120000,
      ),
    ];
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  String _formatCurrency(int amount) {
    if (amount >= 1000000) {
      final double val = amount / 1000000;
      return 'Rp ${val.toStringAsFixed(val.truncateToDouble() == val ? 0 : 2)} jt';
    } else {
      final int val = amount ~/ 1000;
      return 'Rp $val rb';
    }
  }

  void _addNewCategory() {
    final text = _nameController.text.trim();
    if (text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan masukkan nama kategori terlebih dahulu.'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() {
      _categories.insert(
        0,
        _CategoryItem(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          name: text,
          icon: _iconList[_selectedIconIndex]['icon'] as IconData,
          color: _colorList[_selectedColorIndex]['color'] as Color,
          colorName: _colorList[_selectedColorIndex]['name'] as String,
          transactionCount: 0,
          totalAmount: 0,
        ),
      );
      _nameController.clear();
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Kategori "$text" berhasil ditambahkan!'),
        backgroundColor: const Color(0xFF8A3A23),
      ),
    );
  }

  void _showEditCategoryDialog(_CategoryItem item) {
    final editController = TextEditingController(text: item.name);
    int editColorIndex = _colorList.indexWhere((c) => c['name'] == item.colorName);
    if (editColorIndex == -1) editColorIndex = 0;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Text(
              'Ubah Kategori',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Color(0xFF2C1A14),
              ),
            ),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Nama Kategori', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                  const SizedBox(height: 6),
                  TextField(
                    controller: editController,
                    decoration: InputDecoration(
                      hintText: 'Nama kategori...',
                      filled: true,
                      fillColor: const Color(0xFFF9F6F0),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFEDE4D8)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFFEDE4D8)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text('Warna Aksen', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: List.generate(_colorList.length, (idx) {
                      final c = _colorList[idx]['color'] as Color;
                      final isSel = idx == editColorIndex;
                      return GestureDetector(
                        onTap: () => setDialogState(() => editColorIndex = idx),
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: c,
                            shape: BoxShape.circle,
                            border: isSel ? Border.all(color: Colors.white, width: 2) : null,
                            boxShadow: isSel
                                ? [BoxShadow(color: c.withValues(alpha: 0.5), blurRadius: 6, spreadRadius: 1)]
                                : null,
                          ),
                          child: isSel ? const Icon(Icons.check, color: Colors.white, size: 20) : null,
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Batal', style: TextStyle(color: Colors.grey)),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8A3A23),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  final newName = editController.text.trim();
                  if (newName.isNotEmpty) {
                    setState(() {
                      item.name = newName;
                      item.color = _colorList[editColorIndex]['color'] as Color;
                      item.colorName = _colorList[editColorIndex]['name'] as String;
                    });
                    Navigator.pop(ctx);
                  }
                },
                child: const Text('Simpan', style: TextStyle(color: Colors.white)),
              ),
            ],
          );
        },
      ),
    );
  }

  void _confirmDeleteCategory(_CategoryItem item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Hapus Kategori?'),
        content: Text('Kategori "${item.name}" akan dihapus dari daftar aktif Anda.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              setState(() {
                _categories.removeWhere((c) => c.id == item.id);
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Kategori "${item.name}" telah dihapus.')),
              );
            },
            child: const Text('Hapus', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredCategories = _categories.where((c) {
      if (_searchQuery.isEmpty) return true;
      return c.name.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF2C1A14), size: 24),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          'Tambah Dana Tabungan',
          style: TextStyle(
            color: Color(0xFF2C1A14),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: false,
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF2C1A14)),
              ),
              child: const Icon(Icons.question_mark, color: Color(0xFF2C1A14), size: 14),
            ),
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  backgroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  title: const Text('Struktur Anggaran'),
                  content: const Text(
                    'Kelola kategori pengeluaran Anda untuk mempermudah alokasi tabungan dan audit cerdas dengan AI.',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Mengerti', style: TextStyle(color: Color(0xFF8A3A23))),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Subtitle & Header Kelola Kategori
              const Text(
                'STRUKTUR ANGGARAN',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: Color(0xFF8A3A23),
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Kelola Kategori',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2C1A14),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF38180E),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.add_circle_outline, color: Colors.white, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'Kategori Baru',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Search Bar
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFEDE4D8)),
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: const InputDecoration(
                    hintText: 'Cari nama kategori atau transaksi...',
                    hintStyle: TextStyle(fontSize: 13, color: Color(0xFF9E9285)),
                    prefixIcon: Icon(Icons.search, color: Color(0xFF9E9285), size: 20),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Card: Buat Kategori Kustom
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFEDE4D8)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Card
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: const BoxDecoration(
                            color: Color(0xFFFBECE5),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.palette_outlined,
                            color: Color(0xFF8A3A23),
                            size: 22,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Buat Kategori Kustom',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF2C1A14),
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Sesuaikan pengelompokan pengeluaran Anda',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF8C827A),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF0EBE4),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'Ekstra',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF6B5E55),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),

                    // Field: Nama Kategori
                    const Text(
                      'Nama Kategori',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF2C1A14),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF7F3EE),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE5DDD2)),
                      ),
                      child: TextField(
                        controller: _nameController,
                        style: const TextStyle(fontSize: 14, color: Color(0xFF2C1A14)),
                        decoration: const InputDecoration(
                          hintText: 'Contoh: Skincare & Self-Care',
                          hintStyle: TextStyle(fontSize: 13, color: Color(0xFFA59B91)),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          suffixIcon: Padding(
                            padding: EdgeInsets.only(right: 14),
                            child: Align(
                              alignment: Alignment.centerRight,
                              widthFactor: 1,
                              child: Text(
                                'Aa',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFFA59B91),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Pilih Simbol Ikon
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Pilih Simbol Ikon',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF2C1A14),
                          ),
                        ),
                        Text(
                          _iconList[_selectedIconIndex]['name'] as String,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF8A3A23),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Grid Ikon 2 baris 6 kolom
                    LayoutBuilder(
                      builder: (context, constraints) {
                        final double itemSize = (constraints.maxWidth - (5 * 8)) / 6;
                        return Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: List.generate(_iconList.length, (idx) {
                            final isSel = idx == _selectedIconIndex;
                            return GestureDetector(
                              onTap: () => setState(() => _selectedIconIndex = idx),
                              child: Container(
                                width: itemSize,
                                height: itemSize,
                                decoration: BoxDecoration(
                                  color: isSel ? const Color(0xFFFBECE5) : const Color(0xFFF6F2EC),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: isSel ? const Color(0xFF4A2511) : Colors.transparent,
                                    width: isSel ? 1.5 : 1,
                                  ),
                                ),
                                child: Icon(
                                  _iconList[idx]['icon'] as IconData,
                                  size: 20,
                                  color: isSel ? const Color(0xFF4A2511) : const Color(0xFF6B5E55),
                                ),
                              ),
                            );
                          }),
                        );
                      },
                    ),
                    const SizedBox(height: 18),

                    // Warna Aksen Palet
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Warna Aksen Palet',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF2C1A14),
                          ),
                        ),
                        Text(
                          _colorList[_selectedColorIndex]['name'] as String,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF8A3A23),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: List.generate(_colorList.length, (idx) {
                        final isSel = idx == _selectedColorIndex;
                        final color = _colorList[idx]['color'] as Color;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedColorIndex = idx),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              height: 38,
                              decoration: BoxDecoration(
                                color: color,
                                borderRadius: BorderRadius.circular(20),
                                border: isSel
                                    ? Border.all(color: const Color(0xFF2C1A14), width: 2)
                                    : null,
                                boxShadow: isSel
                                    ? [
                                        BoxShadow(
                                          color: color.withValues(alpha: 0.4),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        )
                                      ]
                                    : null,
                              ),
                              child: isSel
                                  ? const Icon(Icons.check, color: Colors.white, size: 20)
                                  : null,
                            ),
                          ),
                        );
                      }),
                    ),
                    const SizedBox(height: 20),

                    // Tombol Tambah Kategori Ini
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF8A3A23),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        onPressed: _addNewCategory,
                        icon: const Icon(Icons.add, color: Colors.white, size: 18),
                        label: const Text(
                          'Tambah Kategori Ini',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Card: Tips Kecerdasan Keuangan
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF5F0),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFD6E8D9)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: const BoxDecoration(
                        color: Color(0xFFD1EBD6),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.auto_awesome,
                        color: Color(0xFF2E6B3F),
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'Tips Kecerdasan Keuangan',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF1E3A24),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFC8E6CE),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  '+40% Akurasi',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF1E5B2E),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Mengelompokkan pengeluaran ke dalam kategori spesifik meningkatkan akurasi analisis pengeluaran mingguan Anda hingga 40%.',
                            style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFF4A6B53),
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Header: DAFTAR KATEGORI AKTIF
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'DAFTAR KATEGORI AKTIF',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.6,
                      color: Color(0xFF2C1A14),
                    ),
                  ),
                  Text(
                    'Tahan & geser urutan',
                    style: TextStyle(
                      fontSize: 11,
                      color: Color(0xFF8C827A),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Reorderable List Kategori
              ReorderableListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: filteredCategories.length,
                onReorderItem: (oldIndex, newIndex) {
                  setState(() {
                    final item = filteredCategories.removeAt(oldIndex);
                    filteredCategories.insert(newIndex, item);
                    _categories = List.from(filteredCategories);
                  });
                },
                itemBuilder: (context, index) {
                  final cat = filteredCategories[index];
                  return Container(
                    key: ValueKey(cat.id),
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFEDE4D8)),
                    ),
                    child: Row(
                      children: [
                        // Drag Handle
                        const Icon(
                          Icons.drag_indicator,
                          color: Color(0xFFBFB3A4),
                          size: 20,
                        ),
                        const SizedBox(width: 10),

                        // Icon Container
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: cat.color.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(cat.icon, color: cat.color, size: 22),
                        ),
                        const SizedBox(width: 12),

                        // Title & Subtitle
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Flexible(
                                    child: Text(
                                      cat.name,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF2C1A14),
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: BoxDecoration(
                                      color: cat.color,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${cat.transactionCount} Transaksi bulan ini • ${_formatCurrency(cat.totalAmount)}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF8C827A),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),

                        // Edit Button
                        IconButton(
                          icon: const Icon(Icons.edit_outlined, size: 18, color: Color(0xFF6B5E55)),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                          onPressed: () => _showEditCategoryDialog(cat),
                        ),

                        // Delete Button
                        IconButton(
                          icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFBFB3A4)),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                          onPressed: () => _confirmDeleteCategory(cat),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

// Compatibility typedefs
typedef KelolaCategoryScreen = KelolaKategoriScreen;
typedef KelolaCategoryItem = _CategoryItem;
