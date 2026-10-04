import 'package:flutter/material.dart';

class AiInsightScreen extends StatelessWidget {
  const AiInsightScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8F5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new,
              color: Color(0xFF2C1A14), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Insight Keuangan AI',
            style: TextStyle(
                color: Color(0xFF2C1A14),
                fontWeight: FontWeight.bold,
                fontSize: 18)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Alert Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFFDF3F0),
                borderRadius: BorderRadius.circular(20),
                border:
                    Border.all(color: const Color(0xFF8C381E).withOpacity(0.3)),
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
                            borderRadius: BorderRadius.circular(10)),
                        child: const Icon(Icons.auto_awesome,
                            color: Colors.white, size: 18),
                      ),
                      const SizedBox(width: 12),
                      const Text('ANALISIS MINGGU INI',
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF8C381E))),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Pengeluaran Makanan Meningkat 20%',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2C1A14)),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Ada risiko budget bulanan habis sebelum akhir bulan jika tren transaksi ini berlanjut.',
                    style: TextStyle(
                        fontSize: 13, color: Color(0xFF8C827A), height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('REKOMENDASI SOLUSI AI',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF8C827A))),
            const SizedBox(height: 12),

            _buildRecommendationCard(
              icon: '🎯',
              title: 'Tekan Batas Harian Makanan',
              description:
                  'Turunkan batas jajan dari Rp 50.000 ke Rp 30.000/hari hingga akhir bulan.',
              buttonText: 'Terapkan Batas Baru',
              onPressed: () {},
            ),
            _buildRecommendationCard(
              icon: '🔄',
              title: 'Alokasi Budget Hiburan',
              description:
                  'Pindahkan sisa budget Hiburan sebesar Rp 150.000 ke kategori Makanan.',
              buttonText: 'Pindahkan Budget',
              onPressed: () {},
            ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Tanya MoneyMate AI...',
                  hintStyle:
                      const TextStyle(fontSize: 13, color: Color(0xFF8C827A)),
                  filled: true,
                  fillColor: const Color(0xFFFAF8F5),
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Container(
              decoration: BoxDecoration(
                  color: const Color(0xFF8C381E),
                  borderRadius: BorderRadius.circular(12)),
              child: IconButton(
                icon: const Icon(Icons.send_rounded,
                    color: Colors.white, size: 20),
                onPressed: () {},
              ),
            )
          ],
        ),
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
                child: Text(title,
                    style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2C1A14))),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(description,
              style: const TextStyle(
                  fontSize: 13, color: Color(0xFF8C827A), height: 1.3)),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 40,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF8C381E)),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: onPressed,
              child: Text(buttonText,
                  style: const TextStyle(
                      color: Color(0xFF8C381E),
                      fontWeight: FontWeight.bold,
                      fontSize: 13)),
            ),
          ),
        ],
      ),
    );
  }
}
