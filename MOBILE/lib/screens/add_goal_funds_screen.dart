import 'package:flutter/material.dart';
import 'goal_funds_success_modal.dart';

class AddGoalFundsScreen extends StatefulWidget {
  const AddGoalFundsScreen({Key? key}) : super(key: key);

  @override
  State<AddGoalFundsScreen> createState() => _AddGoalFundsScreenState();
}

class _AddGoalFundsScreenState extends State<AddGoalFundsScreen> {
  bool isAutoDebit = true;

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
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Mini Goal Card Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(width: 6, height: 6, decoration: const BoxDecoration(color: Color(0xFFB35A43), shape: BoxShape.circle)),
                    const SizedBox(width: 6),
                    const Text(
                      'ALOKASI DANA • LAPTOP BARU',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF5A4A42), letterSpacing: 1),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9EFEA),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: const [
                      Icon(Icons.check_circle_outline, size: 12, color: Color(0xFFB35A43)),
                      SizedBox(width: 4),
                      Text('Goal Aktif', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFB35A43))),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Mini Goal Card Body
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
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
                        child: const Icon(Icons.laptop_mac, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('Laptop Baru', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                            Text('Elektronik & Kerja Produktif', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                          ],
                        ),
                      ),
                      const Text('75%', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFB35A43))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: 0.75,
                      minHeight: 8,
                      backgroundColor: const Color(0xFFEFE8E1),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF5A3E2B)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Terkumpul Rp 11.250.000', style: TextStyle(fontSize: 11, color: Color(0xFF5A4A42))),
                      Text('Target Rp 15.000.000', style: TextStyle(fontSize: 11, color: Color(0xFF5A4A42))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFCF9F5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.account_balance_wallet_outlined, size: 14, color: Color(0xFFB35A43)),
                        const SizedBox(width: 6),
                        RichText(
                          text: const TextSpan(
                            style: TextStyle(fontSize: 11, color: Color(0xFF5A4A42)),
                            children: [
                              TextSpan(text: 'Kurang '),
                              TextSpan(text: 'Rp 3.750.000', style: TextStyle(color: Color(0xFFB35A43), fontWeight: FontWeight.bold)),
                              TextSpan(text: ' lagi untuk mencapai impian'),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Nominal Tambah Dana
            Container(
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
                        'NOMINAL TAMBAH DANA',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF8C827A), letterSpacing: 0.5),
                      ),
                      Row(
                        children: const [
                          Icon(Icons.auto_awesome, size: 14, color: Color(0xFFB35A43)),
                          SizedBox(width: 4),
                          Text('Bebas Biaya Admin', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFB35A43))),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Text('Rp ', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFFB3B3B3))),
                      const Expanded(
                        child: Text(
                          '1.250.000',
                          style: TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Color(0xFF3E2723)),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3EBE3),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.close, size: 16, color: Color(0xFF8C827A)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(child: _buildQuickAmountChip('+ Rp 250.000')),
                      const SizedBox(width: 8),
                      Expanded(child: _buildQuickAmountChip('+ Rp 500.000')),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(child: _buildQuickAmountChip('+ Rp 1.000.000')),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF9EFEA),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.flash_on, size: 14, color: Color(0xFFB35A43)),
                              SizedBox(width: 4),
                              Text('Lunasi Sisa', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFFB35A43))),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // AI Financial Copilot
            Container(
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
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: const BoxDecoration(
                              color: Color(0xFFE8DCD1),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.auto_awesome, size: 16, color: Color(0xFF5A4A42)),
                          ),
                          const SizedBox(width: 8),
                          const Text('AI FINANCIAL COPILOT', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF8C827A))),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE8DCD1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('75% → 83.3%', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF5A4A42))),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(fontSize: 13, color: Color(0xFF5A4A42), height: 1.5),
                      children: [
                        TextSpan(text: 'Dengan menambah Rp 1.250.000 hari ini, progres goal kamu naik menjadi '),
                        TextSpan(text: '83.3%', style: TextStyle(color: Color(0xFFB35A43), fontWeight: FontWeight.bold)),
                        TextSpan(text: '! Kamu tinggal butuh sekitar '),
                        TextSpan(text: '2 bulan lagi', style: TextStyle(fontWeight: FontWeight.bold)),
                        TextSpan(text: ' untuk laptop impian.'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: Stack(
                            children: [
                              LinearProgressIndicator(
                                value: 0.833, // Target
                                minHeight: 6,
                                backgroundColor: const Color(0xFFDCD1C5),
                                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF8A3A23)),
                              ),
                              LinearProgressIndicator(
                                value: 0.75, // Current
                                minHeight: 6,
                                backgroundColor: Colors.transparent,
                                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF5A3E2B)),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Text('Sisa Rp 2.500.000', style: TextStyle(fontSize: 10, color: Color(0xFF8C827A))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Sumber Dana Tabungan
            Container(
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
                    children: const [
                      Text('SUMBER DANA TABUNGAN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF8C827A))),
                      Text('Ganti Rekening >', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFB35A43))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFCF9F5),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFEFE8E1)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: const BoxDecoration(
                            color: Color(0xFF5A3E2B),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.account_balance, color: Colors.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Text('BCA Prioritas', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFD4EEDC),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text('Tersedia', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF27AE60))),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              const Text('Saldo Aktif: Rp 42.800.000', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                            ],
                          ),
                        ),
                        const Icon(Icons.check_circle, color: Color(0xFF5A3E2B), size: 24),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildSmallWalletChip(Icons.account_balance_wallet, 'Dompet Tunai', 'Rp 850.000'),
                        const SizedBox(width: 8),
                        _buildSmallWalletChip(Icons.credit_card, 'Mandiri Utama', 'Rp 5.200.000'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Settings (Date & Auto-debit)
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today, color: Color(0xFF8C827A), size: 20),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text('Tanggal Setoran', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                              SizedBox(height: 4),
                              Text('Hari ini, 7 September 2026', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3EBE3),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text('Instan', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF5A4A42))),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: Color(0xFFF0EAE1)),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        const Icon(Icons.sync, color: Color(0xFF8C827A), size: 20),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text('Jadikan Setoran Rutin Bulanan', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                              SizedBox(height: 4),
                              Text('Auto-debet setiap tanggal 25', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                            ],
                          ),
                        ),
                        Switch(
                          value: isAutoDebit,
                          onChanged: (val) {
                            setState(() {
                              isAutoDebit = val;
                            });
                          },
                          activeColor: Colors.white,
                          activeTrackColor: const Color(0xFF4A3428),
                          inactiveTrackColor: const Color(0xFFEFE8E1),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Catatan
            Container(
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
                    children: const [
                      Text('CATATAN SETORAN (OPSIONAL)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF8C827A))),
                      Text('47/100', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F4F1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'Tabungan dari bonus project freelance bulan ini',
                      style: TextStyle(fontSize: 13, color: Color(0xFF5A4A42)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Actions
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
                  showGoalFundsSuccessModal(context);
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
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
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
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

  Widget _buildQuickAmountChip(String amount) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F4F1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Center(
        child: Text(
          amount,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF5A4A42)),
        ),
      ),
    );
  }

  Widget _buildSmallWalletChip(IconData icon, String title, String amount) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFFCF9F5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFEFE8E1)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: const Color(0xFF8C827A)),
          const SizedBox(width: 8),
          Text(title, style: const TextStyle(fontSize: 11, color: Color(0xFF5A4A42))),
          const Text(' (', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
          Text(amount, style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
          const Text(')', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
        ],
      ),
    );
  }
}
