import 'package:flutter/material.dart';
import 'add_goal_funds_screen.dart';

class GoalDetailScreen extends StatelessWidget {
  const GoalDetailScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCF9F5), // Light background
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.arrow_back, color: Color(0xFF2C1A14), size: 20),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          children: [
            const Text(
              'PENCAPAIAN TARGET',
              style: TextStyle(
                color: Color(0xFF8C827A),
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
            const Text(
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
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.more_vert, color: Color(0xFF2C1A14), size: 20),
            ),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Main Hero Card
            Container(
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
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3EBE3), // Brown-ish light
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.laptop_mac, color: Color(0xFF3E2723)),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Laptop Baru',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2C1A14),
                              ),
                            ),
                            const Text(
                              'Elektronik & Kerja',
                              style: TextStyle(
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
                          color: const Color(0xFFF0EAE1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Prioritas 1',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF5A4A42),
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
                  const Text(
                    'Rp 11.250.000',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF3E2723),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Target: Rp 15.000.000',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF8C827A),
                        ),
                      ),
                      const Text(
                        '75%',
                        style: TextStyle(
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
                      value: 0.75,
                      minHeight: 12,
                      backgroundColor: const Color(0xFFEFE8E1),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF5A3E2B)),
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
                        Row(
                          children: [
                            const Icon(Icons.account_balance_wallet_outlined, size: 16, color: Color(0xFFB35A43)),
                            const SizedBox(width: 8),
                            RichText(
                              text: const TextSpan(
                                style: TextStyle(fontSize: 12, color: Color(0xFF5A4A42)),
                                children: [
                                  TextSpan(text: 'Kurang '),
                                  TextSpan(text: 'Rp 3.750.000', style: TextStyle(color: Color(0xFFB35A43), fontWeight: FontWeight.bold)),
                                  TextSpan(text: ' lagi'),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const Text(
                          'Tersisa 25%',
                          style: TextStyle(
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
            ),
            const SizedBox(height: 20),

            // 3 Small Info Cards
            Row(
              children: [
                Expanded(child: _buildSmallInfoCard(Icons.calendar_today_outlined, 'Target Waktu', '31 Des 2026', 'Sisa 3 bln', const Color(0xFFB35A43))),
                const SizedBox(width: 12),
                Expanded(child: _buildSmallInfoCard(Icons.trending_up, 'Rata-rata/Bln', 'Rp 1,25 Jt', 'Konsisten', const Color(0xFF5A4A42))),
                const SizedBox(width: 12),
                Expanded(child: _buildSmallStatusCard()),
              ],
            ),
            const SizedBox(height: 20),

            // AI Smart Recommendation Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF9EFEA), // Light peach
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
                  const Expanded(
                    child: Text.rich(
                      TextSpan(
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF4A3428),
                          height: 1.5,
                        ),
                        children: [
                          TextSpan(text: 'Hebat! Kamu tinggal menabung '),
                          TextSpan(text: 'Rp 1.250.000 / bulan', style: TextStyle(fontWeight: FontWeight.bold)),
                          TextSpan(text: ' selama 3 bulan ke depan untuk membeli laptop impian.'),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // History List Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                  ],
                ),
                const Text(
                  'Lihat Semua',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFB35A43), // Brown red
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // History Items enclosed in a white container
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildHistoryItem(Icons.account_balance, 'Tabungan Rutin Gajian', '1 Sep 2026 • Transfer BCA', '+Rp 1.000.000'),
                  const Divider(height: 24, color: Color(0xFFF0EAE1)),
                  _buildHistoryItem(Icons.payments_outlined, 'Bonus Freelance', '15 Agu 2026 • Dompet Utama', '+Rp 500.000'),
                  const Divider(height: 24, color: Color(0xFFF0EAE1)),
                  _buildHistoryItem(Icons.savings_outlined, 'Tabungan Rutin', '1 Agu 2026 • Auto-debet', '+Rp 1.000.000'),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Buttons
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
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const AddGoalFundsScreen()),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.add_circle_outline, color: Colors.white, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Tambah Dana Tabungan',
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
          ],
        ),
      ),
    );
  }

  Widget _buildSmallInfoCard(IconData icon, String title, String value, String subValue, Color subValueColor) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(icon, color: const Color(0xFF8C827A), size: 20),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
          ),
          const SizedBox(height: 4),
          Text(
            subValue,
            style: TextStyle(fontSize: 10, color: subValueColor, fontWeight: FontWeight.w500),
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
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Icon(Icons.verified_outlined, color: Color(0xFF27AE60), size: 20),
          const SizedBox(height: 8),
          const Text(
            'Status Goal',
            style: TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFFD4EEDC),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Text(
              'On Track',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF27AE60)),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Aman',
            style: TextStyle(fontSize: 10, color: Color(0xFF27AE60), fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryItem(IconData icon, String title, String date, String amount) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFFE8F5E9), // Light green background for icon
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: const Color(0xFF27AE60), size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
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
