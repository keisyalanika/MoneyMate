import 'package:flutter/material.dart';
import '../utils/theme.dart'; // Memanggil palet warna dari utils/theme.dart

class AdjustBalanceBottomSheet extends StatefulWidget {
  final double currentBalance;
  final bool initialIsAdd;

  const AdjustBalanceBottomSheet({
    Key? key,
    this.currentBalance = 2450000,
    this.initialIsAdd = true,
  }) : super(key: key);

  static void show(BuildContext context, {bool isAdd = true}) {
    showModalBottomSheet(
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
  late int _selectedAmount;

  // Pilihan chip nominal cepat sesuai tab
  final List<int> _addOptions = [50000, 100000, 500000, 1000000];
  final List<int> _subtractOptions = [50000, 100000, 200000, 500000];

  @override
  void initState() {
    super.initState();
    _isAdd = widget.initialIsAdd;
    _selectedAmount = _isAdd ? 500000 : 200000;
  }

  String _formatCurrency(num value) {
    return value.toString().replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.');
  }

  String _formatChipLabel(int amount, bool isAdd) {
    String prefix = isAdd ? '+' : '-';
    if (amount >= 1000000) {
      return '$prefix${(amount / 1000000).toStringAsFixed(0)}ljt';
    } else {
      return '$prefix${(amount / 1000).toStringAsFixed(0)}rb';
    }
  }

  @override
  Widget build(BuildContext context) {
    double estimatedBalance = _isAdd
        ? widget.currentBalance + _selectedAmount
        : widget.currentBalance - _selectedAmount;

    final currentOptions = _isAdd ? _addOptions : _subtractOptions;

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
                          ? 'Sesuai kan atau perbarui langsung nominal saldo dompet kamu.'
                          : 'Kurangi atau koreksi nominal saldo dompet kamu dengan mudah.',
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
                            'Saldo saat ini: Rp ${_formatCurrency(widget.currentBalance)}',
                            style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFF8C827A),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF2EC),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: [
                          Text(
                            'Ubah',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.secondary,
                            ),
                          ),
                          Icon(
                            Icons.chevron_right,
                            size: 16,
                            color: AppColors.secondary,
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
                          onTap: () {
                            setState(() {
                              _isAdd = true;
                              _selectedAmount = 500000;
                            });
                          },
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
                          onTap: () {
                            setState(() {
                              _isAdd = false;
                              _selectedAmount = 200000;
                            });
                          },
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
                  _isAdd ? 'NOMINAL PENYESUAIAN' : 'NOMINAL PENGURANGAN',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF9E948C),
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 8),

                // Large Amount Display
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      _isAdd ? '+Rp' : '-Rp',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: _isAdd
                            ? const Color(0xFF00A86B)
                            : AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _formatCurrency(_selectedAmount),
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Quick Choice Chips
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: currentOptions.map((amount) {
                    final bool isSelected = _selectedAmount == amount;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedAmount = amount;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.primary
                                : const Color(0xFFF5F0EB),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: Text(
                              _formatChipLabel(amount, _isAdd),
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: isSelected
                                    ? Colors.white
                                    : const Color(0xFF70655D),
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
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
                            'Rp ${_formatCurrency(widget.currentBalance)}',
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
                                  : AppColors.primary,
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
              onPressed: () {
                // Logika Simpan
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                elevation: 4,
                shadowColor: AppColors.primary.withOpacity(0.3),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
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
    );
  }
}
