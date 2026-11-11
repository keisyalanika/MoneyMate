import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_provider.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';
import 'notification_screen.dart';
import 'add_goal_screen.dart';

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

/// Data class untuk menyimpan goal yang di-extract oleh AI
class _AiGoalProposal {
  final String title;
  final double targetAmount;
  final DateTime deadline;
  final String icon;

  _AiGoalProposal({
    required this.title,
    required this.targetAmount,
    required this.deadline,
    required this.icon,
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
            text: 'Halo $nickname! 👋 Aku asisten keuangan AI MoneyMate. Aku bisa:\n\n'
                '🎯 Buatkan Goal tabungan langsung dari chat\n'
                '📊 Audit pengeluaran & anggaran kamu\n'
                '💡 Berikan tips keuangan personal\n\n'
                'Coba tanya: "Buatkan goal beli laptop 10 juta 6 bulan"',
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

  /// ===== EKSTRAK ANGKA DARI TEKS =====
  double _extractAmount(String text) {
    // Tangkap pola: "10 juta", "10juta", "1,5 juta", "500 ribu", "2.000.000"
    final jutaMatch = RegExp(r'(\d+(?:[.,]\d+)?)\s*juta').firstMatch(text);
    if (jutaMatch != null) {
      final raw = jutaMatch.group(1)!.replaceAll(',', '.');
      return (double.tryParse(raw) ?? 0) * 1_000_000;
    }
    final ribuMatch = RegExp(r'(\d+(?:[.,]\d+)?)\s*ribu').firstMatch(text);
    if (ribuMatch != null) {
      final raw = ribuMatch.group(1)!.replaceAll(',', '.');
      return (double.tryParse(raw) ?? 0) * 1_000;
    }
    final digitMatch = RegExp(r'(\d[\d.]{3,})').firstMatch(text);
    if (digitMatch != null) {
      return double.tryParse(digitMatch.group(1)!.replaceAll('.', '')) ?? 0;
    }
    return 0;
  }

  /// ===== EKSTRAK DURASI DARI TEKS =====
  DateTime _extractDeadline(String text) {
    final bulanMatch = RegExp(r'(\d+)\s*bulan').firstMatch(text);
    if (bulanMatch != null) {
      final months = int.tryParse(bulanMatch.group(1)!) ?? 6;
      return DateTime.now().add(Duration(days: months * 30));
    }
    final tahunMatch = RegExp(r'(\d+)\s*tahun').firstMatch(text);
    if (tahunMatch != null) {
      final years = int.tryParse(tahunMatch.group(1)!) ?? 1;
      return DateTime.now().add(Duration(days: years * 365));
    }
    final hariMatch = RegExp(r'(\d+)\s*hari').firstMatch(text);
    if (hariMatch != null) {
      final days = int.tryParse(hariMatch.group(1)!) ?? 90;
      return DateTime.now().add(Duration(days: days));
    }
    // Default: 6 bulan
    return DateTime.now().add(const Duration(days: 180));
  }

  /// ===== EKSTRAK JUDUL GOAL DARI TEKS =====
  String _extractGoalTitle(String text) {
    // Cari kata kunci spesifik terlebih dahulu
    final keywords = {
      'laptop': 'Laptop Baru',
      'hp': 'Smartphone Baru',
      'handphone': 'Smartphone Baru',
      'smartphone': 'Smartphone Baru',
      'iphone': 'iPhone Baru',
      'motor': 'Motor Baru',
      'mobil': 'Mobil Baru',
      'rumah': 'Rumah / Hunian',
      'kamera': 'Kamera Baru',
      'liburan': 'Dana Liburan',
      'nikah': 'Dana Pernikahan',
      'menikah': 'Dana Pernikahan',
      'darurat': 'Dana Darurat',
      'bisnis': 'Modal Usaha/Bisnis',
      'usaha': 'Modal Usaha/Bisnis',
      'kuliah': 'Dana Pendidikan',
      'sekolah': 'Dana Pendidikan',
      'buku': 'Dana Buku & Alat Tulis',
      'gadget': 'Gadget Baru',
      'gaming': 'Perangkat Gaming',
    };
    for (final entry in keywords.entries) {
      if (text.contains(entry.key)) return entry.value;
    }
    // Coba ambil kata setelah "beli", "goal", "target", "untuk", "nabung"
    final afterKeyword = RegExp(
      r'(?:beli|goal|target|buat|tabungan|nabung untuk|simpan untuk)\s+(.{3,30}?)(?:\s*\d|\s*rp|$)',
    ).firstMatch(text);
    if (afterKeyword != null) {
      final raw = afterKeyword.group(1)!.trim();
      if (raw.isNotEmpty) {
        return raw[0].toUpperCase() + raw.substring(1);
      }
    }
    return 'Target Impian Baru';
  }

  /// ===== PILIH ICON GOAL DARI JUDUL =====
  String _pickGoalIcon(String title) {
    final t = title.toLowerCase();
    if (t.contains('laptop') || t.contains('komputer') || t.contains('pc')) return 'laptop';
    if (t.contains('motor') || t.contains('mobil') || t.contains('kendaraan')) return 'car';
    if (t.contains('rumah') || t.contains('hunian') || t.contains('kos')) return 'home';
    if (t.contains('liburan') || t.contains('wisata') || t.contains('travel')) return 'flight';
    if (t.contains('usaha') || t.contains('bisnis') || t.contains('modal')) return 'savings';
    return 'diamond';
  }

  /// ===== CEK APAKAH PESAN ADALAH PERMINTAAN BUAT GOAL =====
  _AiGoalProposal? _tryExtractGoal(String text) {
    final q = text.toLowerCase();
    final isGoalIntent =
        (q.contains('buatkan') || q.contains('buat') || q.contains('bantu')) &&
            (q.contains('goal') ||
                q.contains('target') ||
                q.contains('nabung') ||
                q.contains('tabung') ||
                q.contains('simpan')) ||
        q.contains('goal') && _extractAmount(q) > 0 ||
        q.contains('target') && _extractAmount(q) > 0 ||
        (q.contains('beli') || q.contains('beli')) && _extractAmount(q) > 0;

    if (!isGoalIntent) return null;

    final amount = _extractAmount(q);
    if (amount <= 0) return null;

    final title = _extractGoalTitle(q);
    final deadline = _extractDeadline(q);
    final icon = _pickGoalIcon(title);

    return _AiGoalProposal(
      title: title,
      targetAmount: amount,
      deadline: deadline,
      icon: icon,
    );
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

    // ===== 0. CEK APAKAH PERMINTAAN BUAT GOAL =====
    final goalProposal = _tryExtractGoal(q);
    if (goalProposal != null) {
      return _ChatMessageItem(
        text: '',
        isUser: false,
        time: now,
        customWidget: _buildGoalProposalCard(goalProposal, now),
      );
    }

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

    // 2. Nabung / Cara Nabung / Goals / Tabungan (tips, bukan buat goal)
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
            '   Terapkan jeda 24 jam sebelum checkout belanja online non-pokok.\n\n'
            '💡 Mau aku bantu buatkan goal langsung? Coba ketik: "Buat goal beli laptop 10 juta 6 bulan"',
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
        text: 'Halo $nickname! 😊 Senang bisa ngobrol denganmu. Aku siap membantumu mengelola keuangan, cek audit pengeluaran, tips hemat, atau rencana menabung.\n\n'
            '🎯 Baru! Aku sekarang bisa buatkan goal tabungan langsung dari chat. Coba: "Buatkan goal beli iPhone 15 juta 8 bulan"',
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
      text: 'Pertanyaan yang menarik, $nickname! Sebagai asisten keuanganmu, aku menyarankan untuk selalu mencatat setiap transaksi masuk dan keluar di MoneyMate. Dengan begitu, kita bisa menganalisis cashflow dan membuat rekomendasi finansial yang semakin akurat untukmu.\n\n'
          '🎯 Tahu gak? Kamu bisa minta aku buatkan goal tabungan langsung! Contoh: "Buatkan goal dana darurat 5 juta 4 bulan"',
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
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
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

  // ==================== KARTU PROPOSAL GOAL AI ====================
  Widget _buildGoalProposalCard(_AiGoalProposal proposal, String time) {
    final totalMonths = proposal.deadline.difference(DateTime.now()).inDays ~/ 30;
    final monthlyNeeded = totalMonths > 0 ? proposal.targetAmount / totalMonths : proposal.targetAmount;
    final deadlineStr = '${proposal.deadline.day} ${_monthName(proposal.deadline.month)} ${proposal.deadline.year}';
    bool _isSaving = false;

    return StatefulBuilder(
      builder: (ctx, setCardState) {
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
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20),
                  ),
                  border: Border.all(color: const Color(0xFFF0EAE1)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: const BoxDecoration(
                        color: Color(0xFF592314),
                        borderRadius: BorderRadius.only(
                          topRight: Radius.circular(20),
                          topLeft: Radius.circular(0),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.auto_awesome, color: Colors.white, size: 14),
                          const SizedBox(width: 6),
                          const Expanded(
                            child: Text(
                              'AI menemukan Goal untukmu! 🎯',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ),
                          Text(time, style: const TextStyle(color: Colors.white60, fontSize: 10)),
                        ],
                      ),
                    ),

                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Info Goal
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFAF0EB),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Icon(_iconFromKey(proposal.icon), color: const Color(0xFF8C381E), size: 24),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      proposal.title,
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF2C1A14),
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      'Target: Rp ${_formatCurrency(proposal.targetAmount)}',
                                      style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // Detail Cards
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFAF7F4),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: const Color(0xFFEFE8E0)),
                            ),
                            child: Column(
                              children: [
                                _buildDetailRow(Icons.calendar_today_outlined, 'Batas Waktu', deadlineStr),
                                const SizedBox(height: 8),
                                _buildDetailRow(Icons.savings_outlined, 'Setoran/Bulan',
                                    'Rp ${_formatCurrency(monthlyNeeded)}'),
                                const SizedBox(height: 8),
                                _buildDetailRow(Icons.timelapse_rounded, 'Durasi',
                                    totalMonths > 0 ? '$totalMonths bulan' : 'Kurang dari 1 bulan'),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Tombol Simpan Langsung
                          SizedBox(
                            width: double.infinity,
                            height: 46,
                            child: ElevatedButton.icon(
                              onPressed: _isSaving
                                  ? null
                                  : () async {
                                      setCardState(() => _isSaving = true);
                                      final deadlineStr = '${proposal.deadline.year}'
                                          '-${proposal.deadline.month.toString().padLeft(2, '0')}'
                                          '-${proposal.deadline.day.toString().padLeft(2, '0')}';
                                      final success = await ApiService.addGoal({
                                        'title': proposal.title,
                                        'target_amount': proposal.targetAmount,
                                        'current_amount': 0,
                                        'icon': proposal.icon,
                                        'deadline': deadlineStr,
                                      });
                                      setCardState(() => _isSaving = false);
                                      if (!context.mounted) return;
                                      if (success) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            content: Text('✅ Goal "${proposal.title}" berhasil dibuat!'),
                                            backgroundColor: const Color(0xFF27AE60),
                                            behavior: SnackBarBehavior.floating,
                                          ),
                                        );
                                        final now = DateFormat('HH:mm').format(DateTime.now());
                                        setState(() {
                                          _messages.add(_ChatMessageItem(
                                            text: '🎉 Goal "${proposal.title}" sudah aktif! Mulai sisihkan Rp ${_formatCurrency(monthlyNeeded)}/bulan untuk mencapai targetmu pada $deadlineStr. Semangat! 💪',
                                            isUser: false,
                                            time: now,
                                          ));
                                        });
                                        _scrollToBottom();
                                      } else {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Gagal menyimpan goal. Coba lagi.')),
                                        );
                                      }
                                    },
                              icon: _isSaving
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                    )
                                  : const Icon(Icons.rocket_launch_rounded, color: Colors.white, size: 18),
                              label: Text(
                                _isSaving ? 'Menyimpan...' : '🚀 Simpan & Aktifkan Goal',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF592314),
                                elevation: 0,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(23)),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),

                          // Tombol Sesuaikan / Edit Dulu
                          SizedBox(
                            width: double.infinity,
                            height: 42,
                            child: OutlinedButton.icon(
                              onPressed: () async {
                                final deadlineStr = '${proposal.deadline.year}'
                                    '-${proposal.deadline.month.toString().padLeft(2, '0')}'
                                    '-${proposal.deadline.day.toString().padLeft(2, '0')}';
                                final result = await Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => AddGoalScreen(
                                      initialDraft: {
                                        'title': proposal.title,
                                        'target_amount': proposal.targetAmount,
                                        'icon': proposal.icon,
                                        'deadline': deadlineStr,
                                      },
                                    ),
                                  ),
                                );
                                if (result == true && context.mounted) {
                                  final now = DateFormat('HH:mm').format(DateTime.now());
                                  setState(() {
                                    _messages.add(_ChatMessageItem(
                                      text: '✅ Goal sudah disimpan! Semangat menabung ya, ${ Provider.of<AuthProvider>(context, listen: false).userNickname}! 🎯',
                                      isUser: false,
                                      time: now,
                                    ));
                                  });
                                  _scrollToBottom();
                                }
                              },
                              icon: const Icon(Icons.edit_note_rounded, size: 18, color: Color(0xFF592314)),
                              label: const Text(
                                'Sesuaikan & Edit Dulu',
                                style: TextStyle(color: Color(0xFF592314), fontWeight: FontWeight.w600, fontSize: 13),
                              ),
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: Color(0xFF592314)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(21)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 40),
          ],
        );
      },
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 14, color: const Color(0xFF8C381E)),
        const SizedBox(width: 8),
        Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A))),
        const Spacer(),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
      ],
    );
  }

  IconData _iconFromKey(String key) {
    switch (key) {
      case 'laptop': return Icons.laptop_mac;
      case 'car': return Icons.directions_car;
      case 'home': return Icons.home;
      case 'flight': return Icons.flight_takeoff;
      case 'savings': return Icons.savings;
      default: return Icons.diamond;
    }
  }

  String _monthName(int month) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return months[month - 1];
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
            children: const [
              Icon(Icons.lightbulb_outline, size: 16, color: Color(0xFF8C381E)),
              SizedBox(width: 8),
              Text('Saran Pertanyaan', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
              Spacer(),
              Text('Geser ke kanan →', style: TextStyle(fontSize: 10, color: Color(0xFF8C827A))),
            ],
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildSuggestionChip('Buatkan goal laptop 10 juta 6 bulan', Icons.laptop_mac_outlined),
                const SizedBox(width: 8),
                _buildSuggestionChip('Buat goal dana darurat 5 juta 4 bulan', Icons.shield_outlined),
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
                            hintText: 'Ketik atau "Buat goal..." untuk AI Goal...',
                            hintStyle: TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
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
