import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/auth_provider.dart';
import '../utils/currency_formatter.dart';
import '../utils/theme.dart';
import 'goal_funds_success_modal.dart';

class AddGoalFundsScreen extends StatefulWidget {
  final Map<String, dynamic> goal;

  const AddGoalFundsScreen({super.key, required this.goal});

  @override
  State<AddGoalFundsScreen> createState() => _AddGoalFundsScreenState();
}

class _AddGoalFundsScreenState extends State<AddGoalFundsScreen> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _noteController = TextEditingController();

  double _availableBalance = 0;
  bool _isLoadingWallets = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadWallets();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  double get _collected =>
      double.tryParse('${widget.goal['current_amount'] ?? 0}') ?? 0.0;

  double get _target =>
      double.tryParse('${widget.goal['target_amount'] ?? 0}') ?? 0.0;

  double get _shortage => (_target - _collected).clamp(0.0, double.infinity);

  double get _amount {
    final digits = _amountController.text.replaceAll(RegExp(r'[^0-9]'), '');
    return double.tryParse(digits) ?? 0.0;
  }

  double get _projectedAmount {
    final projected = _collected + _amount;
    return projected > _target && _target > 0 ? _target : projected;
  }

  double get _projectedProgress =>
      _target > 0 ? (_projectedAmount / _target).clamp(0.0, 1.0) : 0.0;

  String get _goalTitle => widget.goal['title']?.toString() ?? 'Target Impian';

  IconData get _goalIcon {
    switch (widget.goal['icon']?.toString().toLowerCase()) {
      case 'laptop':
        return Icons.laptop_mac;
      case 'flight':
        return Icons.flight_takeoff;
      case 'car':
        return Icons.directions_car;
      case 'home':
        return Icons.home;
      case 'savings':
        return Icons.savings;
      case 'diamond':
        return Icons.diamond;
      default:
        return Icons.flag;
    }
  }

  String _formatRp(num value) => CurrencyFormatter.formatRupiah(value);

  Future<void> _loadWallets() async {
    setState(() => _isLoadingWallets = true);
    final result = await ApiService.fetchWallets();

    double total = 0;
    if (result['success'] == true) {
      final rawList = result['data'];
      if (rawList is List) {
        for (final item in rawList) {
          if (item is Map) {
            total += double.tryParse('${item['balance'] ?? 0}') ?? 0;
          }
        }
      }
      final reportedTotal = result['totalBalance'];
      if (reportedTotal is num) {
        total = reportedTotal.toDouble();
      } else if (reportedTotal != null) {
        total = double.tryParse('$reportedTotal') ?? total;
      }
    }

    if (!mounted) return;
    setState(() {
      _availableBalance = total;
      _isLoadingWallets = false;
    });
  }

  void _setAmount(double amount) {
    _amountController.text = CurrencyFormatter.formatDots(amount);
    setState(() {});
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();

    final amount = _amount;
    if (amount <= 0) {
      _showError('Masukkan nominal setoran terlebih dahulu.');
      return;
    }
    if (_availableBalance < amount) {
      _showError(
        'Saldo aktif tidak cukup. Saldo tersedia ${_formatRp(_availableBalance)}.',
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final result = await ApiService.addGoalFund(
      goalId: widget.goal['id'],
      amount: amount,
      note: _noteController.text.trim().isEmpty
          ? 'Setoran tabungan'
          : _noteController.text.trim(),
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result['success'] == true) {
      try {
        await Provider.of<AuthProvider>(context, listen: false).fetchWallets();
      } catch (_) {}
      if (!mounted) return;

      final newAmount =
          double.tryParse('${result['current_amount']}') ?? (_collected + amount);
      showGoalFundsSuccessModal(
        context: context,
        goalTitle: _goalTitle,
        amount: amount,
        currentAmount: newAmount,
        targetAmount: _target,
        onDone: () => Navigator.pop(context, true),
      );
    } else {
      _showError(result['message']?.toString() ?? 'Gagal menyetor dana.');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: const Color(0xFFDC2626),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCF9F5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF2C1A14), size: 24),
          onPressed: () => Navigator.pop(context),
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
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: Color(0xFFB35A43),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'ALOKASI DANA • ${_goalTitle.toUpperCase()}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF5A4A42),
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9EFEA),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.check_circle_outline, size: 12, color: Color(0xFFB35A43)),
                      SizedBox(width: 4),
                      Text(
                        'Goal Aktif',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFB35A43),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildGoalSummaryCard(),
            const SizedBox(height: 24),
            _buildAmountCard(),
            const SizedBox(height: 20),
            _buildProjectionCard(),
            const SizedBox(height: 20),
            _buildWalletCard(),
            const SizedBox(height: 20),
            _buildNoteCard(),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8A3A23),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                  elevation: 0,
                ),
                onPressed: _isSubmitting ? null : _submit,
                child: _isSubmitting
                    ? const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.check_circle_outline, color: Colors.white, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Konfirmasi Setor Dana',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.arrow_back, color: Color(0xFF8A3A23), size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Kembali ke Detail Goal',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF8A3A23),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalSummaryCard() {
    final progress = _target > 0 ? (_collected / _target).clamp(0.0, 1.0) : 0.0;
    return Container(
      padding: const EdgeInsets.all(16),
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
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: Color(0xFF5A3E2B),
                  shape: BoxShape.circle,
                ),
                child: Icon(_goalIcon, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _goalTitle,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2C1A14),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Target ${_formatRp(_target)}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF8C827A),
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '${(progress * 100).toStringAsFixed(0)}%',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFB35A43),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: const Color(0xFFEFE8E1),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF5A3E2B)),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Terkumpul ${_formatRp(_collected)}',
                style: const TextStyle(fontSize: 11, color: Color(0xFF5A4A42)),
              ),
              Text(
                'Kurang ${_formatRp(_shortage)}',
                style: const TextStyle(fontSize: 11, color: Color(0xFFB35A43)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAmountCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'NOMINAL TAMBAH DANA',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: Color(0xFF8C827A),
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Text(
                'Rp ',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFB3B3B3),
                ),
              ),
              Expanded(
                child: TextField(
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    ThousandsSeparatorInputFormatter(),
                  ],
                  onChanged: (_) => setState(() {}),
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF3E2723),
                  ),
                  decoration: const InputDecoration(
                    hintText: '0',
                    hintStyle: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFFB3B3B3),
                    ),
                    border: InputBorder.none,
                    isDense: true,
                  ),
                ),
              ),
              if (_amount > 0)
                GestureDetector(
                  onTap: () {
                    _amountController.clear();
                    setState(() {});
                  },
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(
                      color: Color(0xFFF3EBE3),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.close, size: 16, color: Color(0xFF8C827A)),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: _buildQuickAmountChip('+ Rp 250.000', 250000)),
              const SizedBox(width: 8),
              Expanded(child: _buildQuickAmountChip('+ Rp 500.000', 500000)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: _buildQuickAmountChip('+ Rp 1.000.000', 1000000)),
              const SizedBox(width: 8),
              Expanded(
                child: GestureDetector(
                  onTap: () => _setAmount(_shortage),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF9EFEA),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.flash_on, size: 14, color: Color(0xFFB35A43)),
                        SizedBox(width: 4),
                        Text(
                          'Lunasi Sisa',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFB35A43),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAmountChip(String label, double amount) {
    return GestureDetector(
      onTap: () => _setAmount(amount),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFF8F4F1),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Center(
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: Color(0xFF5A4A42),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProjectionCard() {
    final projected = _projectedAmount;
    final projectedPct = _projectedProgress * 100;
    final remaining = (_target - projected).clamp(0.0, double.infinity);
    final amount = _amount;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF6EFE9),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.auto_awesome, size: 16, color: Color(0xFF5A4A42)),
                  SizedBox(width: 8),
                  Text(
                    'AI FINANCIAL COPILOT',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF8C827A),
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8DCD1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${(_target > 0 ? (_collected / _target * 100) : 0).toStringAsFixed(0)}% → ${projectedPct.toStringAsFixed(1)}%',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF5A4A42),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            amount <= 0
                ? 'Masukkan nominal setoran untuk melihat proyeksi progres goal kamu.'
                : 'Dengan menambah ${_formatRp(amount)} hari ini, progres goal kamu naik menjadi ${projectedPct.toStringAsFixed(1)}%. Kamu tinggal butuh ${_formatRp(remaining)} lagi.',
            style: const TextStyle(
              fontSize: 13,
              color: Color(0xFF5A4A42),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: _target > 0 ? (projected / _target).clamp(0.0, 1.0) : 0.0,
                    minHeight: 6,
                    backgroundColor: const Color(0xFFDCD1C5),
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF8A3A23)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Sisa ${_formatRp(remaining)}',
                style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWalletCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SUMBER DANA TABUNGAN',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: Color(0xFF8C827A),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Dana diambil dari total saldo aktif di halaman utama.',
            style: TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
          ),
          const SizedBox(height: 16),
          if (_isLoadingWallets)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(12),
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.primaryBrown,
                ),
              ),
            )
          else
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF9EFEA),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _amount > 0 && _amount > _availableBalance
                      ? const Color(0xFFDC2626)
                      : const Color(0xFFB35A43),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: Color(0xFF5A3E2B),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.account_balance_wallet,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Saldo Aktif MoneyMate',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF2C1A14),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Tersedia ${_formatRp(_availableBalance)}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF8C827A),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.check_circle,
                    color: Color(0xFF5A3E2B),
                    size: 22,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNoteCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'CATATAN SETORAN (OPSIONAL)',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF8C827A),
                ),
              ),
              Text(
                '${_noteController.text.length}/100',
                style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _noteController,
            maxLength: 100,
            maxLines: 3,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: 'Contoh: Tabungan dari bonus freelance',
              hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF8C827A)),
              counterText: '',
              filled: true,
              fillColor: const Color(0xFFF8F4F1),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.all(16),
            ),
            style: const TextStyle(fontSize: 13, color: Color(0xFF5A4A42)),
          ),
        ],
      ),
    );
  }
}
