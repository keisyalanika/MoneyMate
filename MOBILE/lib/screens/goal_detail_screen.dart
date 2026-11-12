import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/auth_provider.dart';
import '../utils/currency_formatter.dart';
import '../utils/theme.dart';
import 'add_goal_funds_screen.dart';

class GoalDetailScreen extends StatefulWidget {
  final Map<String, dynamic> goal;

  const GoalDetailScreen({super.key, required this.goal});

  @override
  State<GoalDetailScreen> createState() => _GoalDetailScreenState();
}

class _GoalDetailScreenState extends State<GoalDetailScreen> {
  late Map<String, dynamic> _goal;
  List<Map<String, dynamic>> _funds = [];
  bool _isLoadingHistory = true;
  bool _isDeleting = false;

  @override
  void initState() {
    super.initState();
    _goal = Map<String, dynamic>.from(widget.goal);
    _loadFunds();
  }

  String get _goalId => _goal['id']?.toString() ?? '';

  double get _collected =>
      double.tryParse('${_goal['current_amount'] ?? 0}') ?? 0.0;

  double get _target =>
      double.tryParse('${_goal['target_amount'] ?? 0}') ?? 0.0;

  double get _shortage => (_target - _collected).clamp(0.0, double.infinity);

  double get _progress =>
      _target > 0 ? (_collected / _target).clamp(0.0, 1.0) : 0.0;

  bool get _isCompleted {
    final flag = _goal['is_completed'];
    return flag == 1 ||
        flag == true ||
        flag?.toString() == '1' ||
        (_target > 0 && _collected >= _target);
  }

  DateTime? get _deadline {
    final raw = _goal['deadline']?.toString();
    if (raw == null || raw.isEmpty || raw == 'null') return null;
    return DateTime.tryParse(raw);
  }

  int get _daysLeft {
    final deadline = _deadline;
    if (deadline == null) return 0;
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(deadline.year, deadline.month, deadline.day);
    return target.difference(today).inDays;
  }

  int get _monthsLeft {
    if (_deadline == null) return 0;
    final days = _daysLeft;
    if (days <= 0) return 0;
    return (days / 30).ceil();
  }

  double get _monthlyNeeded {
    if (_shortage <= 0) return 0;
    final months = _monthsLeft > 0 ? _monthsLeft : 1;
    return _shortage / months;
  }

  String get _statusText {
    if (_isCompleted) return 'Tercapai';
    final deadline = _deadline;
    if (deadline != null && _daysLeft < 0) return 'Terlambat';
    return 'On Track';
  }

  Color get _statusColor {
    if (_isCompleted) return const Color(0xFF27AE60);
    if (_deadline != null && _daysLeft < 0) return const Color(0xFFDC2626);
    return const Color(0xFFF59E0B);
  }

  String _formatRp(num value) => CurrencyFormatter.formatRupiah(value);

  String _formatDate(DateTime date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  IconData get _goalIcon {
    switch (_goal['icon']?.toString().toLowerCase()) {
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

  String get _goalCategory {
    switch (_goal['icon']?.toString().toLowerCase()) {
      case 'laptop':
        return 'Elektronik & Kerja';
      case 'flight':
        return 'Liburan & Perjalanan';
      case 'car':
        return 'Kendaraan';
      case 'home':
        return 'Properti';
      case 'savings':
        return 'Dana Darurat';
      case 'diamond':
        return 'Impian Lainnya';
      default:
        return 'Target Finansial';
    }
  }

  Future<void> _loadFunds() async {
    setState(() => _isLoadingHistory = true);
    final funds = await ApiService.fetchGoalFunds(_goalId);
    if (!mounted) return;
    setState(() {
      _funds = funds;
      _isLoadingHistory = false;
    });
  }

  Future<void> _reloadGoal() async {
    final goals = await ApiService.fetchGoals();
    final matched = goals.where((g) => g['id']?.toString() == _goalId).toList();
    if (matched.isNotEmpty && mounted) {
      setState(() => _goal = Map<String, dynamic>.from(matched.first));
    }
  }

  Future<void> _openAddFunds() async {
    final changed = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (context) => AddGoalFundsScreen(goal: _goal),
      ),
    );
    if (changed == true) {
      await _reloadGoal();
      await _loadFunds();
    }
  }

  Future<void> _confirmDelete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text(
          'Hapus Goal?',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        content: Text(
          'Goal "${_goal['title'] ?? 'Target'}" beserta riwayat setorannya akan dihapus permanen.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal', style: TextStyle(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
            child: const Text(
              'Hapus',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() => _isDeleting = true);
    final success = await ApiService.deleteGoal(_goal['id']);
    if (!mounted) return;
    setState(() => _isDeleting = false);

    if (success) {
      try {
        await Provider.of<AuthProvider>(context, listen: false).fetchWallets();
      } catch (_) {}
      if (!mounted) return;
      Navigator.pop(context, true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Gagal menghapus goal. Silakan coba lagi.'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCF9F5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.arrow_back, color: Color(0xFF2C1A14), size: 20),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          children: const [
            Text(
              'PENCAPAIAN TARGET',
              style: TextStyle(
                color: Color(0xFF8C827A),
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
            Text(
              'Detail Goal',
              style: TextStyle(
                color: Color(0xFF2C1A14),
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          PopupMenuButton<String>(
            enabled: !_isDeleting,
            onSelected: (value) {
              if (value == 'delete') _confirmDelete();
            },
            itemBuilder: (context) => const [
              PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    Icon(Icons.delete_outline, size: 18, color: Color(0xFFDC2626)),
                    SizedBox(width: 8),
                    Text('Hapus Goal', style: TextStyle(color: Color(0xFFDC2626))),
                  ],
                ),
              ),
            ],
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.more_vert, color: Color(0xFF2C1A14), size: 20),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeroCard(),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: _buildSmallInfoCard(
                    Icons.calendar_today_outlined,
                    'Target Waktu',
                    _deadline != null ? _formatDate(_deadline!) : 'Belum diatur',
                    _deadlineMessage,
                    const Color(0xFFB35A43),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSmallInfoCard(
                    Icons.trending_up,
                    'Perlu/Bln',
                    _formatRp(_monthlyNeeded),
                    _isCompleted ? 'Selesai' : 'Estimasi',
                    const Color(0xFF5A4A42),
                  ),
                ),
                const SizedBox(width: 12),
                _buildSmallStatusCard(),
              ],
            ),
            const SizedBox(height: 20),
            _buildAiCard(),
            const SizedBox(height: 24),
            _buildHistorySection(),
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
                onPressed: _isCompleted ? null : _openAddFunds,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      _isCompleted
                          ? Icons.emoji_events_outlined
                          : Icons.add_circle_outline,
                      color: Colors.white,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _isCompleted ? 'Target Tercapai' : 'Tambah Dana Tabungan',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String get _deadlineMessage {
    if (_isCompleted) return 'Target selesai';
    if (_deadline == null) return 'Tanpa batas waktu';
    if (_daysLeft < 0) return 'Melewati batas';
    if (_daysLeft < 30) return 'Sisa $_daysLeft hari';
    return 'Sisa $_monthsLeft bulan';
  }

  Widget _buildHeroCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: Color(0xFFF3EBE3),
                  shape: BoxShape.circle,
                ),
                child: Icon(_goalIcon, color: const Color(0xFF3E2723)),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _goal['title']?.toString() ?? 'Target Tabungan',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2C1A14),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _goalCategory,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF8C827A),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _statusColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  _statusText,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: _statusColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'TOTAL TERKUMPUL',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Color(0xFF8C827A),
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            _formatRp(_collected),
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              color: Color(0xFF3E2723),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Target: ${_formatRp(_target)}',
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF8C827A),
                ),
              ),
              Text(
                '${(_progress * 100).toStringAsFixed(1)}%',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF3E2723),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: _progress,
              minHeight: 12,
              backgroundColor: const Color(0xFFEFE8E1),
              valueColor: AlwaysStoppedAnimation<Color>(
                _isCompleted ? const Color(0xFF27AE60) : const Color(0xFF5A3E2B),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F4F1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(
                        Icons.account_balance_wallet_outlined,
                        size: 16,
                        color: Color(0xFFB35A43),
                      ),
                      const SizedBox(width: 8),
                      Flexible(
                        child: RichText(
                          text: TextSpan(
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF5A4A42),
                            ),
                            children: [
                              TextSpan(
                                text: _shortage > 0 ? 'Kurang ' : 'Sudah terkumpul ',
                              ),
                              TextSpan(
                                text: _formatRp(_shortage > 0 ? _shortage : _collected),
                                style: const TextStyle(
                                  color: Color(0xFFB35A43),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextSpan(text: _shortage > 0 ? ' lagi' : ''),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  _shortage > 0
                      ? 'Sisa ${((_shortage / (_target == 0 ? 1 : _target)) * 100).toStringAsFixed(0)}%'
                      : '100%',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF8C827A),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSmallInfoCard(
    IconData icon,
    String title,
    String value,
    String subValue,
    Color subValueColor,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(icon, color: const Color(0xFF8C827A), size: 20),
          const SizedBox(height: 8),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2C1A14),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subValue,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10,
              color: subValueColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSmallStatusCard() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(Icons.verified_outlined, color: _statusColor, size: 20),
          const SizedBox(height: 8),
          const Text(
            'Status Goal',
            style: TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: _statusColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              _statusText,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: _statusColor,
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            _isCompleted ? 'Selesai' : (_daysLeft < 0 && _deadline != null ? 'Perlu dikejar' : 'Aman'),
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10,
              color: _statusColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAiCard() {
    String message;
    if (_isCompleted) {
      message = 'Selamat! Goal "${_goal['title'] ?? 'impianmu'}" sudah tercapai 100%.';
    } else if (_deadline != null && _daysLeft < 0) {
      message =
          'Batas waktu sudah lewat. Kamu masih perlu ${_formatRp(_shortage)}. Atur ulang target waktu atau tambah setoran.';
    } else if (_deadline == null) {
      message =
          'Kamu perlu mengumpulkan ${_formatRp(_shortage)} lagi. Tentukan batas waktu agar rekomendasi tabungan bulanan bisa dihitung.';
    } else {
      message =
          'Kamu perlu menabung ${_formatRp(_monthlyNeeded)}/bulan selama $_monthsLeft bulan ke depan untuk mencapai target.';
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF9EFEA),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Color(0xFF4A3428),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.lightbulb, color: Colors.white, size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                fontSize: 12,
                color: Color(0xFF4A3428),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistorySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.history, color: Color(0xFF2C1A14), size: 20),
            const SizedBox(width: 8),
            const Text(
              'Riwayat Setoran',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2C1A14),
              ),
            ),
            const Spacer(),
            Text(
              '${_funds.length} setoran',
              style: const TextStyle(
                fontSize: 11,
                color: Color(0xFF8C827A),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
          ),
          padding: const EdgeInsets.all(16),
          child: _isLoadingHistory
              ? const Center(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                )
              : _funds.isEmpty
                  ? const Padding(
                      padding: EdgeInsets.symmetric(vertical: 16),
                      child: Column(
                        children: [
                          Icon(
                            Icons.savings_outlined,
                            color: Color(0xFFB8AFA6),
                            size: 36,
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Belum ada setoran',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                              color: Color(0xFF5A4A42),
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Tekan "Tambah Dana Tabungan" untuk mulai menabung.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFF8C827A),
                            ),
                          ),
                        ],
                      ),
                    )
                  : Column(
                      children: List.generate(_funds.length, (index) {
                        final fund = _funds[index];
                        final amount =
                            double.tryParse('${fund['amount'] ?? 0}') ?? 0.0;
                        final note = fund['note']?.toString();
                        DateTime? date;
                        final rawDate = fund['created_at']?.toString();
                        if (rawDate != null && rawDate.isNotEmpty) {
                          date = DateTime.tryParse(rawDate);
                        }
                        return Column(
                          children: [
                            _buildHistoryItem(
                              title: (note == null || note.isEmpty)
                                  ? 'Setoran tabungan'
                                  : note,
                              date: date != null
                                  ? _formatDate(date)
                                  : 'Baru saja',
                              amount: '+${_formatRp(amount)}',
                            ),
                            if (index != _funds.length - 1)
                              const Divider(
                                height: 24,
                                color: Color(0xFFF0EAE1),
                              ),
                          ],
                        );
                      }),
                    ),
        ),
      ],
    );
  }

  Widget _buildHistoryItem({
    required String title,
    required String date,
    required String amount,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: const BoxDecoration(
            color: Color(0xFFE8F5E9),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.savings_outlined,
            color: Color(0xFF27AE60),
            size: 20,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2C1A14),
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                date,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF8C827A),
                ),
              ),
            ],
          ),
        ),
        Text(
          amount,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(0xFF539165),
            fontSize: 16,
          ),
        ),
      ],
    );
  }
}
