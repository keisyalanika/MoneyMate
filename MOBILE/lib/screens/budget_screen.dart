import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'kelola_kategori_screen.dart';

class BudgetScreen extends StatefulWidget {
  const BudgetScreen({super.key});

  @override
  State<BudgetScreen> createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  DateTime _currentDate = DateTime(2026, 9, 1);

  // List Anggaran Kategori
  late List<Map<String, dynamic>> _categories;

  @override
  void initState() {
    super.initState();
    _initData();
  }

  void _initData() {
    _categories = [
      {
        'id': 'cat-1',
        'title': 'Makanan & Minuman',
        'iconText': '🍔',
        'iconBg': const Color(0xFFFFF3ED),
        'limit': 1500000,
        'spent': 1575000,
        'percent': 105,
        'tag': 'Over 5% (+Rp 75k)',
        'tagBg': const Color(0xFFFFE5E0),
        'tagColor': const Color(0xFFD32F2F),
        'statusText': 'Melebihi kuota Rp 75.000',
        'statusColor': const Color(0xFFD32F2F),
        'statusIcon': Icons.access_time_rounded,
        'isOver': true,
        'actionLabel': 'Sesuaikan',
        'borderColor': const Color(0xFFFFCDC3),
      },
      {
        'id': 'cat-2',
        'title': 'Hiburan & Liburan',
        'iconText': '🎟️',
        'iconBg': const Color(0xFFFFF0F3),
        'limit': 500000,
        'spent': 550000,
        'percent': 110,
        'tag': 'Over 10% (+Rp 50k)',
        'tagBg': const Color(0xFFFFE5E0),
        'tagColor': const Color(0xFFD32F2F),
        'statusText': 'Melebihi kuota Rp 50.000',
        'statusColor': const Color(0xFFD32F2F),
        'statusIcon': Icons.access_time_rounded,
        'isOver': true,
        'actionLabel': 'Sesuaikan',
        'borderColor': const Color(0xFFFFCDC3),
      },
      {
        'id': 'cat-3',
        'title': 'Belanja Kebutuhan',
        'iconText': '🛍️',
        'iconBg': const Color(0xFFFFF9E6),
        'limit': 800000,
        'spent': 720000,
        'percent': 90,
        'tag': 'Tersisa Rp 80.000',
        'tagBg': const Color(0xFFFFF4D6),
        'tagColor': const Color(0xFFB78103),
        'statusText': 'Sisa 10% sebelum batas habis',
        'statusColor': const Color(0xFFB78103),
        'statusIcon': Icons.warning_amber_rounded,
        'isOver': false,
        'actionLabel': 'Detail',
        'borderColor': const Color(0xFFFFE9B6),
      },
      {
        'id': 'cat-4',
        'title': 'Transportasi & Ojol',
        'iconText': '🚗',
        'iconBg': const Color(0xFFEBF9F0),
        'limit': 600000,
        'spent': 300000,
        'percent': 50,
        'tag': 'Aman (50%)',
        'tagBg': const Color(0xFFE2F8E9),
        'tagColor': const Color(0xFF1B8A46),
        'statusText': 'Sesuai target pengeluaran',
        'statusColor': const Color(0xFF8C827A),
        'statusIcon': null,
        'isOver': false,
        'actionLabel': 'Kelola',
        'borderColor': const Color(0xFFD4F2DE),
      },
      {
        'id': 'cat-5',
        'title': 'Tagihan & Utilitas',
        'iconText': '⚡',
        'iconBg': const Color(0xFFF3E8FF),
        'limit': 100000,
        'spent': 705000,
        'percent': 705,
        'tag': 'Over (+Rp 605k)',
        'tagBg': const Color(0xFFFFE5E0),
        'tagColor': const Color(0xFFD32F2F),
        'statusText': 'Melebihi kuota Rp 605.000',
        'statusColor': const Color(0xFFD32F2F),
        'statusIcon': Icons.access_time_rounded,
        'isOver': true,
        'actionLabel': 'Sesuaikan',
        'borderColor': const Color(0xFFFFCDC3),
      },
    ];
  }

  int get totalSpent => _categories.fold(0, (sum, item) => sum + (item['spent'] as int));
  int get totalLimit => _categories.fold(0, (sum, item) => sum + (item['limit'] as int));

  String _formatRupiah(int number) {
    final formatter = NumberFormat('#,###', 'id_ID');
    return 'Rp ${formatter.format(number)}';
  }

  void _showEditBudgetSheet(Map<String, dynamic> category) {
    int targetAmount = (category['limit'] as int) < 1800000 ? 1800000 : (category['limit'] as int);
    double alertPercent = 85;
    final noteController = TextEditingController(text: 'Penyesuaian kebutuhan makan siang kantor');

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
                            color: category['iconBg'] as Color,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            category['iconText'] as String,
                            style: const TextStyle(fontSize: 22),
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
                                      category['title'] as String,
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
                                'Limit lama: ${_formatRupiah(category['limit'] as int)}',
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
                              _formatRupiah(category['spent'] as int),
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

                  // Rekomendasi AI Box
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF7ED),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFFFEDD5)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.lightbulb_outline_rounded, color: Color(0xFFD95B27), size: 18),
                        const SizedBox(width: 8),
                        Expanded(
                          child: RichText(
                            text: const TextSpan(
                              style: TextStyle(color: Color(0xFF7A2711), fontSize: 11, height: 1.4),
                              children: [
                                TextSpan(
                                  text: 'Rekomendasi MoneyMate AI: ',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                TextSpan(
                                  text:
                                      'Rata-rata 3 bln terakhir Rp 1.750.000. Limit disarankan Rp 1.800.000.',
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

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
                            Text(
                              NumberFormat('#,###', 'id_ID').format(targetAmount),
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2E150D),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Quick chips
                  Row(
                    children: [
                      _buildQuickAddChip('+100 rb', () {
                        setSheetState(() => targetAmount += 100000);
                      }, false),
                      const SizedBox(width: 10),
                      _buildQuickAddChip('+250 rb', () {
                        setSheetState(() => targetAmount += 250000);
                      }, true),
                      const SizedBox(width: 10),
                      _buildQuickAddChip('+500 rb', () {
                        setSheetState(() => targetAmount += 500000);
                      }, false),
                    ],
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

                  // Sumber Akun Terkait
                  const Text(
                    'Sumber Akun Terkait',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF2E150D),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE5DDD5)),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Dompet Utama & Tunai (Cash + BCA)',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF2E150D),
                          ),
                        ),
                        Icon(Icons.keyboard_arrow_down_rounded, color: Color(0xFF8C827A)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Catatan Revisi
                  const Text(
                    'Catatan Revisi (Opsional)',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF2E150D),
                    ),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: noteController,
                    decoration: InputDecoration(
                      hintText: 'Tulis catatan...',
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: const BorderSide(color: Color(0xFFE5DDD5)),
                      ),
                    ),
                    style: const TextStyle(fontSize: 13, color: Color(0xFF2E150D)),
                  ),
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
                      onPressed: () {
                        setState(() {
                          category['limit'] = targetAmount;
                          final double pct = ((category['spent'] as int) / targetAmount) * 100;
                          category['percent'] = pct.toInt();
                          if (pct > 100) {
                            category['isOver'] = true;
                            final overDiff = (category['spent'] as int) - targetAmount;
                            category['tag'] = 'Over ${(pct - 100).toInt()}% (+${_formatRupiah(overDiff)})';
                            category['statusText'] = 'Melebihi kuota ${_formatRupiah(overDiff)}';
                            category['statusColor'] = const Color(0xFFD32F2F);
                            category['borderColor'] = const Color(0xFFFFCDC3);
                          } else {
                            category['isOver'] = false;
                            final rem = targetAmount - (category['spent'] as int);
                            category['tag'] = 'Tersisa ${_formatRupiah(rem)}';
                            category['statusText'] = 'Sisa ${(100 - pct).toInt()}% sebelum batas habis';
                            category['statusColor'] = const Color(0xFFB78103);
                            category['borderColor'] = const Color(0xFFFFE9B6);
                          }
                        });

                        Navigator.pop(ctx);
                        _showSuccessModal(category['title'] as String, targetAmount);
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

  void _showSuccessModal(String categoryName, int newLimit) {
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
                    const TextSpan(text: ' berhasil diperbarui'),
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

            const Text(
              'Budget Berhasil Dibuat!',
              style: TextStyle(
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
                  _buildReceiptRow('Kategori', '🍔 $categoryName'),
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
                        child: const Text(
                          'Saat mencapai 80% & 100%',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF2E150D)),
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: Color(0xFFF0E5DF), height: 20),
                  _buildReceiptRow('Periode', '1 Sep – 30 Sep 2026'),
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
                  if (_categories.isNotEmpty) {
                    _showEditBudgetSheet(_categories[0]);
                  }
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
                          color: category['iconBg'] as Color,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Text(category['iconText'] as String, style: const TextStyle(fontSize: 20)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              category['title'] as String,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: Color(0xFF2E150D),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Batas: ${_formatRupiah(category['limit'] as int)} / bulan',
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
                        _formatRupiah(category['spent'] as int),
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
                      onPressed: () {
                        setState(() {
                          _categories.removeWhere((item) => item['id'] == category['id']);
                        });
                        Navigator.pop(ctx);
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
                            icon: const Icon(Icons.more_vert_rounded, size: 20, color: Color(0xFF2E150D)),
                            onPressed: () {},
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),

                    // Banner: PERINGATAN KUOTA
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF0ED),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFFFDDD5)),
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
                                  color: const Color(0xFFFFE0D8),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.warning_amber_rounded,
                                  color: Color(0xFFD32F2F),
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
                                        const Text(
                                          'PERINGATAN KUOTA',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            letterSpacing: 0.6,
                                            color: Color(0xFF942A19),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFD32F2F),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: const Text(
                                            'Kritis',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.white,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    const Text(
                                      '2 Kategori Melebihi Anggaran!',
                                      style: TextStyle(
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
                          const Text(
                            'Kategori Makanan & Hiburan melampaui limit. Pertimbangkan penyesuaian atau kurangi jajan non-esensial.',
                            style: TextStyle(fontSize: 11, color: Color(0xFF6B4E44), height: 1.4),
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
                              const Text(
                                'TOTAL TERPAKAI BULAN INI',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.8,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF5A271B),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.circle, size: 6, color: Color(0xFFFF7A68)),
                                    SizedBox(width: 4),
                                    Text(
                                      '110% Overbudget',
                                      style: TextStyle(
                                        color: Color(0xFFFF9E91),
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
                                      '- ${_formatRupiah(totalSpent > totalLimit ? totalSpent - totalLimit : 0)}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFFFF7A68),
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    const Text(
                                      'Defisit',
                                      style: TextStyle(fontSize: 10, color: Colors.white70),
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
                                widthFactor: 1.0,
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

                          const Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('0%', style: TextStyle(color: Colors.white60, fontSize: 10)),
                              Text('50%', style: TextStyle(color: Colors.white60, fontSize: 10)),
                              Text('100% Limit', style: TextStyle(color: Colors.white70, fontSize: 10)),
                              Text(
                                '110% (Jebol)',
                                style: TextStyle(
                                  color: Color(0xFFFF9E91),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
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
                            onPressed: () {
                              setState(() {
                                _currentDate = DateTime(_currentDate.year, _currentDate.month - 1);
                              });
                            },
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
                            onPressed: () {
                              setState(() {
                                _currentDate = DateTime(_currentDate.year, _currentDate.month + 1);
                              });
                            },
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
                      child: const Text(
                        'Semua (5)',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
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
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const KelolaKategoriScreen()),
                            );
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
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _categories.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final item = _categories[index];
                        final bool isOver = item['isOver'] as bool;
                        final double progressRatio = ((item['spent'] as int) / (item['limit'] as int)).clamp(0.0, 1.0);

                        return Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: item['borderColor'] as Color),
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
                                      color: item['iconBg'] as Color,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      item['iconText'] as String,
                                      style: const TextStyle(fontSize: 20),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item['title'] as String,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                            color: Color(0xFF2E150D),
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          'Batas: ${_formatRupiah(item['limit'] as int)}',
                                          style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: item['tagBg'] as Color,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      item['tag'] as String,
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: item['tagColor'] as Color,
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
                                        _formatRupiah(item['spent'] as int),
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: isOver
                                              ? const Color(0xFFD32F2F)
                                              : (item['percent'] as int) > 80
                                                  ? const Color(0xFFE68A00)
                                                  : const Color(0xFF2E150D),
                                        ),
                                      ),
                                      Text(
                                        ' / ${_formatLimitShort(item['limit'] as int)}',
                                        style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                                      ),
                                    ],
                                  ),
                                  Text(
                                    item['id'] == 'cat-4' ? 'Sisa Rp 300 rb' : '${item['percent']}%',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                      color: isOver
                                          ? const Color(0xFFD32F2F)
                                          : (item['percent'] as int) > 80
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
                                            : (item['percent'] as int) > 80
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
                                          color: item['statusColor'] as Color,
                                        ),
                                        const SizedBox(width: 4),
                                      ],
                                      Text(
                                        item['statusText'] as String,
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                          color: item['statusColor'] as Color,
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
                                          item['actionLabel'] as String,
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
                                          item['actionLabel'] as String,
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
                    if (_categories.isNotEmpty) {
                      _showEditBudgetSheet(_categories[0]);
                    }
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

  String _formatLimitShort(int limit) {
    if (limit >= 1000000) {
      final double val = limit / 1000000;
      return 'Rp ${val.toStringAsFixed(val.truncateToDouble() == val ? 0 : 1)} jt';
    } else {
      final int val = limit ~/ 1000;
      return 'Rp $val rb';
    }
  }
}
