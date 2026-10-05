import 'package:flutter/material.dart';
import 'ai_chat_screen.dart';

class AiInsightScreen extends StatefulWidget {
  const AiInsightScreen({super.key});

  @override
  State<AiInsightScreen> createState() => _AiInsightScreenState();
}

class _AiInsightScreenState extends State<AiInsightScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8F5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Color(0xFF2C1A14), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'AI Financial Insight',
          style: TextStyle(color: Color(0xFF2C1A14), fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
        actions: [
          GestureDetector(
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const AiChatScreen()));
            },
            child: Container(
              margin: const EdgeInsets.only(right: 16),
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: Color(0xFFF0EAE1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 20),
            ),
          )
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFFEFE8E1),
              borderRadius: BorderRadius.circular(24),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                color: const Color(0xFF3F1D0B),
                borderRadius: BorderRadius.circular(20),
              ),
              labelColor: Colors.white,
              unselectedLabelColor: const Color(0xFF8C827A),
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal, fontSize: 12),
              dividerColor: Colors.transparent,
              indicatorSize: TabBarIndicatorSize.tab,
              tabs: const [
                Tab(text: 'Ringkasan'),
                Tab(text: 'Prediksi Budget'),
                Tab(text: 'Rekomendasi'),
              ],
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildRingkasanTab(),
          _buildPrediksiTab(),
          _buildRekomendasiTab(),
        ],
      ),
    );
  }

  // ==================== TAB 1: RINGKASAN ====================
  Widget _buildRingkasanTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Halo User Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF0EAE1)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Halo, Keisya!', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                      SizedBox(height: 4),
                      Text('Berikut adalah analisis keuangan kamu berdasarkan pola pengeluaran bulan ini.', style: TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFDF3F0),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 32),
                )
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Kondisi Keuangan
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF0EAE1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Kondisi Keuangan Kamu', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2C1A14))),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F8F0),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('Dalam Batas Aman', style: TextStyle(color: Colors.teal, fontSize: 10, fontWeight: FontWeight.bold)),
                    )
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Total Pemasukan', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                          SizedBox(height: 4),
                          Text('Rp 4.500.000', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Total Pengeluaran', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                          SizedBox(height: 4),
                          Text('Rp 3.200.000', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Divider(color: Color(0xFFF0EAE1)),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Sisa Saldo', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                        SizedBox(height: 4),
                        Text('Rp 1.300.000', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                      ],
                    ),
                    const Icon(Icons.bar_chart, color: Color(0xFF8C381E), size: 32),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Insight Singkat
          const Text('Insight Singkat', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2C1A14))),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF0EAE1)),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  backgroundColor: Color(0xFFFDF3F0),
                  child: Icon(Icons.lightbulb_outline, color: Color(0xFF8C381E)),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Text(
                    'Pengeluaran kamu masih sesuai dengan budget bulan ini. Tetap jaga konsistensi ya!',
                    style: TextStyle(fontSize: 12, color: Color(0xFF8C827A), height: 1.4),
                  ),
                ),
                const Icon(Icons.chevron_right, color: Color(0xFF8C827A)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==================== TAB 2: PREDIKSI BUDGET ====================
  Widget _buildPrediksiTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.auto_awesome, color: Color(0xFF8C381E), size: 16),
              SizedBox(width: 8),
              Text('Prediksi Budget', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF2C1A14))),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Berdasarkan pola pengeluaran kamu, berikut prediksi penggunaan budget untuk bulan depan.',
            style: TextStyle(fontSize: 12, color: Color(0xFF8C827A), height: 1.4),
          ),
          const SizedBox(height: 24),
          _buildBudgetProgressCard('Makanan', 'Rp 850.000 / Rp 1.000.000', Icons.restaurant, 0.85, true),
          _buildBudgetProgressCard('Transportasi', 'Rp 300.000 / Rp 500.000', Icons.directions_car, 0.60, false),
          _buildBudgetProgressCard('Pendidikan', 'Rp 400.000 / Rp 600.000', Icons.book, 0.67, false),
          _buildBudgetProgressCard('Hiburan', 'Rp 250.000 / Rp 500.000', Icons.music_note, 0.50, false),
          
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFDF3F0),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF8C381E).withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.warning_amber_rounded, color: Color(0xFF8C381E)),
                const SizedBox(width: 12),
                Expanded(
                  child: RichText(
                    text: const TextSpan(
                      style: TextStyle(fontSize: 12, color: Color(0xFF8C381E), height: 1.4),
                      children: [
                        TextSpan(text: 'Diperkirakan budget makanan akan habis dalam '),
                        TextSpan(text: '5 hari jika pola pengeluaran tetap sama.', style: TextStyle(fontWeight: FontWeight.bold)),
                      ]
                    )
                  )
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildBudgetProgressCard(String title, String amount, IconData icon, double progress, bool isRisiko) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF0EAE1)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9F7F5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: const Color(0xFF8C381E), size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2C1A14))),
                    const SizedBox(height: 4),
                    Text(amount, style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isRisiko ? const Color(0xFFFFEBEA) : const Color(0xFFE8F8F0),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  isRisiko ? 'Berisiko' : 'Aman',
                  style: TextStyle(color: isRisiko ? Colors.red : Colors.teal, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              )
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: progress,
                  backgroundColor: const Color(0xFFEFE8E1),
                  color: const Color(0xFF8C381E),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(width: 12),
              Text('${(progress * 100).toInt()}%', style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
            ],
          )
        ],
      ),
    );
  }

  // ==================== TAB 3: REKOMENDASI ====================
  Widget _buildRekomendasiTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Alert Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFFDF3F0),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF8C381E).withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF8C381E),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'ANALISIS MINGGU INI',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF8C381E)),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Text(
                  'Pengeluaran Makanan Meningkat 20%',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Ada risiko budget bulanan habis sebelum akhir bulan jika tren transaksi ini berlanjut.',
                  style: TextStyle(fontSize: 13, color: Color(0xFF8C827A), height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'REKOMENDASI SOLUSI AI',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF8C827A)),
          ),
          const SizedBox(height: 12),
          _buildRecommendationCard(
            icon: '🎯',
            title: 'Tekan Batas Harian Makanan',
            description: 'Turunkan batas jajan dari Rp 50.000 ke Rp 30.000/hari hingga akhir bulan.',
            buttonText: 'Terapkan Batas Baru',
            onPressed: () {},
          ),
          _buildRecommendationCard(
            icon: '🔄',
            title: 'Alokasi Budget Hiburan',
            description: 'Pindahkan sisa budget Hiburan sebesar Rp 150.000 ke kategori Makanan.',
            buttonText: 'Pindahkan Budget',
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendationCard({
    required String icon,
    required String title,
    required String description,
    required String buttonText,
    required VoidCallback onPressed,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF0EAE1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 22)),
              const SizedBox(width: 10),
              Expanded(
                child: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(description, style: const TextStyle(fontSize: 13, color: Color(0xFF8C827A), height: 1.3)),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 40,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF8C381E)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: onPressed,
              child: Text(buttonText, style: const TextStyle(color: Color(0xFF8C381E), fontWeight: FontWeight.bold, fontSize: 13)),
            ),
          ),
        ],
      ),
    );
  }
}
