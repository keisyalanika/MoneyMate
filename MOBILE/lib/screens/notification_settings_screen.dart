import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() => _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState extends State<NotificationSettingsScreen> {
  bool _isLoading = true;

  // Preferensi Notifikasi
  bool _pengingatAnggaran = true;
  bool _notifikasiTransaksi = true;
  bool _laporanBerkala = false;
  bool _tipsEdukasi = true;

  // Riwayat Notifikasi dari Backend
  List<Map<String, dynamic>> _notifications = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  /// Sinkronisasi Preferensi dan Riwayat Notifikasi dengan Backend
  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();

      // 1. Ambil Pengaturan dari Backend (GET /api/settings)
      final beSettings = await ApiService.fetchUserSettings();
      final beNotifEnabled = beSettings['notification_enabled'];
      final bool isGloballyEnabled = beNotifEnabled == 1 || beNotifEnabled == true;

      if (!isGloballyEnabled) {
        // Jika di backend dinonaktifkan secara global
        _pengingatAnggaran = false;
        _notifikasiTransaksi = false;
        _laporanBerkala = false;
        _tipsEdukasi = false;
      } else {
        // Ambil preferensi granular lokal
        _pengingatAnggaran = prefs.getBool('pref_pengingat_anggaran') ?? true;
        _notifikasiTransaksi = prefs.getBool('pref_notifikasi_transaksi') ?? true;
        _laporanBerkala = prefs.getBool('pref_laporan_berkala') ?? false;
        _tipsEdukasi = prefs.getBool('pref_tips_edukasi') ?? true;
      }

      // 2. Ambil Riwayat Notifikasi dari Backend (GET /api/notifications)
      final remoteList = await ApiService.fetchNotifications();

      if (remoteList.isNotEmpty) {
        _notifications = remoteList.map((item) {
          final title = (item['title'] ?? 'Pemberitahuan').toString();
          final message = (item['message'] ?? item['body'] ?? '').toString();
          final isRead = item['is_read'] == true || item['is_read'] == 1;
          final style = _resolveStyle(title, message);

          return {
            'id': item['id'],
            'title': title,
            'description': message,
            'time': _formatTime(item['created_at']),
            'icon': style['icon'],
            'iconColor': style['iconColor'],
            'iconBgColor': style['iconBgColor'],
            'isWarning': style['isWarning'],
            'isUnread': !isRead,
          };
        }).toList();
      } else {
        // Fallback contoh realistis jika database backend belum memiliki notifikasi
        _notifications = [
          {
            'id': null,
            'title': 'Peringatan Anggaran',
            'description': 'Pengeluaran Kebutuhan Pokok sudah mencapai 80% dari limit bulanan.',
            'time': '2 jam yang lalu',
            'icon': Icons.warning_amber_rounded,
            'iconColor': const Color(0xFFD95B27),
            'iconBgColor': const Color(0xFFFDECE7),
            'isWarning': true,
            'isUnread': true,
          },
          {
            'id': null,
            'title': 'Laporan Finansial Siap',
            'description': 'Ringkasan pengeluaran & pemasukan minggu ini sudah siap dianalisis.',
            'time': 'Kemarin, 19:30',
            'icon': Icons.bar_chart_rounded,
            'iconColor': const Color(0xFF6B5E57),
            'iconBgColor': const Color(0xFFEFECE9),
            'isWarning': false,
            'isUnread': false,
          },
          {
            'id': null,
            'title': 'Tips Hemat MoneyMate',
            'description': 'Sisihkan minimal 20% penghasilan di awal bulan untuk dana darurat.',
            'time': '3 hari yang lalu',
            'icon': Icons.lightbulb_outline_rounded,
            'iconColor': const Color(0xFF27AE60),
            'iconBgColor': const Color(0xFFE8F5E9),
            'isWarning': false,
            'isUnread': false,
          },
        ];
      }
    } catch (_) {
      // Pertahankan data saat offline
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  /// Format waktu ramah pengguna
  String _formatTime(dynamic raw) {
    if (raw == null) return 'Baru saja';
    try {
      final dt = DateTime.parse(raw.toString()).toLocal();
      final now = DateTime.now();
      final diff = now.difference(dt);

      if (diff.inMinutes < 60) {
        return diff.inMinutes <= 1 ? 'Baru saja' : '${diff.inMinutes} menit yang lalu';
      } else if (diff.inHours < 24) {
        return '${diff.inHours} jam yang lalu';
      } else if (diff.inDays == 1) {
        return 'Kemarin, ${DateFormat('HH:mm').format(dt)}';
      } else if (diff.inDays < 7) {
        return '${diff.inDays} hari yang lalu';
      } else {
        return DateFormat('dd MMM, HH:mm').format(dt);
      }
    } catch (_) {
      return raw.toString();
    }
  }

  /// Tentukan ikon dan warna badge berdasarkan kategori pesan
  Map<String, dynamic> _resolveStyle(String title, String desc) {
    final combined = ('$title $desc').toLowerCase();
    if (combined.contains('anggaran') ||
        combined.contains('peringatan') ||
        combined.contains('limit') ||
        combined.contains('overbudget') ||
        combined.contains('bahaya') ||
        combined.contains('80%') ||
        combined.contains('⚠️')) {
      return {
        'icon': Icons.warning_amber_rounded,
        'iconColor': const Color(0xFFD95B27),
        'iconBgColor': const Color(0xFFFDECE7),
        'isWarning': true,
      };
    } else if (combined.contains('laporan') ||
        combined.contains('finansial') ||
        combined.contains('ringkasan') ||
        combined.contains('analisis') ||
        combined.contains('mingguan') ||
        combined.contains('rekap')) {
      return {
        'icon': Icons.bar_chart_rounded,
        'iconColor': const Color(0xFF6B5E57),
        'iconBgColor': const Color(0xFFEFECE9),
        'isWarning': false,
      };
    } else if (combined.contains('tips') ||
        combined.contains('hemat') ||
        combined.contains('edukasi') ||
        combined.contains('darurat') ||
        combined.contains('ide') ||
        combined.contains('saran') ||
        combined.contains('promo')) {
      return {
        'icon': Icons.lightbulb_outline_rounded,
        'iconColor': const Color(0xFF27AE60),
        'iconBgColor': const Color(0xFFE8F5E9),
        'isWarning': false,
      };
    }
    return {
      'icon': Icons.notifications_rounded,
      'iconColor': AppColors.primaryBrown,
      'iconBgColor': const Color(0xFFF2ECE6),
      'isWarning': false,
    };
  }

  /// Simpan preferensi notifikasi ke Local Storage dan Backend (PUT /api/settings)
  Future<void> _updatePreference(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);

    // Hitung apakah setidaknya ada satu preferensi yang aktif
    final hasActive = _pengingatAnggaran || _notifikasiTransaksi || _laporanBerkala || _tipsEdukasi;

    // Sinkronkan ke Backend
    await ApiService.updateUserSettings({
      'notification_enabled': hasActive,
    });
  }

  /// Tandai semua notifikasi terbaca di Backend (PUT /api/notifications/read-all)
  Future<void> _markAllAsRead() async {
    setState(() {
      for (var n in _notifications) {
        n['isUnread'] = false;
      }
    });

    // Panggil endpoint Backend
    await ApiService.markAllNotificationsAsRead();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Semua notifikasi telah ditandai terbaca',
            style: TextStyle(fontSize: 13, color: Colors.white),
          ),
          backgroundColor: AppColors.primaryBrown,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  /// Tandai satu notifikasi terbaca di Backend (PUT /api/notifications/:id/read)
  Future<void> _markOneAsRead(Map<String, dynamic> item) async {
    if (item['isUnread'] != true) return;

    setState(() {
      item['isUnread'] = false;
    });

    if (item['id'] is int) {
      await ApiService.markNotificationAsRead(item['id'] as int);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background, // #FAF6F0
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(
            Icons.chevron_left_rounded,
            color: AppColors.primaryBrown,
            size: 28,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Notifikasi',
          style: TextStyle(
            color: AppColors.primaryBrown,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: RefreshIndicator(
        color: AppColors.primaryBrown,
        backgroundColor: Colors.white,
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ================= 1. PREFERENSI NOTIFIKASI =================
              const Text(
                'Preferensi Notifikasi',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 12),

              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFF2ECE6), width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    _buildSwitchTile(
                      title: 'Pengingat Anggaran',
                      subtitle: 'Peringatan saat pengeluaran mendekati limit',
                      value: _pengingatAnggaran,
                      onChanged: (val) {
                        setState(() => _pengingatAnggaran = val);
                        _updatePreference('pref_pengingat_anggaran', val);
                      },
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Divider(height: 1, thickness: 1, color: Color(0xFFF3ECE6)),
                    ),
                    _buildSwitchTile(
                      title: 'Notifikasi Transaksi',
                      subtitle: 'Notifikasi instan saat transaksi baru dicatat',
                      value: _notifikasiTransaksi,
                      onChanged: (val) {
                        setState(() => _notifikasiTransaksi = val);
                        _updatePreference('pref_notifikasi_transaksi', val);
                      },
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Divider(height: 1, thickness: 1, color: Color(0xFFF3ECE6)),
                    ),
                    _buildSwitchTile(
                      title: 'Laporan Berkala',
                      subtitle: 'Rangkuman keuangan mingguan & bulanan',
                      value: _laporanBerkala,
                      onChanged: (val) {
                        setState(() => _laporanBerkala = val);
                        _updatePreference('pref_laporan_berkala', val);
                      },
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Divider(height: 1, thickness: 1, color: Color(0xFFF3ECE6)),
                    ),
                    _buildSwitchTile(
                      title: 'Tips & Edukasi Finansial',
                      subtitle: 'Informasi dan saran untuk kesehatan keuangan',
                      value: _tipsEdukasi,
                      onChanged: (val) {
                        setState(() => _tipsEdukasi = val);
                        _updatePreference('pref_tips_edukasi', val);
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // ================= 2. RIWAYAT NOTIFIKASI =================
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Riwayat Notifikasi',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                  GestureDetector(
                    onTap: _markAllAsRead,
                    child: const Text(
                      'Tandai terbaca',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.accentOrange,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              if (_isLoading)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 36),
                  child: Center(
                    child: CircularProgressIndicator(color: AppColors.primaryBrown),
                  ),
                )
              else if (_notifications.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFF0EBE5), width: 1),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.notifications_off_outlined, color: AppColors.textMuted, size: 36),
                      SizedBox(height: 8),
                      Text(
                        'Belum ada riwayat notifikasi',
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
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _notifications[index];
                    return _buildNotificationCard(item);
                  },
                ),

              const SizedBox(height: 32),
            ],
          ),
        ),
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
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textMuted,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: Colors.white,
            activeTrackColor: AppColors.primaryBrown,
            inactiveThumbColor: Colors.white,
            inactiveTrackColor: const Color(0xFFD6CEC7),
            trackOutlineColor: MaterialStateProperty.all(Colors.transparent),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> item) {
    final bool isUnread = item['isUnread'] == true;
    final bool isWarning = item['isWarning'] == true;

    return GestureDetector(
      onTap: () => _markOneAsRead(item),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isUnread && isWarning
                ? const Color(0xFFFDE3D3)
                : (isUnread ? const Color(0xFFFCE9DE) : const Color(0xFFF0EBE5)),
            width: isUnread ? 1.4 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.015),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon Bulat
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: item['iconBgColor'] as Color? ?? const Color(0xFFF2ECE6),
                shape: BoxShape.circle,
              ),
              child: Icon(
                item['icon'] as IconData? ?? Icons.notifications_rounded,
                color: item['iconColor'] as Color? ?? AppColors.primaryBrown,
                size: 22,
              ),
            ),
            const SizedBox(width: 14),

            // Teks Notifikasi
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          item['title']?.toString() ?? '',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textDark,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        item['time']?.toString() ?? '',
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item['description']?.toString() ?? '',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF55504C),
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
