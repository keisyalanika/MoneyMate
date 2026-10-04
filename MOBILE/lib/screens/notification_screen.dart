import 'package:flutter/material.dart';
import '../utils/theme.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  // Preferensi notifikasi (dapat disimpan ke backend)
  bool _budgetReminder = true;
  bool _transactionAlert = true;
  bool _weeklyReport = false;
  bool _financialTips = true;

  // Daftar notifikasi riwayat sederhana
  final List<Map<String, dynamic>> _notifications = [
    {
      'id': 'notif-1',
      'title': 'Peringatan Anggaran',
      'body': 'Pengeluaran Kebutuhan Pokok sudah mencapai 80% dari limit bulanan.',
      'time': '2 jam yang lalu',
      'icon': Icons.warning_amber_rounded,
      'color': AppColors.accentOrange,
      'isRead': false,
    },
    {
      'id': 'notif-2',
      'title': 'Laporan Finansial Siap',
      'body': 'Ringkasan pengeluaran & pemasukan minggu ini sudah siap dianalisis.',
      'time': 'Kemarin, 19:30',
      'icon': Icons.bar_chart_rounded,
      'color': AppColors.primaryBrown,
      'isRead': true,
    },
    {
      'id': 'notif-3',
      'title': 'Tips Hemat MoneyMate',
      'body': 'Sisihkan minimal 20% penghasilan di awal bulan untuk dana darurat.',
      'time': '3 hari yang lalu',
      'icon': Icons.lightbulb_outline_rounded,
      'color': AppColors.greenAccent,
      'isRead': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Notifikasi',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.primaryBrown,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppColors.primaryBrown, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Bagian 1: Preferensi Notifikasi
              const Text(
                'Preferensi Notifikasi',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: [
                    _buildSwitchTile(
                      title: 'Pengingat Anggaran',
                      subtitle: 'Peringatan saat pengeluaran mendekati limit',
                      value: _budgetReminder,
                      onChanged: (val) {
                        setState(() => _budgetReminder = val);
                        _showPreferenceSaved();
                      },
                    ),
                    const Divider(height: 1, color: AppColors.inputBorder),
                    _buildSwitchTile(
                      title: 'Notifikasi Transaksi',
                      subtitle: 'Notifikasi instan saat transaksi baru dicatat',
                      value: _transactionAlert,
                      onChanged: (val) {
                        setState(() => _transactionAlert = val);
                        _showPreferenceSaved();
                      },
                    ),
                    const Divider(height: 1, color: AppColors.inputBorder),
                    _buildSwitchTile(
                      title: 'Laporan Berkala',
                      subtitle: 'Rangkuman keuangan mingguan & bulanan',
                      value: _weeklyReport,
                      onChanged: (val) {
                        setState(() => _weeklyReport = val);
                        _showPreferenceSaved();
                      },
                    ),
                    const Divider(height: 1, color: AppColors.inputBorder),
                    _buildSwitchTile(
                      title: 'Tips & Edukasi Finansial',
                      subtitle: 'Informasi dan saran untuk kesehatan keuangan',
                      value: _financialTips,
                      onChanged: (val) {
                        setState(() => _financialTips = val);
                        _showPreferenceSaved();
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Bagian 2: Riwayat Notifikasi
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Riwayat Notifikasi',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                  if (_notifications.isNotEmpty)
                    TextButton(
                      onPressed: () {
                        setState(() {
                          for (var item in _notifications) {
                            item['isRead'] = true;
                          }
                        });
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: const Size(50, 30),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: const Text(
                        'Tandai terbaca',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.accentOrange,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),

              if (_notifications.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.notifications_off_outlined,
                          size: 40, color: AppColors.textMuted),
                      SizedBox(height: 8),
                      Text(
                        'Belum ada notifikasi baru',
                        style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _notifications.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final item = _notifications[index];
                    final bool isRead = item['isRead'] as bool;
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isRead ? Colors.white : const Color(0xFFFFF9F5),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isRead
                              ? AppColors.inputBorder
                              : AppColors.accentOrange.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: (item['color'] as Color).withValues(alpha: 0.12),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              item['icon'] as IconData,
                              color: item['color'] as Color,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      item['title'] as String,
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight:
                                            isRead ? FontWeight.w600 : FontWeight.bold,
                                        color: AppColors.textDark,
                                      ),
                                    ),
                                    Text(
                                      item['time'] as String,
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item['body'] as String,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textDark,
                                    height: 1.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  void _showPreferenceSaved() {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Preferensi notifikasi disimpan'),
        duration: Duration(milliseconds: 1200),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeThumbColor: Colors.white,
            activeTrackColor: AppColors.primaryBrown,
            inactiveThumbColor: Colors.white,
            inactiveTrackColor: Colors.grey.shade300,
          ),
        ],
      ),
    );
  }
}
