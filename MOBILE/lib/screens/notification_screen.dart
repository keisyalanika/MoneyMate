import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  bool _isLoading = true;
  List<Map<String, dynamic>> _notifications = [];

  final List<Map<String, dynamic>> _fallbackNotifications = [
    {
      'id': 1,
      'title': 'Peringatan Anggaran',
      'body': 'Pengeluaran Kebutuhan Pokok sudah mencapai 80% dari limit bulanan.',
      'time': '2 jam yang lalu',
      'icon': Icons.warning_amber_rounded,
      'color': AppColors.accentOrange,
      'isRead': false,
    },
    {
      'id': 2,
      'title': 'Laporan Finansial Siap',
      'body': 'Ringkasan pengeluaran & pemasukan minggu ini sudah siap dianalisis.',
      'time': 'Kemarin, 19:30',
      'icon': Icons.bar_chart_rounded,
      'color': AppColors.primaryBrown,
      'isRead': true,
    },
    {
      'id': 3,
      'title': 'Tips Hemat MoneyMate',
      'body': 'Sisihkan minimal 20% penghasilan di awal bulan untuk dana darurat.',
      'time': '3 hari yang lalu',
      'icon': Icons.lightbulb_outline_rounded,
      'color': AppColors.greenAccent,
      'isRead': true,
    },
    {
      'id': 4,
      'title': 'Goal Tercapai! 🎯',
      'body': 'Target menabung Anda telah mencapai 100%. Selamat!',
      'time': '5 hari yang lalu',
      'icon': Icons.flag_outlined,
      'color': Colors.teal,
      'isRead': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    try {
      final remoteList = await ApiService.fetchNotifications();
      if (remoteList.isNotEmpty) {
        setState(() {
          _notifications = remoteList.map((item) {
            final title = (item['title'] ?? 'Pemberitahuan').toString();
            final isRead = item['is_read'] == 1 || item['is_read'] == true;

            IconData icon = Icons.notifications_rounded;
            Color color = AppColors.primaryBrown;

            if (title.contains('⚠️') || title.toLowerCase().contains('peringatan') || title.toLowerCase().contains('overbudget')) {
              icon = Icons.warning_amber_rounded;
              color = AppColors.accentOrange;
            } else if (title.contains('🎉') || title.contains('🎯') || title.toLowerCase().contains('goal')) {
              icon = Icons.flag_rounded;
              color = Colors.teal;
            } else if (title.contains('👏') || title.toLowerCase().contains('apresiasi')) {
              icon = Icons.thumb_up_rounded;
              color = const Color(0xFF10B981);
            }

            String timeStr = 'Baru saja';
            if (item['created_at'] != null) {
              try {
                final dt = DateTime.parse(item['created_at'].toString());
                timeStr = DateFormat('dd MMM, HH:mm').format(dt);
              } catch (_) {}
            }

            return {
              'id': item['id'],
              'title': title,
              'body': item['message'] ?? '',
              'time': timeStr,
              'icon': icon,
              'color': color,
              'isRead': isRead,
            };
          }).toList();
        });
      } else {
        setState(() {
          _notifications = List.from(_fallbackNotifications);
        });
      }
    } catch (_) {
      setState(() {
        _notifications = List.from(_fallbackNotifications);
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _markAllAsRead() async {
    setState(() {
      for (var n in _notifications) {
        n['isRead'] = true;
      }
    });
    await ApiService.markAllNotificationsAsRead();
  }

  Future<void> _markOneAsRead(Map<String, dynamic> item) async {
    if (item['isRead'] == true) return;
    setState(() {
      item['isRead'] = true;
    });
    if (item['id'] is int) {
      await ApiService.markNotificationAsRead(item['id'] as int);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8F5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Color(0xFF2C1A14), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Notifikasi',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: Color(0xFF2C1A14),
          ),
        ),
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: _markAllAsRead,
            child: const Text(
              'Tandai terbaca',
              style: TextStyle(fontSize: 12, color: Color(0xFF8C381E), fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primaryBrown),
            )
          : RefreshIndicator(
              color: AppColors.primaryBrown,
              onRefresh: _loadNotifications,
              child: _notifications.isEmpty
                  ? ListView(
                      children: const [
                        SizedBox(height: 120),
                        Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.notifications_off_outlined, size: 56, color: Color(0xFFD6CFC8)),
                              SizedBox(height: 16),
                              Text('Belum ada notifikasi', style: TextStyle(color: Color(0xFF8C827A), fontSize: 14)),
                            ],
                          ),
                        ),
                      ],
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                      itemCount: _notifications.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final item = _notifications[index];
                        final bool isRead = item['isRead'] as bool;
                        return GestureDetector(
                          onTap: () => _markOneAsRead(item),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: isRead ? Colors.white : const Color(0xFFFDF3F0),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isRead
                                    ? const Color(0xFFF0EAE1)
                                    : const Color(0xFF8C381E).withOpacity(0.3),
                              ),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: (item['color'] as Color).withOpacity(0.12),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    item['icon'] as IconData,
                                    color: item['color'] as Color,
                                    size: 22,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Text(
                                              item['title'] as String,
                                              style: TextStyle(
                                                fontSize: 13,
                                                fontWeight: isRead ? FontWeight.w600 : FontWeight.bold,
                                                color: const Color(0xFF2C1A14),
                                              ),
                                            ),
                                          ),
                                          Text(
                                            item['time'] as String,
                                            style: const TextStyle(fontSize: 10, color: Color(0xFF8C827A)),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        item['body'] as String,
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isRead ? const Color(0xFF8C827A) : const Color(0xFF2C1A14),
                                          height: 1.4,
                                        ),
                                      ),
                                      if (!isRead) ...[
                                        const SizedBox(height: 8),
                                        Row(
                                          children: [
                                            Container(
                                              width: 8,
                                              height: 8,
                                              decoration: const BoxDecoration(
                                                color: Color(0xFF8C381E),
                                                shape: BoxShape.circle,
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            const Text(
                                              'Belum dibaca',
                                              style: TextStyle(fontSize: 10, color: Color(0xFF8C381E), fontWeight: FontWeight.bold),
                                            ),
                                          ],
                                        ),
                                      ]
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
