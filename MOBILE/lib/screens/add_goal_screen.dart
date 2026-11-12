import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../services/auth_provider.dart';
import '../utils/theme.dart';
import '../utils/currency_formatter.dart';
import '../services/api_service.dart';
import '../services/draft_goal_service.dart';
import 'goal_draft_success_modal.dart';

class AddGoalScreen extends StatefulWidget {
  final Map<String, dynamic>? initialDraft;
  const AddGoalScreen({super.key, this.initialDraft});

  @override
  State<AddGoalScreen> createState() => _AddGoalScreenState();
}

class _AddGoalScreenState extends State<AddGoalScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _initialDepositController = TextEditingController();
  
  bool _autoReminder = true;
  bool _isSaving = false;
  IconData _selectedIcon = Icons.laptop_mac;
  DateTime _selectedDeadline = DateTime.now().add(const Duration(days: 120));

  @override
  void initState() {
    super.initState();
    if (widget.initialDraft != null) {
      final draft = widget.initialDraft!;
      _nameController.text = draft['title']?.toString() ?? '';
      if (draft['target_amount'] != null) {
        final double amt = double.tryParse('${draft['target_amount']}') ?? 0.0;
        if (amt > 0) {
          _amountController.text = CurrencyFormatter.formatDots(amt);
        }
      }
      if (draft['initial_deposit'] != null) {
        final double initAmt = double.tryParse('${draft['initial_deposit']}') ?? 0.0;
        if (initAmt > 0) {
          _initialDepositController.text = CurrencyFormatter.formatDots(initAmt);
        }
      }
      if (draft['icon'] != null) {
        _selectedIcon = _getIconFromKey(draft['icon']);
      }
      if (draft['deadline'] != null && draft['deadline'].toString().isNotEmpty) {
        try {
          _selectedDeadline = DateTime.parse(draft['deadline'].toString());
        } catch (_) {}
      }
    }
    _nameController.addListener(_onFormChanged);
    _amountController.addListener(_onFormChanged);
    _initialDepositController.addListener(_onFormChanged);
  }

  void _onFormChanged() {
    if (mounted) setState(() {});
  }

  double _parseMoney(String text) {
    final digits = text.replaceAll(RegExp(r'[^0-9]'), '');
    return double.tryParse(digits) ?? 0.0;
  }

  int get _monthsUntilDeadline {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(
      _selectedDeadline.year,
      _selectedDeadline.month,
      _selectedDeadline.day,
    );
    final days = target.difference(today).inDays;
    if (days <= 0) return 0;
    return (days / 30).ceil();
  }

  String _formatRp(num value) => CurrencyFormatter.formatRupiah(value);

  IconData _getIconFromKey(dynamic key) {
    switch (key?.toString().toLowerCase()) {
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
        return Icons.laptop_mac;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _amountController.dispose();
    _initialDepositController.dispose();
    super.dispose();
  }

  String _getMonthName(int month) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
  }

  String _formatDate(DateTime date) {
    return '${date.day} ${_getMonthName(date.month)} ${date.year}';
  }

  String _getRemainingBadgeText(DateTime deadline) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(deadline.year, deadline.month, deadline.day);
    final diffDays = target.difference(today).inDays;

    if (diffDays <= 0) {
      return 'Hari Ini';
    } else if (diffDays < 30) {
      return 'Sisa $diffDays Hari';
    } else {
      final months = (diffDays / 30).round();
      if (months <= 1) {
        return 'Sisa 1 Bulan';
      }
      return 'Sisa $months Bulan';
    }
  }

  String _getIconName(IconData icon) {
    if (icon == Icons.laptop_mac) return 'laptop';
    if (icon == Icons.flight_takeoff) return 'flight';
    if (icon == Icons.directions_car) return 'car';
    if (icon == Icons.home) return 'home';
    if (icon == Icons.savings) return 'savings';
    if (icon == Icons.diamond) return 'diamond';
    return 'flag';
  }

  Future<void> _selectDeadline() async {
    final now = DateTime.now();
    final initialDate = _selectedDeadline.isAfter(now)
        ? _selectedDeadline
        : now.add(const Duration(days: 1));

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(now.year, now.month, now.day),
      lastDate: DateTime(2101),
      helpText: 'PILIH TARGET WAKTU SELESAI',
      cancelText: 'BATAL',
      confirmText: 'PILIH',
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

    if (picked != null) {
      setState(() {
        _selectedDeadline = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF7),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFDFBF7),
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.arrow_back, color: AppColors.textDark, size: 20),
            ),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        title: Column(
          children: const [
            Text(
              'Buat Goal Baru',
              style: TextStyle(
                color: AppColors.textDark,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            Text(
              'LANGKAH 1 DARI 2 • IMPIAN FINANSIAL',
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 10,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline, color: AppColors.textMuted),
            tooltip: 'Petunjuk Buat Goal',
            onPressed: () {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  title: Row(
                    children: const [
                      Icon(Icons.tips_and_updates, color: AppColors.accentOrange, size: 22),
                      SizedBox(width: 8),
                      Text('Panduan Membuat Goal', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  content: const Text(
                    'Isi nama impianmu (contoh: Beli Laptop Baru) dan target nominal yang ingin dicapai.\n\nKamu juga bisa menyetor saldo awal atau menyalakan pengingat otomatis agar progres tabunganmu terpantau konsisten.',
                    style: TextStyle(fontSize: 12, height: 1.4),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Mengerti', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryBrown)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon Selector Section
            Center(
              child: Stack(
                alignment: Alignment.bottomRight,
                children: [
                  Container(
                    width: 90,
                    height: 90,
                    decoration: const BoxDecoration(
                      color: AppColors.primaryBrown,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(_selectedIcon, color: Colors.white, size: 40),
                  ),
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFFDFBF7), width: 3),
                    ),
                    child: const Icon(Icons.palette_outlined, size: 16, color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const Center(
              child: Text(
                'Pilih Simbol Impian',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textDark),
              ),
            ),
            const Center(
              child: Text(
                'Ikon yang mewakili aspirasi masa depanmu',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildIconOption(Icons.laptop_mac),
                _buildIconOption(Icons.flight_takeoff),
                _buildIconOption(Icons.directions_car),
                _buildIconOption(Icons.home),
                _buildIconOption(Icons.savings),
                _buildIconOption(Icons.diamond),
              ],
            ),
            const SizedBox(height: 32),

            // Form Fields
            _buildSection(
              title: 'Nama Target Finansial',
              child: _buildTextField(
                controller: _nameController,
                hint: 'MacBook Pro M3 Max',
                icon: Icons.flag_outlined,
              ),
            ),

            _buildSection(
              title: 'Target Nominal',
              trailing: const Text('Tercapai Lebih Cepat', style: TextStyle(color: AppColors.secondary, fontSize: 10, fontWeight: FontWeight.bold)),
              child: _buildTextField(
                controller: _amountController,
                hint: '15.000.000',
                prefixText: 'Rp ',
                isNumber: true,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),

            _buildSection(
              title: 'Target Waktu Selesai',
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFECE0),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _getRemainingBadgeText(_selectedDeadline),
                  style: const TextStyle(color: AppColors.secondary, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
              child: InkWell(
                onTap: _selectDeadline,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F0EB),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_outlined, color: AppColors.textMuted, size: 18),
                          const SizedBox(width: 12),
                          Text(
                            _formatDate(_selectedDeadline),
                            style: const TextStyle(color: AppColors.textDark, fontSize: 14),
                          ),
                        ],
                      ),
                      const Icon(Icons.edit_calendar, color: AppColors.primaryBrown, size: 18),
                    ],
                  ),
                ),
              ),
            ),

            _buildSection(
              title: 'Setoran Awal (Opsional)',
              trailing: const Text('Dari saldo aktif', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
              child: _buildTextField(
                controller: _initialDepositController,
                hint: '1.500.000',
                prefixText: 'Rp ',
                isNumber: true,
              ),
            ),

            _buildAiCopilotCard(),
            const SizedBox(height: 24),

            // Pengingat Nabung Otomatis
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFF5F0EB)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: Color(0xFFFFECE0),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.notifications_active_outlined, color: AppColors.secondary, size: 20),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Pengingat Nabung Otomatis', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark)),
                        SizedBox(height: 4),
                        Text('Notifikasi setiap tanggal 25 (Hari Gajian)', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                      ],
                    ),
                  ),
                  Switch(
                    value: _autoReminder,
                    onChanged: (val) {
                      setState(() => _autoReminder = val);
                    },
                    activeColor: Colors.white,
                    activeTrackColor: AppColors.primaryBrown,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Buttons
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton.icon(
                onPressed: _isSaving
                    ? null
                    : () async {
                        FocusScope.of(context).unfocus();

                        final String rawTitle = _nameController.text.trim();
                        final double parsedAmount = _parseMoney(_amountController.text);
                        final double initialAmount =
                            _parseMoney(_initialDepositController.text);

                        if (rawTitle.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Nama target finansial wajib diisi.'),
                              backgroundColor: Color(0xFFDC2626),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                          return;
                        }
                        if (parsedAmount <= 0) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Target nominal harus lebih dari 0.'),
                              backgroundColor: Color(0xFFDC2626),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                          return;
                        }
                        if (initialAmount > parsedAmount) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Setoran awal tidak boleh melebihi target.'),
                              backgroundColor: Color(0xFFDC2626),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                          return;
                        }

                        final String deadlineStr =
                            '${_selectedDeadline.year}-${_selectedDeadline.month.toString().padLeft(2, '0')}-${_selectedDeadline.day.toString().padLeft(2, '0')}';

                        setState(() => _isSaving = true);
                        final success = await ApiService.addGoal({
                          'title': rawTitle,
                          'target_amount': parsedAmount,
                          'current_amount': initialAmount,
                          'initial_deposit': initialAmount,
                          'icon': _getIconName(_selectedIcon),
                          'deadline': deadlineStr,
                        });
                        if (!mounted) return;
                        setState(() => _isSaving = false);

                        if (!success) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                ApiService.lastGoalError ??
                                    'Gagal menyimpan goal. Periksa saldo dompet aplikasi atau koneksi.',
                              ),
                              backgroundColor: const Color(0xFFDC2626),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                          return;
                        }

                        if (widget.initialDraft != null &&
                            widget.initialDraft!['id'] != null) {
                          await DraftGoalService.deleteDraftGoal(
                            widget.initialDraft!['id'],
                          );
                        }

                        if (initialAmount > 0) {
                          await Provider.of<AuthProvider>(
                            context,
                            listen: false,
                          ).fetchWallets();
                        }

                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Target "$rawTitle" berhasil disimpan!'),
                              backgroundColor: const Color(0xFF10B981),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                          Navigator.pop(context, true);
                        }
                      },
                icon: _isSaving
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Icon(Icons.check_circle_outline, color: Colors.white),
                label: const Text(
                  'Simpan Target Goal',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBrown,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(27),
                  ),
                  elevation: 0,
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: TextButton.icon(
                onPressed: () async {
                  final String title = _nameController.text.trim();
                  final String amountStr = _amountController.text.replaceAll(RegExp(r'[^0-9]'), '');
                  final double targetAmount = double.tryParse(amountStr) ?? 0.0;
                  final String initialStr = _initialDepositController.text.replaceAll(RegExp(r'[^0-9]'), '');
                  final double initialAmount = double.tryParse(initialStr) ?? 0.0;

                  final String deadlineStr =
                      '${_selectedDeadline.year}-${_selectedDeadline.month.toString().padLeft(2, '0')}-${_selectedDeadline.day.toString().padLeft(2, '0')}';

                  final Map<String, dynamic> draftData = {
                    'id': widget.initialDraft?['id'] ?? 'draft_${DateTime.now().millisecondsSinceEpoch}',
                    'title': title.isEmpty ? 'Draft Target Impian' : title,
                    'target_amount': targetAmount,
                    'initial_deposit': initialAmount,
                    'icon': _getIconName(_selectedIcon),
                    'deadline': deadlineStr,
                  };

                  await DraftGoalService.saveDraftGoal(draftData);

                  if (!context.mounted) return;

                  showGoalDraftSuccessModal(
                    context: context,
                    draft: draftData,
                    onViewGoals: () {
                      Navigator.pop(context, true);
                    },
                  );
                },
                icon: const Icon(Icons.bookmark_border, color: AppColors.textDark),
                label: const Text(
                  'Simpan sebagai Draf',
                  style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 14),
                ),
                style: TextButton.styleFrom(
                  backgroundColor: const Color(0xFFF5F0EB),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(27),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildAiCopilotCard() {
    final target = _parseMoney(_amountController.text);
    final initial = _parseMoney(_initialDepositController.text);
    final remaining = (target - initial).clamp(0.0, double.infinity);
    final months = _monthsUntilDeadline;
    final monthly = remaining <= 0 ? 0.0 : remaining / (months > 0 ? months : 1);
    final title = _nameController.text.trim().isEmpty
        ? 'target impianmu'
        : '"${_nameController.text.trim()}"';

    final String message;
    if (target <= 0) {
      message = 'Isi target nominal terlebih dahulu agar rekomendasi tabungan bulanan bisa dihitung.';
    } else if (remaining <= 0) {
      message = 'Setoran awal kamu sudah memenuhi target $title. Goal akan langsung tercapai.';
    } else if (months <= 0) {
      message = 'Target waktu sudah lewat. Pilih tanggal baru atau tambah setoran agar target $title tetap bisa tercapai.';
    } else {
      message = 'Dengan setoran awal ${_formatRp(initial)}, kamu perlu menabung ${_formatRp(monthly)}/bulan selama $months bulan agar target $title tercapai.';
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F0EB),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.auto_awesome, color: AppColors.primaryBrown, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'AI Financial Copilot',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFD1FAE5),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Rekomendasi Cerdas',
                  style: TextStyle(
                    color: Color(0xFF065F46),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            message,
            style: const TextStyle(
              color: AppColors.textDark,
              fontSize: 12,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    const Icon(Icons.trending_up, color: AppColors.textMuted, size: 16),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text.rich(
                        TextSpan(
                          children: [
                            const TextSpan(
                              text: 'Sisa Target: ',
                              style: TextStyle(color: AppColors.textMuted, fontSize: 10),
                            ),
                            TextSpan(
                              text: '${_formatRp(remaining)}\n',
                              style: const TextStyle(
                                color: AppColors.textDark,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            TextSpan(
                              text: months > 0 ? '$months bulan lagi' : 'Batas waktu belum diatur',
                              style: const TextStyle(
                                color: AppColors.textDark,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Text(
                  'Estimasi ${_formatRp(monthly)}/bulan',
                  style: const TextStyle(
                    color: AppColors.primaryBrown,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIconOption(IconData icon) {
    bool isSelected = _selectedIcon == icon;
    return GestureDetector(
      onTap: () => setState(() => _selectedIcon = icon),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 6),
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBrown : Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: isSelected ? AppColors.primaryBrown : const Color(0xFFEBE6DF)),
        ),
        child: Icon(
          icon,
          color: isSelected ? Colors.white : AppColors.textMuted,
          size: 20,
        ),
      ),
    );
  }

  Widget _buildSection({required String title, Widget? trailing, required Widget child}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark,
                ),
              ),
              if (trailing != null) trailing,
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    IconData? icon,
    String? prefixText,
    bool isNumber = false,
    double? fontSize,
    FontWeight? fontWeight,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F0EB),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          if (icon != null) ...[
            Icon(icon, color: AppColors.textMuted, size: 20),
            const SizedBox(width: 12),
          ],
          if (prefixText != null)
            Text(
              prefixText,
              style: TextStyle(
                fontSize: fontSize ?? 16,
                fontWeight: fontWeight ?? FontWeight.normal,
                color: AppColors.textMuted,
              ),
            ),
          Expanded(
            child: TextField(
              controller: controller,
              keyboardType: isNumber ? TextInputType.number : TextInputType.text,
              inputFormatters: isNumber
                  ? [
                      FilteringTextInputFormatter.digitsOnly,
                      ThousandsSeparatorInputFormatter(),
                    ]
                  : null,
              style: TextStyle(
                fontSize: fontSize ?? 16,
                fontWeight: fontWeight ?? FontWeight.normal,
                color: AppColors.textDark,
              ),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: fontSize ?? 16,
                  fontWeight: fontWeight ?? FontWeight.normal,
                ),
                border: InputBorder.none,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
