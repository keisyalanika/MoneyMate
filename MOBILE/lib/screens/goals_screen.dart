import 'package:flutter/material.dart';
import '../utils/theme.dart';
import 'add_goal_screen.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  final List<Map<String, dynamic>> _myGoals = [];

  @override
  Widget build(BuildContext context) {
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
              icon: const Icon(Icons.bar_chart, color: AppColors.textDark, size: 20),
              onPressed: () {},
            ),
          ),
          Container(
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFEBE6DF)),
            ),
            child: Stack(
              children: [
                IconButton(
                  icon: const Icon(Icons.notifications_none, color: AppColors.textDark, size: 20),
                  onPressed: () {},
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Top Summary Card
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
                        child: const Text('Total Tabungan Target', style: TextStyle(color: Colors.white, fontSize: 10)),
                      ),
                      const Text('2 Aktif • 1 Selesai', style: TextStyle(color: Colors.white70, fontSize: 10)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _myGoals.isNotEmpty ? 'Rp 32.750.000' : 'Rp 31.250.000',
                    style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _myGoals.isNotEmpty ? 'dari total komitmen Rp 60.000.000' : 'dari total komitmen Rp 45.000.000',
                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Progres Keseluruhan', style: TextStyle(color: Colors.white, fontSize: 12)),
                      Text(_myGoals.isNotEmpty ? '65.2%' : '69.4%', style: const TextStyle(color: Color(0xFFFFD54F), fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Stack(
                    children: [
                      Container(height: 6, decoration: BoxDecoration(color: Colors.black.withOpacity(0.3), borderRadius: BorderRadius.circular(3))),
                      LayoutBuilder(
                        builder: (context, constraints) {
                          return Container(
                            width: constraints.maxWidth * (_myGoals.isNotEmpty ? 0.652 : 0.694),
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
                  const SizedBox(height: 20),
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
                        const Expanded(
                          child: Text.rich(
                            TextSpan(
                              style: TextStyle(color: Colors.white, fontSize: 10, height: 1.5),
                              children: [
                                TextSpan(text: 'Kamu hemat 15% bulan ini! Pertahankan kebiasaan ini untuk mempercepat target '),
                                TextSpan(text: 'Dana Darurat', style: TextStyle(color: Color(0xFFFFD54F), fontWeight: FontWeight.bold)),
                                TextSpan(text: ' 2 bulan lebih awal.'),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            
            // Filter Chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('Semua (${3 + _myGoals.length})', true),
                  const SizedBox(width: 8),
                  _buildFilterChip('Sedang Berjalan (${2 + _myGoals.length})', false),
                  const SizedBox(width: 8),
                  _buildFilterChip('Tercapai (1)', false),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Goal Items
            ..._myGoals.reversed.map((goal) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _buildGoalItem(
                  category: 'IMPIAN BARU',
                  statusText: 'Baru',
                  statusColor: AppColors.secondary,
                  title: goal['title'],
                  subtitle: 'Target Finansial',
                  icon: goal['icon'],
                  collected: 'Rp ${goal['collected']}',
                  target: 'Rp ${goal['target']}',
                  shortage: 'Hitung otomatis...',
                  percent: 10,
                  estimate: 'Estimasi: Segera',
                  progressColor: AppColors.secondary,
                ),
              );
            }).toList(),

            _buildGoalItem(
              category: 'ELEKTRONIK & KERJA',
              statusText: 'On Track',
              statusColor: const Color(0xFF10B981), // green
              title: 'Beli Laptop Baru',
              subtitle: 'MacBook Pro M-Series untuk Upgrade Kerja',
              icon: Icons.computer,
              collected: 'Rp 11.250.000',
              target: 'Rp 15.000.000',
              shortage: 'Rp 3.750.000',
              percent: 75,
              estimate: 'Estimasi: 3 bulan lagi',
              progressColor: AppColors.primaryBrown,
            ),
            const SizedBox(height: 16),
            _buildGoalItem(
              category: 'FINANSIAL PRIBADI',
              statusText: 'Prioritas Utama',
              statusColor: const Color(0xFFF59E0B), // amber/orange
              title: 'Dana Darurat 6 Bulan',
              subtitle: 'Simpanan untuk kondisi tak terduga',
              icon: Icons.health_and_safety,
              collected: 'Rp 20.000.000',
              target: 'Rp 30.000.000',
              shortage: 'Rp 10.000.000',
              percent: 66,
              estimate: 'Estimasi: 8 bulan lagi',
              progressColor: AppColors.primaryBrown,
              isHeaderOrange: true,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddGoalScreen()),
          );
          if (result != null && result is Map<String, dynamic>) {
            setState(() {
              _myGoals.add(result);
            });
          }
        },
        backgroundColor: AppColors.primaryBrown,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Buat Goal', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Container(
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
    );
  }

  Widget _buildGoalItem({
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
    return Container(
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
          // Header (Brown)
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
                    Text(category, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isHeaderOrange ? const Color(0xFFB45309) : Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(statusText, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(title, style: const TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 16)),
                          const SizedBox(height: 4),
                          Text(subtitle, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFDFBF7),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFF0E5D8)),
                      ),
                      child: Icon(icon, color: AppColors.textDark, size: 24),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text('TERKUMPUL', style: TextStyle(color: AppColors.textMuted, fontSize: 10, letterSpacing: 1, fontWeight: FontWeight.bold)),
                    Text('TARGET', style: TextStyle(color: AppColors.textMuted, fontSize: 10, letterSpacing: 1, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(collected, style: const TextStyle(color: AppColors.primaryBrown, fontSize: 20, fontWeight: FontWeight.bold)),
                    Text(target, style: const TextStyle(color: AppColors.textDark, fontSize: 14, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text.rich(
                      TextSpan(
                        children: [
                          const TextSpan(text: 'Kurang ', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                          TextSpan(text: shortage, style: const TextStyle(color: AppColors.textDark, fontSize: 12, fontWeight: FontWeight.bold)),
                          const TextSpan(text: ' lagi', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F0EB),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text('$percent%', style: const TextStyle(color: AppColors.textDark, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Stack(
                  children: [
                    Container(height: 6, decoration: BoxDecoration(color: const Color(0xFFF5F0EB), borderRadius: BorderRadius.circular(3))),
                    LayoutBuilder(
                      builder: (context, constraints) {
                        return Container(
                          width: constraints.maxWidth * (percent / 100),
                          height: 6,
                          decoration: BoxDecoration(
                            color: progressColor,
                            borderRadius: BorderRadius.circular(3),
                          ),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.pie_chart_outline, color: AppColors.textMuted, size: 14),
                        const SizedBox(width: 4),
                        Text(estimate, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFFF0E5D8)),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.add, color: AppColors.textDark, size: 14),
                          SizedBox(width: 4),
                          Text('Nabung', style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
