import 'package:flutter/material.dart';
import '../utils/theme.dart';
import 'notification_screen.dart';

class AiChatScreen extends StatefulWidget {
  const AiChatScreen({super.key});

  @override
  State<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends State<AiChatScreen> {
  final TextEditingController _controller = TextEditingController();

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
          'Dashboard',
          style: TextStyle(color: Color(0xFF2C1A14), fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Color(0xFF2C1A14)),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const NotificationScreen()));
            },
          ),
          Container(
            margin: const EdgeInsets.only(right: 16),
            child: const CircleAvatar(
              radius: 16,
              backgroundColor: Color(0xFF5E2B16),
              child: Icon(Icons.person, color: Colors.white, size: 20),
            ),
          )
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFEFE8E1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'Analisis Periode: 1 - 7 September 2026',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF8C827A)),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _buildBotMessage(
                  'Halo Keisya! 👋 Aku asisten keuangan AI MoneyMate. Ada yang ingin kamu ketahui tentang pengeluaran, tips menabung, atau analisis budget-mu bulan ini?',
                  '09:40',
                ),
                const SizedBox(height: 16),
                _buildUserMessage(
                  'Bulan ini pengeluaran terbesar aku di mana ya? Dan gimana tips hematnya?',
                  '09:41',
                ),
                const SizedBox(height: 16),
                _buildBotAnalysisMessage(),
              ],
            ),
          ),
          _buildBottomInput(),
        ],
      ),
    );
  }

  Widget _buildBotMessage(String text, String time) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const CircleAvatar(
          radius: 16,
          backgroundColor: Color(0xFFFDF3F0),
          child: Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(20),
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              border: Border.all(color: const Color(0xFFF0EAE1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  text,
                  style: const TextStyle(fontSize: 13, color: Color(0xFF2C1A14), height: 1.4),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 40),
      ],
    );
  }

  Widget _buildUserMessage(String text, String time) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        const SizedBox(width: 40),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFF8C381E),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
                bottomLeft: Radius.circular(20),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  text,
                  style: const TextStyle(fontSize: 13, color: Colors.white, height: 1.4),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      time,
                      style: TextStyle(fontSize: 10, color: Colors.white.withOpacity(0.7)),
                    ),
                    const SizedBox(width: 4),
                    Icon(Icons.done_all, size: 14, color: Colors.white.withOpacity(0.7)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBotAnalysisMessage() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const CircleAvatar(
          radius: 16,
          backgroundColor: Color(0xFFFDF3F0),
          child: Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(20),
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              border: Border.all(color: const Color(0xFFF0EAE1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Icon(Icons.show_chart, size: 16, color: Color(0xFF8C381E)),
                    SizedBox(width: 8),
                    Text(
                      'Audit Pengeluaran Mingguan',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF8C381E)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Berdasarkan catatan transaksi kamu per 1-7 September 2026:',
                  style: TextStyle(fontSize: 13, color: Color(0xFF2C1A14)),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9F7F5),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          const CircleAvatar(
                            backgroundColor: Color(0xFFFDF3F0),
                            radius: 14,
                            child: Icon(Icons.fastfood, size: 14, color: Color(0xFF8C381E)),
                          ),
                          const SizedBox(width: 8),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Makanan & Minuman', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                Text('42% dari total pengeluaran', style: TextStyle(color: Color(0xFF8C827A), fontSize: 11)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFEBEA),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text('-Rp 1.420.000', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
                          )
                        ],
                      ),
                      const SizedBox(height: 12),
                      LinearProgressIndicator(
                        value: 0.42,
                        backgroundColor: const Color(0xFFEFE8E1),
                        color: const Color(0xFF8C381E),
                        minHeight: 6,
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text('💡 Rekomendasi AI Terarah:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF2C1A14))),
                const SizedBox(height: 12),
                _buildTipItem('1', 'Kurangi frekuensi beli kopi kekinian (potensi hemat ±Rp 180.000/minggu).'),
                const SizedBox(height: 8),
                _buildTipItem('2', 'Alokasikan meal prep untuk 3 hari kerja — hemat hingga Rp 400.000 bulan ini.'),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFDF3F0),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.flag_outlined, color: Color(0xFF8C381E), size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: RichText(
                          text: const TextSpan(
                            style: TextStyle(color: Color(0xFF8C381E), fontSize: 11, height: 1.4),
                            children: [
                              TextSpan(text: 'Dengan cara ini, sisa target goal \'Laptop Baru\' kamu bisa tercapai '),
                              TextSpan(text: '1 bulan lebih cepat! 🎯', style: TextStyle(fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.thumb_up_alt_outlined, size: 14, color: Color(0xFF8C827A)),
                        SizedBox(width: 4),
                        Text('Bermanfaat', style: TextStyle(color: Color(0xFF8C827A), fontSize: 11)),
                        SizedBox(width: 12),
                        Icon(Icons.copy_outlined, size: 14, color: Color(0xFF8C827A)),
                      ],
                    ),
                    const Text('09:41', style: TextStyle(color: Color(0xFF8C827A), fontSize: 10)),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 40),
      ],
    );
  }

  Widget _buildTipItem(String number, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 10,
          backgroundColor: const Color(0xFFF9F7F5),
          child: Text(number, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(fontSize: 12, color: Color(0xFF2C1A14), height: 1.4),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(Icons.lightbulb_outline, size: 16, color: Color(0xFF8C381E)),
              const SizedBox(width: 8),
              const Text('Saran Pertanyaan', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
              const Spacer(),
              const Text('Geser ke kanan →', style: TextStyle(fontSize: 10, color: Color(0xFF8C827A))),
            ],
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildSuggestionChip('Gimana cara nabung Rp 1 juta bulan depan?', Icons.savings_outlined),
                const SizedBox(width: 8),
                _buildSuggestionChip('Berapa sisa budget bulan ini?', Icons.account_balance_wallet_outlined),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9F7F5),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFF0EAE1)),
                  ),
                  child: Row(
                    children: [
                      const SizedBox(width: 16),
                      const Icon(Icons.mic_none, color: Color(0xFF8C827A), size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          controller: _controller,
                          decoration: const InputDecoration(
                            hintText: 'Ketik pertanyaan keuanganmu...',
                            hintStyle: TextStyle(fontSize: 13, color: Color(0xFF8C827A)),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: () {},
                child: const CircleAvatar(
                  radius: 24,
                  backgroundColor: Color(0xFF8C381E),
                  child: Icon(Icons.send_rounded, color: Colors.white, size: 20),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildSuggestionChip(String text, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE8F8F0)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: Colors.teal),
          const SizedBox(width: 6),
          Text(text, style: const TextStyle(fontSize: 11, color: Color(0xFF2C1A14))),
        ],
      ),
    );
  }
}
