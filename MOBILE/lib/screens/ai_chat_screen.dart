import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_provider.dart';
import '../services/ai_chat_service.dart';
import '../utils/theme.dart';
import '../widgets/user_avatar.dart';
import 'notification_screen.dart';

class _ChatMessageItem {
  final String text;
  final bool isUser;
  final String time;
  final Widget Function()? customWidgetBuilder;

  _ChatMessageItem({
    required this.text,
    required this.isUser,
    required this.time,
    this.customWidgetBuilder,
  });
}

/// Data class untuk menyimpan goal yang di-extract oleh AI
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
  int? _aiConversationId;
  final Set<int> _resolvedProposalIds = {};
  final Set<int> _processingProposalIds = {};

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

  Future<void> _sendMessage([String? presetText]) async {
    final text = (presetText ?? _controller.text).trim();
    if (text.isEmpty) return;

    final now = DateFormat('HH:mm').format(DateTime.now());
    setState(() {
      _messages.add(_ChatMessageItem(text: text, isUser: true, time: now));
      _isTyping = true;
    });

    if (presetText == null) {
      _controller.clear();
    }
    _scrollToBottom();

    final data = await AiChatService.sendMessage(
      message: text,
      conversationId: _aiConversationId,
    );

    if (!mounted) return;

    // Backend AI tidak tersedia: tampilkan pesan jujur, bukan jawaban dummy.
    if (data == null) {
      setState(() {
        _isTyping = false;
        _messages.add(_ChatMessageItem(
          text: 'Maaf, layanan AI sedang tidak tersedia. Periksa koneksi ke server lalu coba lagi.',
          isUser: false,
          time: now,
        ));
      });
      _scrollToBottom();
      return;
    }

    _aiConversationId = data['conversation_id'] as int?;
    final reply = (data['reply'] as String? ?? '').trim();
    final proposal = data['proposal'] as Map<String, dynamic>?;

    setState(() {
      _isTyping = false;
      _messages.add(_ChatMessageItem(
        text: reply,
        isUser: false,
        time: now,
        customWidgetBuilder: proposal != null ? () => _buildAiProposalCard(proposal) : null,
      ));
    });
    _scrollToBottom();
  }

  Widget _buildAiProposalCard(Map<String, dynamic> proposal) {
    final id = proposal['id'] as int?;
    final tool = proposal['tool_name'] as String? ?? '';
    final payload = (proposal['payload'] as Map?)?.cast<String, dynamic>() ?? {};
    final isResolved = id != null && _resolvedProposalIds.contains(id);
    final isProcessing = id != null && _processingProposalIds.contains(id);
    final actionsDisabled = id == null || isResolved || isProcessing;

    final labels = {
      'propose_transaction': 'Usulan catat transaksi',
      'propose_goal': 'Usulan buat goal',
      'propose_goal_fund': 'Usulan setor goal',
      'propose_budget': 'Usulan atur budget',
    };

    final amountValue = payload['amount'] ?? payload['target_amount'];
    final amount = amountValue is num
        ? NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0).format(amountValue)
        : '-';

    final details = <String>[
      if (payload['title'] != null) '${payload['title']}',
      if (payload['category_name'] != null) 'Kategori: ${payload['category_name']}',
      if (payload['note'] != null && payload['note'].toString().isNotEmpty) 'Catatan: ${payload['note']}',
      if (amount != '-') 'Nominal: $amount',
    ];

    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, size: 16, color: AppColors.primaryBrown),
              const SizedBox(width: 6),
              Text(
                labels[tool] ?? 'Usulan aksi',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark,
                ),
              ),
            ],
          ),
          if (details.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              details.join(String.fromCharCode(10)),
              style: const TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.5),
            ),
          ],
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: actionsDisabled ? null : () => _resolveAiAction(id, confirm: false),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.inputBorder),
                    foregroundColor: AppColors.textMuted,
                  ),
                  child: const Text('Batal', style: TextStyle(fontSize: 12)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: FilledButton(
                  onPressed: actionsDisabled ? null : () => _resolveAiAction(id, confirm: true),
                  style: FilledButton.styleFrom(backgroundColor: AppColors.primaryBrown),
                  child: isProcessing
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : Text(
                          isResolved ? 'Sudah diproses' : 'Konfirmasi',
                          style: const TextStyle(fontSize: 12),
                        ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _resolveAiAction(int proposalId, {required bool confirm}) async {
    if (_processingProposalIds.contains(proposalId) ||
        _resolvedProposalIds.contains(proposalId)) {
      return;
    }

    setState(() => _processingProposalIds.add(proposalId));
    final ok = await AiChatService.resolveAction(proposalId, confirm: confirm);
    if (!mounted) return;

    setState(() {
      _processingProposalIds.remove(proposalId);
      if (ok) _resolvedProposalIds.add(proposalId);
    });

    final now = DateFormat('HH:mm').format(DateTime.now());
    setState(() {
      _messages.add(_ChatMessageItem(
        text: ok
            ? (confirm ? 'Aksi berhasil dikonfirmasi dan disimpan.' : 'Usulan dibatalkan.')
            : (AiChatService.lastActionError ?? 'Gagal memproses usulan. Coba lagi ya.'),
        isUser: false,
        time: now,
      ));
    });
    _scrollToBottom();
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
            child: UserAvatar(
              size: 32,
              avatarUrl: auth.avatarUrl,
              initial: auth.userInitial,
              backgroundColor: const Color(0xFF5E2B16),
              showShadow: false,
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
                final custom = item.customWidgetBuilder?.call();
                if (custom != null) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: custom,
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
        Flexible(
          child: Container(
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
                Flexible(
                  child: Text(
                    'AI sedang menganalisis...',
                    style: TextStyle(fontSize: 12, color: Color(0xFF8C827A), fontStyle: FontStyle.italic),
                  ),
                ),
              ],
            ),
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
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Container(
                  constraints: const BoxConstraints(minHeight: 48),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9F7F5),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFF0EAE1)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _controller,
                          keyboardType: TextInputType.multiline,
                          textInputAction: TextInputAction.newline,
                          minLines: 1,
                          maxLines: 4,
                          textAlignVertical: TextAlignVertical.top,
                          style: const TextStyle(fontSize: 13, color: Color(0xFF2C1A14)),
                          decoration: const InputDecoration(
                            isDense: true,
                            contentPadding: EdgeInsets.symmetric(vertical: 12),
                            hintText: 'Ketik atau "Buat goal..." untuk AI Goal...',
                            hintStyle: TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
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
