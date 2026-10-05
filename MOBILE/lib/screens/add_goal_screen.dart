import 'package:flutter/material.dart';
import '../utils/theme.dart';

class AddGoalScreen extends StatefulWidget {
  const AddGoalScreen({super.key});

  @override
  State<AddGoalScreen> createState() => _AddGoalScreenState();
}

class _AddGoalScreenState extends State<AddGoalScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _initialDepositController = TextEditingController();
  
  bool _autoReminder = true;
  IconData _selectedIcon = Icons.laptop_mac;

  @override
  void dispose() {
    _nameController.dispose();
    _amountController.dispose();
    _initialDepositController.dispose();
    super.dispose();
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
            onPressed: () {},
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTextField(
                    controller: _amountController,
                    hint: '15.000.000',
                    prefixText: 'Rp ',
                    isNumber: true,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildQuickAmount('+Rp 1 Jt'),
                      _buildQuickAmount('+Rp 5 Jt'),
                      _buildQuickAmount('+Rp 10 Jt'),
                    ],
                  ),
                ],
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
                child: const Text('Sisa 4 Bulan', style: TextStyle(color: AppColors.secondary, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F0EB),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Row(
                      children: [
                        Icon(Icons.calendar_today_outlined, color: AppColors.textMuted, size: 18),
                        SizedBox(width: 12),
                        Text('31 Desember 2026', style: TextStyle(color: AppColors.textDark, fontSize: 14)),
                      ],
                    ),
                    Icon(Icons.edit_calendar, color: AppColors.textMuted, size: 18),
                  ],
                ),
              ),
            ),

            _buildSection(
              title: 'Kategori Impian',
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F0EB),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Expanded(child: Text('Elektronik & Kerja', style: TextStyle(color: AppColors.textDark, fontSize: 14))),
                    Icon(Icons.keyboard_arrow_down, color: AppColors.textMuted),
                  ],
                ),
              ),
            ),

            _buildSection(
              title: 'Setoran Awal (Opsional)',
              trailing: const Text('Hari ini', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
              child: _buildTextField(
                controller: _initialDepositController,
                hint: '1.500.000',
                prefixText: 'Rp ',
                isNumber: true,
              ),
            ),

            _buildSection(
              title: 'Rekening Sumber / Penampung',
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F0EB),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Expanded(child: Text('BCA Prioritas (Saldo Rp 42.800.000)', style: TextStyle(color: AppColors.textDark, fontSize: 14))),
                    Icon(Icons.account_balance, color: AppColors.textMuted, size: 18),
                  ],
                ),
              ),
            ),

            // AI Financial Copilot Card
            Container(
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
                      Row(
                        children: const [
                          Icon(Icons.auto_awesome, color: AppColors.primaryBrown, size: 18),
                          SizedBox(width: 8),
                          Text('AI Financial Copilot', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.primaryBrown)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFD1FAE5),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text('Rekomendasi Cerdas', style: TextStyle(color: Color(0xFF065F46), fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(color: AppColors.textDark, fontSize: 12, height: 1.5),
                      children: [
                        TextSpan(text: 'Dengan setoran awal '),
                        TextSpan(text: 'Rp 1.500.000', style: TextStyle(fontWeight: FontWeight.bold)),
                        TextSpan(text: ', kamu hanya perlu menabung '),
                        TextSpan(text: 'Rp 3.375.000/bulan', style: TextStyle(color: AppColors.secondary, fontWeight: FontWeight.bold)),
                        TextSpan(text: ' atau sekitar '),
                        TextSpan(text: 'Rp 112.500/hari', style: TextStyle(color: AppColors.secondary, fontWeight: FontWeight.bold)),
                        TextSpan(text: ' agar target laptop tercapai sebelum tahun baru!'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Row(
                          children: const [
                            Icon(Icons.trending_up, color: AppColors.textMuted, size: 16),
                            SizedBox(width: 6),
                            Expanded(
                              child: Text.rich(
                                TextSpan(
                                  children: [
                                    TextSpan(text: 'Potensi Tercapai: ', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
                                    TextSpan(text: '98%\n', style: TextStyle(color: AppColors.textDark, fontSize: 10, fontWeight: FontWeight.bold)),
                                    TextSpan(text: 'Realistis', style: TextStyle(color: AppColors.textDark, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Text(
                          'Tanpa Ganggu Pengeluaran\nRutin',
                          style: TextStyle(color: AppColors.primaryBrown, fontSize: 10, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
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
                onPressed: () {
                  final String title = _nameController.text.trim();
                  final String amount = _amountController.text.trim();
                  final String initial = _initialDepositController.text.trim();

                  Navigator.pop(context, {
                    'title': title.isEmpty ? 'MacBook Pro M3 Max' : title,
                    'target': amount.isEmpty ? '15.000.000' : amount,
                    'collected': initial.isEmpty ? '0' : initial,
                    'icon': _selectedIcon,
                  });
                },
                icon: const Icon(Icons.check_circle_outline, color: Colors.white),
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
                onPressed: () {},
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

  Widget _buildQuickAmount(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F0EB),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: AppColors.textDark,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
