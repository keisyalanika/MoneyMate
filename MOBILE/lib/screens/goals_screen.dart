import 'package:flutter/material.dart';
import '../utils/theme.dart';
import '../services/api_service.dart';
import 'add_goal_screen.dart';
import 'goal_detail_screen.dart';
import 'notification_screen.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  List<Map<String, dynamic>> _goals = [];
  bool _isLoading = true;
  int _selectedFilterIndex = 0; // 0: Semua, 1: Berjalan, 2: Tercapai
  bool _showTutorial = true; // Tutorial banner untuk V2 Usability

  @override
  void initState() {
    super.initState();
    _loadGoals();
  }

  Future<void> _loadGoals() async {
    setState(() => _isLoading = true);
    final data = await ApiService.fetchGoals();
    if (mounted) {
      setState(() {
        _goals = data;
        _isLoading = false;
      });
    }
  }

  String _formatRp(double amount) {
    final int val = amount.round();
    final String s = val.toString();
    final StringBuffer sb = StringBuffer();
    int count = 0;
    for (int i = s.length - 1; i >= 0; i--) {
      sb.write(s[i]);
      count++;
      if (count % 3 == 0 && i != 0) {
        sb.write('.');
      }
    }
    return 'Rp ${sb.toString().split('').reversed.join('')}';
  }

  @override
  Widget build(BuildContext context) {
    final double totalCollected = _goals.fold<double>(
      0,
      (sum, g) => sum + (double.tryParse('${g['current_amount'] ?? 0}') ?? 0),
    );
    final double totalTarget = _goals.fold<double>(
      0,
      (sum, g) => sum + (double.tryParse('${g['target_amount'] ?? 0}') ?? 0),
    );
    final double progressPercent = totalTarget > 0 ? (totalCollected / totalTarget).clamp(0.0, 1.0) : 0.0;
    final int activeCount = _goals.where((g) => (g['is_completed'] == 1 || g['is_completed'] == true) ? false : true).length;
    final int completedCount = _goals.length - activeCount;

    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF7),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFDFBF7),
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Row(
              children: [
                Icon(Icons.circle, size: 8, color: AppColors.primaryBrown),
                SizedBox(width: 4),
                Text('MONEYMATE WEALTH', style: TextStyle(color: AppColors.textMuted, fontSize: 10, letterSpacing: 1, fontWeight: FontWeight.bold)),
              ],
            ),
            Text(
              'Pencapaian Goals',
              style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 22),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFEBE6DF)),
            ),
            child: IconButton(
              icon: const Icon(Icons.refresh, color: AppColors.textDark, size: 20),
              onPressed: _loadGoals,
            ),
          ),
          Container(
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFEBE6DF)),
            ),
            child: IconButton(
              icon: const Icon(Icons.notifications_none, color: AppColors.textDark, size: 20),
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const NotificationScreen()));
              },
            ),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryBrown))
          : RefreshIndicator(
              onRefresh: _loadGoals,
              color: AppColors.primaryBrown,
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // Tutorial / Onboarding Tooltip Card (Berdasarkan hasil usability testing V1)
                    if (_showTutorial)
                      Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF7ED),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFFED7AA)),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: const BoxDecoration(
                                color: Color(0xFFF97316),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.lightbulb_outline, color: Colors.white, size: 18),
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
                                        'Panduan Singkat Fitur Goals',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: Color(0xFF9A3412),
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: () => setState(() => _showTutorial = false),
                                        child: const Icon(Icons.close, size: 16, color: Color(0xFF9A3412)),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    '1. Tekan "+ Buat Goal" di bawah untuk menentukan target tabungan baru.\n2. Tap kartu impianmu untuk melihat rincian progres atau menabung dana.\n3. Pantau status otomatis "On Track" hingga impian tercapai!',
                                    style: TextStyle(fontSize: 11, color: Color(0xFF7C2D12), height: 1.35),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                    // Top Summary Card (Live Dynamic)
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBrown,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: const Text('Total Tabungan Terkumpul', style: TextStyle(color: Colors.white, fontSize: 10)),
                              ),
                              Text('$activeCount Aktif • $completedCount Selesai', style: const TextStyle(color: Colors.white70, fontSize: 10)),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            _formatRp(totalCollected),
                            style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'dari total komitmen target ${_formatRp(totalTarget)}',
                            style: const TextStyle(color: Colors.white70, fontSize: 11),
                          ),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Progres Keseluruhan', style: TextStyle(color: Colors.white, fontSize: 12)),
                              Text(
                                '${(progressPercent * 100).toStringAsFixed(1)}%',
                                style: const TextStyle(color: Color(0xFFFFD54F), fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Stack(
                            children: [
                              Container(height: 6, decoration: BoxDecoration(color: Colors.black.withOpacity(0.3), borderRadius: BorderRadius.circular(3))),
                              LayoutBuilder(
                                builder: (context, constraints) {
                                  return Container(
                                    width: constraints.maxWidth * progressPercent,
                                    height: 6,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFFD54F),
                                      borderRadius: BorderRadius.circular(3),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.white.withOpacity(0.1)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFFD54F).withOpacity(0.2),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.bolt, color: Color(0xFFFFD54F), size: 16),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    _goals.isEmpty
                                        ? 'Mulai rencanakan impian finansialmu dengan membuat target tabungan baru!'
                                        : 'Pertahankan kebiasaan menabung rutin untuk mencapai target lebih cepat.',
                                    style: const TextStyle(color: Colors.white, fontSize: 10, height: 1.4),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Filter Chips (Interaktif)
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _buildFilterChip('Semua (${_goals.length})', _selectedFilterIndex == 0, () {
                            setState(() => _selectedFilterIndex = 0);
                          }),
                          const SizedBox(width: 8),
                          _buildFilterChip('Sedang Berjalan ($activeCount)', _selectedFilterIndex == 1, () {
                            setState(() => _selectedFilterIndex = 1);
                          }),
                          const SizedBox(width: 8),
                          _buildFilterChip('Tercapai ($completedCount)', _selectedFilterIndex == 2, () {
                            setState(() => _selectedFilterIndex = 2);
                          }),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Goals List or Empty State
                    Builder(builder: (context) {
                      final filteredGoals = _goals.where((g) {
                        final bool isDone = g['is_completed'] == 1 || g['is_completed'] == true;
                        if (_selectedFilterIndex == 1) return !isDone;
                        if (_selectedFilterIndex == 2) return isDone;
                        return true;
                      }).toList();

                      if (filteredGoals.isEmpty) {
                        return Container(
                          padding: const EdgeInsets.all(32),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: const Color(0xFFF0E5D8)),
                          ),
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(16),
                                decoration: const BoxDecoration(
                                  color: Color(0xFFFAF4F0),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.emoji_events_outlined, color: AppColors.primaryBrown, size: 36),
                              ),
                              const SizedBox(height: 14),
                              const Text(
                                'Tidak Ada Target pada Kategori Ini',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Rencanakan tabungan impianmu seperti laptop baru, liburan, atau dana darurat dengan menekan tombol di bawah.',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.4),
                              ),
                            ],
                          ),
                        );
                      }

                      return Column(
                        children: filteredGoals.map((g) {
                          final double collected = double.tryParse('${g['current_amount'] ?? 0}') ?? 0.0;
                          final double target = double.tryParse('${g['target_amount'] ?? 0}') ?? 1.0;
                          final double pct = target > 0 ? (collected / target).clamp(0.0, 1.0) : 0.0;
                          final double shortage = (target - collected).clamp(0.0, double.infinity);
                          final bool isDone = g['is_completed'] == 1 || g['is_completed'] == true;

                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: _buildGoalItem(
                              context: context,
                              category: isDone ? 'SELESAI' : 'TARGET FINANSIAL',
                              statusText: isDone ? 'Tercapai' : 'On Track',
                              statusColor: isDone ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                              title: g['title'] ?? 'Goal',
                              subtitle: g['deadline'] != null ? 'Batas Waktu: ${g['deadline']}' : 'Target Tabungan Pribadi',
                              icon: Icons.flag,
                              collected: _formatRp(collected),
                              target: _formatRp(target),
                              shortage: shortage > 0 ? 'Kurang ${_formatRp(shortage)}' : 'Target Terpenuhi!',
                              percent: (pct * 100).round(),
                              estimate: isDone ? 'Goal Selesai' : 'Sedang Berjalan',
                              progressColor: isDone ? const Color(0xFF10B981) : AppColors.primaryBrown,
                              isHeaderOrange: !isDone,
                            ),
                          );
                        }).toList(),
                      );
                    }),
                  ],
                ),
              ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddGoalScreen()),
          );
          if (result == true) {
            _loadGoals();
          }
        },
        backgroundColor: AppColors.primaryBrown,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Buat Goal', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBrown : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? AppColors.primaryBrown : const Color(0xFFEBE6DF)),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : AppColors.textDark,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  Widget _buildGoalItem({
    required BuildContext context,
    required String category,
    required String statusText,
    required Color statusColor,
    required String title,
    required String subtitle,
    required IconData icon,
    required String collected,
    required String target,
    required String shortage,
    required int percent,
    required String estimate,
    required Color progressColor,
    bool isHeaderOrange = false,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const GoalDetailScreen()),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF0E5D8)),
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
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: const BoxDecoration(
                color: AppColors.primaryBrown,
                borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.circle, size: 8, color: isHeaderOrange ? const Color(0xFFF59E0B) : const Color(0xFF10B981)),
                      const SizedBox(width: 8),
                      Text(category, style: const TextStyle(color: Colors.white70, fontSize: 10, letterSpacing: 1, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(statusText, style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

            // Body Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFAF7F2),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Icon(icon, color: AppColors.primaryBrown, size: 28),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textDark)),
                            const SizedBox(height: 4),
                            Text(subtitle, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Progress Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Terkumpul', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                          const SizedBox(height: 2),
                          Text(collected, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text('Target', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                          const SizedBox(height: 2),
                          Text(target, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textDark)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Progress Bar
                  Stack(
                    children: [
                      Container(height: 8, decoration: BoxDecoration(color: const Color(0xFFEBE6DF), borderRadius: BorderRadius.circular(4))),
                      FractionallySizedBox(
                        widthFactor: (percent / 100).clamp(0.0, 1.0),
                        child: Container(
                          height: 8,
                          decoration: BoxDecoration(
                            color: progressColor,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(shortage, style: const TextStyle(color: Color(0xFFC25E38), fontSize: 11, fontWeight: FontWeight.bold)),
                      Text('$percent%', style: const TextStyle(color: AppColors.textDark, fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
