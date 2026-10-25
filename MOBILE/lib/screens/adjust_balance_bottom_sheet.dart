import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../services/auth_provider.dart';

class AdjustBalanceBottomSheet extends StatefulWidget {
  final double currentBalance;
  final bool initialIsAdd;

  const AdjustBalanceBottomSheet({
    super.key,
    this.currentBalance = 2450000,
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
  int _selectedAmount = 0;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _isAdd = widget.initialIsAdd;
  }

  @override
  void dispose() {
    _amountController.dispose();
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
                            onTap: () {
                              setState(() {
                                _isAdd = true;
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

                        setState(() => _isLoading = true);
                        final messenger = ScaffoldMessenger.of(context);
                        final navigator = Navigator.of(context);
                        final authProvider = Provider.of<AuthProvider>(context, listen: false);
                        await authProvider.adjustBalance(
                          isAdd: _isAdd,
                          amount: _selectedAmount.toDouble(),
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
