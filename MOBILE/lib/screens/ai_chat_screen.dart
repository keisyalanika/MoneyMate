import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_provider.dart';
import '../utils/theme.dart';
import 'notification_screen.dart';

class _ChatMessageItem {
  final String text;
  final bool isUser;
  final String time;
  final Widget? customWidget;

  _ChatMessageItem({
    required this.text,
    required this.isUser,
    required this.time,
    this.customWidget,
  });
}

class AiChatScreen extends StatefulWidget {
  const AiChatScreen({super.key});

  @override
  State<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends State<AiChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_ChatMessageItem> _messages = [];
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final nickname = auth.userNickname;
      final now = DateFormat('HH:mm').format(DateTime.now());
      setState(() {
        _messages.add(
          _ChatMessageItem(
            text: 'Halo $nickname! 👋 Aku asisten keuangan AI MoneyMate. Ada yang ingin kamu ketahui tentang pengeluaran, tips menabung, atau analisis budget-mu bulan ini?',
            isUser: false,
            time: now,
          ),
        );
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _formatCurrency(double value) {
    final intVal = value.round();
    final chars = intVal.toString().split('');
    final buffer = StringBuffer();
    for (int i = 0; i < chars.length; i++) {
      if (i > 0 && (chars.length - i) % 3 == 0) {
        buffer.write('.');
      }
      buffer.write(chars[i]);
    }
    return buffer.toString();
  }

  void _sendMessage([String? presetText]) {
    final text = (presetText ?? _controller.text).trim();
    if (text.isEmpty) return;

    final now = DateFormat('HH:mm').format(DateTime.now());
    setState(() {
      _messages.add(_ChatMessageItem(
        text: text,
        isUser: true,
        time: now,
      ));
      _isTyping = true;
    });

    if (presetText == null) {
      _controller.clear();
    }
    _scrollToBottom();

    // Delay natural simulasi asisten AI
    Future.delayed(const Duration(milliseconds: 850), () {
      if (!mounted) return;
      final responseItem = _generateBotResponse(text);
      setState(() {
        _isTyping = false;
        _messages.add(responseItem);
      });
      _scrollToBottom();
    });
  }

  _ChatMessageItem _generateBotResponse(String query) {
    final q = query.toLowerCase();
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final nickname = auth.userNickname;
    final now = DateFormat('HH:mm').format(DateTime.now());

    // 1. Audit / Pengeluaran Terbesar / Makanan / Boros
    if (q.contains('pengeluaran') ||
        q.contains('boros') ||
        q.contains('audit') ||
        q.contains('makan') ||
        q.contains('terbesar')) {
      return _ChatMessageItem(
        text: 'Berdasarkan audit riwayat pengeluaranmu minggu ini, pos terbesar berada di kategori Makanan & Minuman sebesar Rp 1.420.000.',
        isUser: false,
        time: now,
        customWidget: _buildBotAnalysisMessage(now),
      );
    }

    // 2. Nabung / Cara Nabung / Goals / Tabungan
    if (q.contains('nabung') ||
        q.contains('menabung') ||
        q.contains('tabung') ||
        q.contains('goal') ||
        q.contains('target')) {
      return _ChatMessageItem(
        text: 'Tentu $nickname! Berikut strategi realistis untuk mencapai target tabunganmu:\n\n'
            '1. Terapkan Aturan 50/30/20:\n'
            '   • 50% untuk kebutuhan pokok sehari-hari\n'
            '   • 30% untuk keperluan pribadi & hiburan\n'
            '   • 20% langsung sisihkan untuk tabungan di awal bulan.\n\n'
            '2. Gunakan Rekening Terpisah / Fitur Goals:\n'
            '   Pisahkan uang tabungan dari saldo aktif harian agar tidak terpakai jajan.\n\n'
            '3. Tekan Pengeluaran Impulsif:\n'
            '   Terapkan jeda 24 jam sebelum checkout belanja online non-pokok.',
        isUser: false,
        time: now,
      );
    }

    // 3. Sisa Budget / Anggaran / Saldo
    if (q.contains('budget') || q.contains('anggaran') || q.contains('saldo')) {
      final saldoFormatted = _formatCurrency(auth.saldo);
      final sisaBudgetFormatted = _formatCurrency(auth.sisaBudget);
      return _ChatMessageItem(
        text: 'Ringkasan posisi keuanganmu saat ini, $nickname:\n\n'
            '💰 Total Saldo Aktif: Rp $saldoFormatted\n'
            '📊 Sisa Batas Anggaran: Rp $sisaBudgetFormatted\n\n'
            'Status anggaranmu masih dalam batas aman (hijau). Pertahankan pengeluaran harian di bawah rata-rata Rp 50.000 agar pagu budget tidak terlampaui sampai akhir bulan!',
        isUser: false,
        time: now,
      );
    }

    // 4. Sapaan / Salam
    if (q.contains('hai') ||
        q.contains('halo') ||
        q.contains('hello') ||
        q.contains('pagi') ||
        q.contains('siang') ||
        q.contains('malam') ||
        q == 'p') {
      return _ChatMessageItem(
        text: 'Halo $nickname! 😊 Senang bisa ngobrol denganmu. Aku siap membantumu mengelola keuangan, cek audit pengeluaran, tips hemat, atau rencana menabung. Apa yang ingin kamu tanyakan hari ini?',
        isUser: false,
        time: now,
      );
    }

    // 5. Investasi / Reksadana / Saham
    if (q.contains('invest') || q.contains('reksadana') || q.contains('saham')) {
      return _ChatMessageItem(
        text: 'Keren $nickname! Untuk pemula, prioritaskan Dana Darurat terlebih dahulu (minimal 3-6x pengeluaran bulanan). Jika sudah aman, kamu bisa mulai dari instrumen berisiko rendah seperti Reksadana Pasar Uang (RPU) atau Surat Berharga Negara (SBN).',
        isUser: false,
        time: now,
      );
    }

    // 6. Respon Umum Finansial
    return _ChatMessageItem(
      text: 'Pertanyaan yang menarik, $nickname! Sebagai asisten keuanganmu, aku menyarankan untuk selalu mencatat setiap transaksi masuk dan keluar di MoneyMate. Dengan begitu, kita bisa menganalisis cashflow dan membuat rekomendasi finansial yang semakin akurat untukmu. Ada hal spesifik lain tentang budget atau tabungan yang ingin kita bahas?',
      isUser: false,
      time: now,
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

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
          'Asisten AI MoneyMate',
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
            child: CircleAvatar(
              radius: 16,
              backgroundColor: const Color(0xFF5E2B16),
              child: Text(
                auth.userInitial,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
              ),
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
              'Analisis Periode: Bulan Ini',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF8C827A)),
            ),
          ),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isTyping) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _buildTypingIndicator(),
                  );
                }

                final item = _messages[index];
                if (item.customWidget != null) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: item.customWidget!,
                  );
                } else if (item.isUser) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _buildUserMessage(item.text, item.time),
                  );
                } else {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _buildBotMessage(item.text, item.time),
                  );
                }
              },
            ),
          ),
          _buildBottomInput(),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const CircleAvatar(
          radius: 16,
          backgroundColor: Color(0xFFFDF3F0),
          child: Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 20),
        ),
        const SizedBox(width: 12),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF0EAE1)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: const [
              SizedBox(
                width: 14,
                height: 14,
                child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF8C381E)),
              ),
              SizedBox(width: 8),
              Text(
                'MoneyMate AI sedang menganalisis...',
                style: TextStyle(fontSize: 12, color: Color(0xFF8C827A), fontStyle: FontStyle.italic),
              ),
            ],
          ),
        ),
      ],
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

  Widget _buildBotAnalysisMessage(String time) {
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
                  'Berdasarkan catatan transaksi kamu minggu ini:',
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
                              TextSpan(text: 'Dengan cara ini, sisa target goal kamu bisa tercapai '),
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
                    Text(time, style: const TextStyle(color: Color(0xFF8C827A), fontSize: 10)),
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
                const SizedBox(width: 8),
                _buildSuggestionChip('Audit pengeluaran terbesar saya', Icons.analytics_outlined),
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
                          textInputAction: TextInputAction.send,
                          onSubmitted: (_) => _sendMessage(),
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
                onTap: () => _sendMessage(),
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
    return GestureDetector(
      onTap: () => _sendMessage(text),
      child: Container(
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
      ),
    );
  }
}
