import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/data_provider.dart';
import '../services/database_service.dart';
import '../services/secure_storage_service.dart';
import '../utils/theme.dart';
import '../utils/currency_formatter.dart';

/// ============================================================
/// DataManagementScreen — Halaman Manajemen Penyimpanan Lokal
/// Menampilkan 3 jenis storage yang digunakan:
/// 1. SQLite (Drift) — Data terstruktur (Transactions, Categories, Budgets)
/// 2. SharedPreferences — Pengaturan ringan (Key-Value)
/// 3. FlutterSecureStorage — Data sensitif terenkripsi (Token, PIN)
/// ============================================================
class DataManagementScreen extends StatefulWidget {
  const DataManagementScreen({super.key});

  @override
  State<DataManagementScreen> createState() => _DataManagementScreenState();
}

class _DataManagementScreenState extends State<DataManagementScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Map<String, int> _storageStats = {};
  bool _isLoading = true;

  // Secure storage data
  String _accessToken = '';
  bool _biometricEnabled = false;
  bool _hasSession = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final dataProvider = Provider.of<DataProvider>(context, listen: false);
    final stats = await dataProvider.getStorageStats();

    // Load secure storage info
    final secure = SecureStorageService.getInstance();
    final token = await secure.getAccessToken();
    final biometric = await secure.isBiometricEnabled();
    final session = await secure.hasActiveSession();

    if (!mounted) return;
    setState(() {
      _storageStats = stats;
      _accessToken = token ?? '';
      _biometricEnabled = biometric;
      _hasSession = session;
      _isLoading = false;
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.inputBorder),
            ),
            child: const Icon(Icons.arrow_back_ios_new, size: 16, color: AppColors.textDark),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Penyimpanan Lokal',
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.textDark,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _loadData,
            icon: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.inputBorder),
              ),
              child: const Icon(Icons.refresh, size: 16, color: AppColors.textDark),
            ),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : Column(
              children: [
                // Storage Overview Card
                _buildOverviewCard(),
                const SizedBox(height: 4),

                // Tab Bar
                _buildTabBar(),
                const SizedBox(height: 4),

                // Tab Content
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildSqliteTab(),
                      _buildPreferencesTab(),
                      _buildSecureStorageTab(),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  // ===================== OVERVIEW CARD =====================
  Widget _buildOverviewCard() {
    final dataProvider = Provider.of<DataProvider>(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [AppColors.primary, AppColors.primary.withOpacity(0.85)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Stack(
          children: [
            // Watermark
            Positioned(
              right: -10,
              bottom: -15,
              child: Icon(
                Icons.storage_rounded,
                size: 100,
                color: Colors.white.withOpacity(0.06),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.cloud_done_outlined, color: Colors.white, size: 18),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'OFFLINE-FIRST STORAGE',
                              style: GoogleFonts.plusJakartaSans(
                                color: Colors.white70,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${_storageStats['total'] ?? 0} data tersimpan',
                              style: GoogleFonts.plusJakartaSans(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Sync Button
                      GestureDetector(
                        onTap: () async {
                          await dataProvider.syncAllData();
                          _loadData();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (dataProvider.isSyncing)
                                const SizedBox(
                                  width: 12,
                                  height: 12,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: AppColors.primary,
                                  ),
                                )
                              else
                                Icon(Icons.sync, size: 14, color: AppColors.primary),
                              const SizedBox(width: 4),
                              Text(
                                dataProvider.isSyncing ? 'Syncing...' : 'Sync',
                                style: GoogleFonts.plusJakartaSans(
                                  color: AppColors.primary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // Last sync info
                  Row(
                    children: [
                      const Icon(Icons.access_time, color: Colors.white54, size: 13),
                      const SizedBox(width: 4),
                      Text(
                        'Terakhir sinkron: ${dataProvider.lastSyncFormatted}',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white60,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Storage Type Chips
                  Row(
                    children: [
                      _buildTypeChip('SQLite', Icons.table_chart_outlined, '${_storageStats['total'] ?? 0} rows'),
                      const SizedBox(width: 8),
                      _buildTypeChip('Key-Value', Icons.settings_outlined, '12+ keys'),
                      const SizedBox(width: 8),
                      _buildTypeChip('Encrypted', Icons.lock_outline, 'Secure'),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeChip(String label, IconData icon, String sub) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 14),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white, fontSize: 9, fontWeight: FontWeight.w600,
              ),
            ),
            Text(
              sub,
              style: GoogleFonts.plusJakartaSans(color: Colors.white60, fontSize: 8),
            ),
          ],
        ),
      ),
    );
  }

  // ===================== TAB BAR =====================
  Widget _buildTabBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.inputBorder),
        ),
        child: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: AppColors.textMuted,
          indicatorSize: TabBarIndicatorSize.tab,
          dividerColor: Colors.transparent,
          indicator: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(12),
          ),
          labelStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600),
          unselectedLabelStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w500),
          tabs: const [
            Tab(text: 'SQLite'),
            Tab(text: 'Preferences'),
            Tab(text: 'Secure'),
          ],
        ),
      ),
    );
  }

  // ===================== TAB 1: SQLite (Drift) =====================
  Widget _buildSqliteTab() {
    final dataProvider = Provider.of<DataProvider>(context);
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Info Banner
          _buildInfoBanner(
            icon: Icons.table_chart_outlined,
            title: 'SQLite Database (Drift)',
            description:
                'Menyimpan data terstruktur yang memerlukan query, sorting, dan filtering. Cocok untuk data relasional seperti transaksi, kategori, dan budget.',
            color: AppColors.primary,
          ),
          const SizedBox(height: 16),

          // Stats Grid
          Row(
            children: [
              _buildStatCard('Transaksi', '${_storageStats['transactions'] ?? 0}', Icons.receipt_long, AppColors.secondary),
              const SizedBox(width: 10),
              _buildStatCard('Kategori', '${_storageStats['categories'] ?? 0}', Icons.category_outlined, AppColors.greenAccent),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _buildStatCard('Budget', '${_storageStats['budgets'] ?? 0}', Icons.track_changes, const Color(0xFF6366F1)),
              const SizedBox(width: 10),
              _buildStatCard('Pengguna', '${_storageStats['users'] ?? 0}', Icons.person_outline, AppColors.primary),
            ],
          ),
          const SizedBox(height: 16),

          // Live Transaction Stream
          _buildSectionHeader('Cache Transaksi (Reaktif Stream)', Icons.bolt),
          const SizedBox(height: 8),
          StreamBuilder<List<CachedTransaction>>(
            stream: dataProvider.transactionsStream,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return _buildLoadingCard();
              }
              final txList = snapshot.data ?? [];
              if (txList.isEmpty) {
                return _buildEmptyCard(
                  'Belum ada data transaksi',
                  'Ketuk tombol "Sync" untuk mengambil data dari API',
                );
              }
              return Column(
                children: txList.take(5).map((tx) => _buildTransactionTile(tx)).toList(),
              );
            },
          ),
          const SizedBox(height: 16),

          // Live Categories Stream
          _buildSectionHeader('Cache Kategori', Icons.category_outlined),
          const SizedBox(height: 8),
          StreamBuilder<List<CachedCategory>>(
            stream: dataProvider.categoriesStream,
            builder: (context, snapshot) {
              final catList = snapshot.data ?? [];
              if (catList.isEmpty) {
                return _buildEmptyCard('Belum ada data kategori', 'Sync untuk mengambil dari API');
              }
              return Wrap(
                spacing: 8,
                runSpacing: 8,
                children: catList.map((cat) => _buildCategoryChip(cat)).toList(),
              );
            },
          ),
          const SizedBox(height: 16),

          // Budgets Stream
          _buildSectionHeader('Cache Budget', Icons.track_changes),
          const SizedBox(height: 8),
          StreamBuilder<List<CachedBudget>>(
            stream: dataProvider.budgetsStream,
            builder: (context, snapshot) {
              final budgets = snapshot.data ?? [];
              if (budgets.isEmpty) {
                return _buildEmptyCard('Belum ada data budget', 'Sync untuk mengambil dari API');
              }
              return Column(
                children: budgets.map((b) => _buildBudgetTile(b)).toList(),
              );
            },
          ),
          const SizedBox(height: 16),

          // Action Buttons
          _buildActionButton(
            'Sync Transaksi dari API',
            Icons.cloud_download_outlined,
            AppColors.secondary,
            () async {
              await dataProvider.syncTransactions();
              _loadData();
            },
          ),
          const SizedBox(height: 8),
          _buildActionButton(
            'Sync Kategori dari API',
            Icons.cloud_download_outlined,
            AppColors.greenAccent,
            () async {
              await dataProvider.syncCategories();
              _loadData();
            },
          ),
          const SizedBox(height: 8),
          _buildActionButton(
            'Sync Budget dari API',
            Icons.cloud_download_outlined,
            const Color(0xFF6366F1),
            () async {
              await dataProvider.syncBudgets();
              _loadData();
            },
          ),
          const SizedBox(height: 8),
          _buildActionButton(
            'Hapus Semua Cache SQLite',
            Icons.delete_outline,
            AppColors.errorText,
            () async {
              await dataProvider.clearAllCache();
              _loadData();
            },
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // ===================== TAB 2: SharedPreferences =====================
  Widget _buildPreferencesTab() {
    final dataProvider = Provider.of<DataProvider>(context);
    final prefs = dataProvider.prefs;

    final items = [
      {'key': 'user_name', 'value': prefs.getUserName(), 'icon': Icons.person_outline},
      {'key': 'user_email', 'value': prefs.getUserEmail().isEmpty ? '(belum diisi)' : prefs.getUserEmail(), 'icon': Icons.email_outlined},
      {'key': 'user_role', 'value': prefs.getUserRole(), 'icon': Icons.badge_outlined},
      {'key': 'is_dark_mode', 'value': prefs.getTheme() ? 'true' : 'false', 'icon': Icons.dark_mode_outlined},
      {'key': 'currency', 'value': prefs.getCurrency(), 'icon': Icons.attach_money},
      {'key': 'language', 'value': prefs.getLanguage(), 'icon': Icons.language},
      {'key': 'notification_enabled', 'value': prefs.isNotificationEnabled() ? 'true' : 'false', 'icon': Icons.notifications_outlined},
      {'key': 'onboarding_complete', 'value': prefs.isOnboardingComplete() ? 'true' : 'false', 'icon': Icons.check_circle_outline},
      {'key': 'saldo_snapshot', 'value': CurrencyFormatter.formatRupiah(prefs.getSaldoSnapshot()), 'icon': Icons.account_balance_wallet_outlined},
      {'key': 'income_snapshot', 'value': CurrencyFormatter.formatRupiah(prefs.getIncomeSnapshot()), 'icon': Icons.arrow_downward},
      {'key': 'expense_snapshot', 'value': CurrencyFormatter.formatRupiah(prefs.getExpenseSnapshot()), 'icon': Icons.arrow_upward},
      {'key': 'last_sync_time', 'value': prefs.getLastSyncFormatted(), 'icon': Icons.access_time},
    ];

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoBanner(
            icon: Icons.settings_outlined,
            title: 'SharedPreferences (Key-Value)',
            description:
                'Menyimpan data ringan non-sensitif berupa pasangan key-value. Cocok untuk pengaturan aplikasi, flag boolean, dan preferensi UI pengguna.',
            color: AppColors.secondary,
          ),
          const SizedBox(height: 16),

          ...items.map((item) => _buildPreferenceItem(
                item['key'] as String,
                item['value'] as String,
                item['icon'] as IconData,
              )),

          const SizedBox(height: 16),
          _buildActionButton(
            'Simpan Data Contoh Preferences',
            Icons.save_outlined,
            AppColors.primary,
            () async {
              await prefs.saveUserName('Keisya Lanika');
              await prefs.saveUserEmail('keisya@moneymate.com');
              await prefs.saveUserRole('user');
              await prefs.saveCurrency('IDR');
              await prefs.saveLanguage('id');
              await prefs.setNotificationEnabled(true);
              await prefs.setOnboardingComplete(true);
              setState(() {});
            },
          ),
          const SizedBox(height: 8),
          _buildActionButton(
            'Hapus Semua Preferences',
            Icons.delete_outline,
            AppColors.errorText,
            () async {
              await prefs.clearAll();
              setState(() {});
            },
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // ===================== TAB 3: FlutterSecureStorage =====================
  Widget _buildSecureStorageTab() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoBanner(
            icon: Icons.lock_outline,
            title: 'Flutter Secure Storage (Encrypted)',
            description:
                'Menyimpan data SENSITIF yang dienkripsi oleh platform OS. Menggunakan Keychain di iOS dan EncryptedSharedPreferences di Android. Cocok untuk token, PIN, dan kunci keamanan.',
            color: const Color(0xFF6366F1),
          ),
          const SizedBox(height: 16),

          _buildSecureItem('Access Token', _accessToken.isEmpty ? '(kosong)' : '•••${_accessToken.substring((_accessToken.length - 8).clamp(0, _accessToken.length))}', Icons.vpn_key_outlined, true),
          _buildSecureItem('Sesi Aktif', _hasSession ? 'Ya ✓' : 'Tidak', Icons.login_outlined, false),
          _buildSecureItem('Biometrik', _biometricEnabled ? 'Aktif' : 'Nonaktif', Icons.fingerprint, false),
          _buildSecureItem('Enkripsi', 'AES-256 (Platform)', Icons.enhanced_encryption_outlined, false),
          _buildSecureItem('Storage', 'Android Keystore / iOS Keychain', Icons.security_outlined, false),

          const SizedBox(height: 16),
          _buildActionButton(
            'Simpan Token Contoh',
            Icons.vpn_key_outlined,
            AppColors.primary,
            () async {
              final secure = SecureStorageService.getInstance();
              await secure.saveAccessToken('token_demo_${DateTime.now().millisecondsSinceEpoch}');
              await secure.setBiometricEnabled(true);
              _loadData();
            },
          ),
          const SizedBox(height: 8),
          _buildActionButton(
            'Hapus Semua Data Sensitif',
            Icons.delete_outline,
            AppColors.errorText,
            () async {
              final secure = SecureStorageService.getInstance();
              await secure.clearAll();
              _loadData();
            },
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // =============== REUSABLE WIDGETS ===============

  Widget _buildInfoBanner({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.06),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.15)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: color,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: AppColors.textMuted,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.inputBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    value,
                    style: GoogleFonts.plusJakartaSans(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: AppColors.textDark,
                    ),
                  ),
                  Text(
                    label,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      color: AppColors.textMuted,
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

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 16),
        const SizedBox(width: 6),
        Text(
          title,
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.bold,
            fontSize: 13,
            color: AppColors.textDark,
          ),
        ),
      ],
    );
  }

  Widget _buildTransactionTile(CachedTransaction tx) {
    final isIncome = tx.type == 'INCOME';
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: isIncome ? AppColors.greenBg : const Color(0xFFFFF0E6),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isIncome ? Icons.arrow_downward : Icons.arrow_upward,
              color: isIncome ? AppColors.greenAccent : AppColors.secondary,
              size: 18,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tx.title,
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                    color: AppColors.textDark,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  '${tx.categoryName} • ${tx.type}',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${isIncome ? "+" : "-"} ${CurrencyFormatter.formatRupiah(tx.amount)}',
            style: GoogleFonts.plusJakartaSans(
              fontWeight: FontWeight.bold,
              fontSize: 11,
              color: isIncome ? AppColors.greenAccent : AppColors.secondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(CachedCategory cat) {
    final color = _parseColor(cat.color);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            cat.name,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            cat.type,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 9,
              color: AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBudgetTile(CachedBudget b) {
    final pct = b.percentage / 100;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                b.categoryName,
                style: GoogleFonts.plusJakartaSans(
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                  color: AppColors.textDark,
                ),
              ),
              Text(
                '${b.percentage.toStringAsFixed(1)}%',
                style: GoogleFonts.plusJakartaSans(
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  color: pct > 0.8 ? AppColors.errorText : AppColors.greenAccent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: pct.clamp(0.0, 1.0),
              minHeight: 6,
              backgroundColor: AppColors.inputBorder,
              valueColor: AlwaysStoppedAnimation<Color>(
                pct > 0.8 ? AppColors.errorText : AppColors.greenAccent,
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${CurrencyFormatter.formatRupiah(b.spentAmount)} / ${CurrencyFormatter.formatRupiah(b.limitAmount)}',
            style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppColors.textMuted),
          ),
        ],
      ),
    );
  }

  Widget _buildPreferenceItem(String key, String value, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppColors.secondary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 16, color: AppColors.secondary),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  key,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    color: AppColors.textMuted,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.insightBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              'Key-Value',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 8,
                color: AppColors.secondary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSecureItem(String label, String value, IconData icon, bool isSensitive) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: const Color(0xFF6366F1).withOpacity(0.08),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 16, color: const Color(0xFF6366F1)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    color: AppColors.textMuted,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFFF0EFFF),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isSensitive ? Icons.lock : Icons.shield_outlined,
                  size: 10,
                  color: const Color(0xFF6366F1),
                ),
                const SizedBox(width: 3),
                Text(
                  isSensitive ? 'Encrypted' : 'Secure',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 8,
                    color: const Color(0xFF6366F1),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(String label, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.06),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(width: 8),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontWeight: FontWeight.w600,
                fontSize: 13,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: const Center(
        child: SizedBox(
          width: 20,
          height: 20,
          child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
        ),
      ),
    );
  }

  Widget _buildEmptyCard(String title, String subtitle) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Column(
        children: [
          Icon(Icons.inbox_outlined, size: 28, color: AppColors.textMuted.withOpacity(0.5)),
          const SizedBox(height: 6),
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              fontWeight: FontWeight.w600,
              fontSize: 12,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppColors.textMuted),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Color _parseColor(String hex) {
    try {
      return Color(int.parse(hex.replaceFirst('#', '0xFF')));
    } catch (e) {
      return AppColors.primary;
    }
  }
}
