import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'notification_screen.dart';

// Model pesan chat
class _ChatMessage {
  final String text;
  final bool isUser;
  final String time;
  final String? tip;

  _ChatMessage({
    required this.text,
    required this.isUser,
    required this.time,
    this.tip,
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
  bool _isLoading = false;

  final List<_ChatMessage> _messages = [
    _ChatMessage(
      text:
          'Halo! 👋 Aku asisten keuangan AI MoneyMate. Ada yang ingin kamu ketahui tentang pengeluaran, tips menabung, atau analisis budget-mu bulan ini?',
      isUser: false,
      time: _nowTime(),
    ),
  ];

  static String _nowTime() {
    final now = DateTime.now();
    final h = now.hour.toString().padLeft(2, '0');
    final m = now.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  Future<void> _sendMessage(String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty || _isLoading) return;

    _controller.clear();
    setState(() {
      _messages.add(_ChatMessage(text: trimmed, isUser: true, time: _nowTime()));
      _isLoading = true;
    });
    _scrollToBottom();

    try {
      final result = await ApiService.chatWithAi(trimmed);
      setState(() {
        _isLoading = false;
        if (result != null && result['reply'] != null) {
          _messages.add(_ChatMessage(
            text: result['reply'] as String,
            isUser: false,
            time: result['timestamp'] as String? ?? _nowTime(),
            tip: result['tip'] as String?,
          ));
        } else {
          _messages.add(_ChatMessage(
            text:
                'Maaf, aku sedang tidak bisa terhubung ke server. Pastikan koneksi internet kamu aktif, ya! 🔌',
            isUser: false,
            time: _nowTime(),
          ));
        }
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _messages.add(_ChatMessage(
          text: 'Terjadi kesalahan saat menghubungi AI. Coba lagi sebentar ya! 🙏',
          isUser: false,
          time: _nowTime(),
        ));
      });
    }
    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 150), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
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
          'AI Financial Chat',
          style: TextStyle(color: Color(0xFF2C1A14), fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Color(0xFF2C1A14)),
            onPressed: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => const NotificationScreen()));
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
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.smart_toy_outlined, size: 14, color: Color(0xFF8C381E)),
                SizedBox(width: 6),
                Text(
                  'Asisten AI MoneyMate · Online',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF8C827A)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isLoading) {
                  return _buildTypingIndicator();
                }
                final msg = _messages[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: msg.isUser
                      ? _buildUserMessage(msg.text, msg.time)
                      : _buildBotMessage(msg.text, msg.time, tip: msg.tip),
                );
              },
            ),
          ),
          _buildBottomInput(),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CircleAvatar(
            radius: 16,
            backgroundColor: Color(0xFFFDF3F0),
            child: Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 20),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(20),
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              border: Border.all(color: const Color(0xFFF0EAE1)),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _DotIndicator(delay: 0),
                SizedBox(width: 4),
                _DotIndicator(delay: 200),
                SizedBox(width: 4),
                _DotIndicator(delay: 400),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBotMessage(String text, String time, {String? tip}) {
    // Konversi markdown **bold** sederhana
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
                _buildRichText(text),
                if (tip != null && tip.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFDF3F0),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.flag_outlined, color: Color(0xFF8C381E), size: 14),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            tip,
                            style: const TextStyle(
                                fontSize: 11, color: Color(0xFF8C381E), height: 1.4),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 6),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    time,
                    style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 40),
      ],
    );
  }

  Widget _buildRichText(String text) {
    // Render **bold** sederhana tanpa package tambahan
    final parts = text.split('**');
    final spans = <TextSpan>[];
    for (int i = 0; i < parts.length; i++) {
      spans.add(TextSpan(
        text: parts[i],
        style: TextStyle(
          fontWeight: i.isOdd ? FontWeight.bold : FontWeight.normal,
          fontSize: 13,
          color: const Color(0xFF2C1A14),
          height: 1.4,
        ),
      ));
    }
    return RichText(text: TextSpan(children: spans));
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
                      style: TextStyle(fontSize: 10, color: Colors.white.withValues(alpha: 0.7)),
                    ),
                    const SizedBox(width: 4),
                    Icon(Icons.done_all,
                        size: 14, color: Colors.white.withValues(alpha: 0.7)),
                  ],
                ),
              ],
            ),
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
          const Row(
            children: [
              Icon(Icons.lightbulb_outline, size: 16, color: Color(0xFF8C381E)),
              SizedBox(width: 8),
              Text('Saran Pertanyaan',
                  style: TextStyle(
                      fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
              Spacer(),
              Text('Geser ke kanan →',
                  style: TextStyle(fontSize: 10, color: Color(0xFF8C827A))),
            ],
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildSuggestionChip(
                    'Pengeluaran terbesar aku di mana?', Icons.show_chart),
                const SizedBox(width: 8),
                _buildSuggestionChip(
                    'Tips hemat bulan ini?', Icons.savings_outlined),
                const SizedBox(width: 8),
                _buildSuggestionChip(
                    'Berapa saldo aktif ku?', Icons.account_balance_wallet_outlined),
                const SizedBox(width: 8),
                _buildSuggestionChip(
                    'Bagaimana kondisi anggaran ku?', Icons.pie_chart_outline),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Container(
                  constraints: const BoxConstraints(minHeight: 48),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9F7F5),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFF0EAE1)),
                  ),
                  child: Row(
                    children: [
                      const SizedBox(width: 16),
                      Expanded(
                        child: TextField(
                          controller: _controller,
                          enabled: !_isLoading,
                          textInputAction: TextInputAction.send,
                          onSubmitted: _sendMessage,
                          maxLines: null,
                          decoration: const InputDecoration(
                            hintText: 'Ketik pertanyaan keuanganmu...',
                            hintStyle:
                                TextStyle(fontSize: 13, color: Color(0xFF8C827A)),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: () => _sendMessage(_controller.text),
                child: CircleAvatar(
                  radius: 24,
                  backgroundColor: _isLoading
                      ? const Color(0xFFD4A99C)
                      : const Color(0xFF8C381E),
                  child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
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
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
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

// Widget animasi titik loading
class _DotIndicator extends StatefulWidget {
  final int delay;
  const _DotIndicator({required this.delay});

  @override
  State<_DotIndicator> createState() => _DotIndicatorState();
}

class _DotIndicatorState extends State<_DotIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _animation = Tween(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) _controller.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (_, __) => Opacity(
        opacity: _animation.value,
        child: const CircleAvatar(
          radius: 4,
          backgroundColor: Color(0xFF8C381E),
        ),
      ),
    );
  }
}
