import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_provider.dart';
import '../services/api_service.dart';
import '../utils/budget_icons.dart';
import '../utils/budget_prediction.dart';
import '../utils/currency_formatter.dart';
import 'ai_chat_screen.dart';
import 'add_goal_screen.dart';
import 'budget_screen.dart';

class AiInsightScreen extends StatefulWidget {
  const AiInsightScreen({super.key});

  @override
  State<AiInsightScreen> createState() => _AiInsightScreenState();
}

class _AiInsightScreenState extends State<AiInsightScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<BudgetPrediction> _predictions = [];
  bool _isLoadingPrediction = true;
  Map<String, dynamic> _summary = {};
  bool _isLoadingSummary = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadPrediction();
    _loadSummary();
  }

  Future<void> _loadSummary() async {
    final summary = await ApiService.fetchSummary();
    if (!mounted) return;
    setState(() {
      _summary = ApiService.lastSummaryOk ? summary : {};
      _isLoadingSummary = false;
    });
  }

  Future<void> _loadPrediction() async {
    final now = DateTime.now();
    final budgets = await ApiService.fetchBudgets(month: now.month, year: now.year);
    if (!mounted) return;
    if (budgets == null) {
      setState(() => _isLoadingPrediction = false);
      return;
    }
    setState(() {
      _predictions = computeBudgetPredictions(budgets, now: now);
      _isLoadingPrediction = false;
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
      backgroundColor: const Color(0xFFFAF8F5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Color(0xFF2C1A14), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'AI Financial Insight',
          style: TextStyle(color: Color(0xFF2C1A14), fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
        actions: [
          GestureDetector(
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const AiChatScreen()));
            },
            child: Container(
              margin: const EdgeInsets.only(right: 16),
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: Color(0xFFF0EAE1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 20),
            ),
          )
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFFEFE8E1),
              borderRadius: BorderRadius.circular(24),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                color: const Color(0xFF3F1D0B),
                borderRadius: BorderRadius.circular(20),
              ),
              labelColor: Colors.white,
              unselectedLabelColor: const Color(0xFF8C827A),
              labelPadding: EdgeInsets.zero,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5),
              unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal, fontSize: 11.5),
              dividerColor: Colors.transparent,
              indicatorSize: TabBarIndicatorSize.tab,
              tabs: const [
                Tab(text: 'Ringkasan'),
                Tab(text: 'Prediksi Budget'),
                Tab(text: 'Rekomendasi'),
              ],
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildRingkasanTab(),
          _buildPrediksiTab(),
          _buildRekomendasiTab(),
        ],
      ),
    );
  }

  // ==================== TAB 1: RINGKASAN ====================
  Widget _buildRingkasanTab() {
    final overCats = _predictions.where((p) => p.risk == BudgetRiskLevel.berisiko).toList();
    final hasOver = overCats.isNotEmpty;

    final double income = (_summary['totalIncome'] as num?)?.toDouble() ?? 0;
    final double expense = (_summary['totalExpense'] as num?)?.toDouble() ?? 0;
    final double balance = (_summary['totalBalance'] as num?)?.toDouble() ?? 0;

    final String statusText;
    if (_isLoadingSummary) {
      statusText = 'Memuat...';
    } else if (hasOver) {
      statusText = 'Ada Kategori Overbudget';
    } else if (_predictions.isEmpty) {
      statusText = 'Belum Ada Budget';
    } else {
      statusText = 'Dalam Batas Aman';
    }

    final Color statusColor = hasOver ? const Color(0xFFD32F2F) : const Color(0xFF1B8A46);
    final Color statusBg = hasOver ? const Color(0xFFFFEBEA) : const Color(0xFFE8F8F0);

    final String insight;
    if (_isLoadingPrediction || _isLoadingSummary) {
      insight = 'Memuat analisis keuangan...';
    } else if (hasOver) {
      insight =
          'Kategori ${overCats.map((p) => p.categoryName).join(', ')} sudah melewati limit. '
          'Sesuaikan budget atau kurangi pengeluaran kategori tersebut.';
    } else if (_predictions.isEmpty) {
      insight = 'Belum ada budget bulan ini. Buat budget kategori agar pengeluaranmu bisa dipantau.';
    } else {
      final remaining = _predictions.fold<double>(
        0,
        (sum, p) => sum + (p.limit - p.spent).clamp(0, double.infinity),
      );
      insight =
          'Pengeluaranmu masih dalam batas budget bulan ini. Sisa budget keseluruhan '
          '${CurrencyFormatter.formatRupiah(remaining)}.';
    }

    return RefreshIndicator(
      color: const Color(0xFF8C381E),
      onRefresh: () async {
        await Future.wait([_loadPrediction(), _loadSummary()]);
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF0EAE1)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Halo, ${Provider.of<AuthProvider>(context, listen: false).userNickname}!',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Berikut ringkasan keuanganmu dari data transaksi dan budget yang tersimpan.',
                          style: TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFDF3F0),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.smart_toy_outlined, color: Color(0xFF8C381E), size: 32),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF0EAE1)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Kondisi Keuangan Kamu',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2C1A14)),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: statusBg, borderRadius: BorderRadius.circular(12)),
                        child: Text(
                          statusText,
                          style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  if (_isLoadingSummary)
                    const Center(child: CircularProgressIndicator(color: Color(0xFF8C381E)))
                  else ...[
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Total Pemasukan', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                              const SizedBox(height: 4),
                              Text(
                                CurrencyFormatter.formatRupiah(income),
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                              ),
                            ],
                          ),
                        ),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Total Pengeluaran', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                              const SizedBox(height: 4),
                              Text(
                                CurrencyFormatter.formatRupiah(expense),
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Divider(color: Color(0xFFF0EAE1)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Sisa Saldo', style: TextStyle(fontSize: 11, color: Color(0xFF8C827A))),
                            const SizedBox(height: 4),
                            Text(
                              CurrencyFormatter.formatRupiah(balance),
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                            ),
                          ],
                        ),
                        const Icon(Icons.bar_chart, color: Color(0xFF8C381E), size: 32),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text('Insight Singkat', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2C1A14))),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF0EAE1)),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    backgroundColor: Color(0xFFFDF3F0),
                    child: Icon(Icons.lightbulb_outline, color: Color(0xFF8C381E)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      insight,
                      style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A), height: 1.4),
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

  // ==================== TAB 2: PREDIKSI BUDGET ====================
  Widget _buildPrediksiTab() {
    return RefreshIndicator(
      color: const Color(0xFF8C381E),
      onRefresh: _loadPrediction,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.auto_awesome, color: Color(0xFF8C381E), size: 16),
                SizedBox(width: 8),
                Text('Prediksi Budget', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF2C1A14))),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Berdasarkan pola pengeluaran bulan ini, berikut proyeksi penggunaan budget hingga akhir bulan.',
              style: TextStyle(fontSize: 12, color: Color(0xFF8C827A), height: 1.4),
            ),
            const SizedBox(height: 24),
            if (_isLoadingPrediction)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 32),
                child: Center(child: CircularProgressIndicator(color: Color(0xFF8C381E))),
              )
            else if (_predictions.isEmpty)
              _buildEmptyPrediction()
            else ...[
              for (final prediction in _predictions) _buildBudgetProgressCard(prediction),
              const SizedBox(height: 8),
              _buildPredictionAlert(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyPrediction() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF0EAE1)),
      ),
      child: Column(
        children: [
          const Icon(Icons.trending_up_rounded, size: 36, color: Color(0xFFB9A99E)),
          const SizedBox(height: 12),
          const Text(
            'Belum ada budget bulan ini',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
          ),
          const SizedBox(height: 4),
          const Text(
            'Buat budget kategori agar MoneyMate bisa memproyeksikan pengeluaranmu sampai akhir bulan.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: Color(0xFF8C827A), height: 1.4),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF592314),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const BudgetScreen()),
              );
              if (mounted) _loadPrediction();
            },
            icon: const Icon(Icons.add_rounded, color: Colors.white, size: 18),
            label: const Text(
              'Atur Budget',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBudgetProgressCard(BudgetPrediction prediction) {
    final Color statusColor;
    final Color statusBg;
    final Color progressColor;

    switch (prediction.risk) {
      case BudgetRiskLevel.berisiko:
        statusColor = const Color(0xFFD32F2F);
        statusBg = const Color(0xFFFFEBEA);
        progressColor = const Color(0xFFE53935);
        break;
      case BudgetRiskLevel.waspada:
        statusColor = const Color(0xFFB78103);
        statusBg = const Color(0xFFFFF4D6);
        progressColor = const Color(0xFFFFA000);
        break;
      case BudgetRiskLevel.aman:
        statusColor = const Color(0xFF1B8A46);
        statusBg = const Color(0xFFE8F8F0);
        progressColor = const Color(0xFF00A854);
        break;
    }

    final icon = resolveBudgetIcon({
      'icon': prediction.categoryIcon,
      'title': prediction.categoryName,
    });

    String projectionText;
    if (prediction.dailyAverage <= 0) {
      projectionText = 'Belum ada pengeluaran bulan ini.';
    } else if (prediction.isRisk && prediction.daysUntilEmpty != null) {
      projectionText =
          'Proyeksi ${CurrencyFormatter.formatRupiah(prediction.projectedSpend)} · perkiraan habis dalam ${prediction.daysUntilEmpty} hari';
    } else {
      projectionText =
          'Proyeksi akhir bulan ${CurrencyFormatter.formatRupiah(prediction.projectedSpend)} (${prediction.projectedPercent.round()}%)';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF0EAE1)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9F7F5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: const Color(0xFF8C381E), size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      prediction.categoryName,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2C1A14)),
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${CurrencyFormatter.formatRupiah(prediction.spent)} / ${CurrencyFormatter.formatRupiah(prediction.limit)}',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A)),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  prediction.statusLabel,
                  style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: prediction.progress,
                  backgroundColor: const Color(0xFFEFE8E1),
                  color: progressColor,
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                '${prediction.percentUsed.round()}%',
                style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.insights_rounded, size: 14, color: Color(0xFF8C827A)),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  projectionText,
                  style: const TextStyle(fontSize: 11, color: Color(0xFF8C827A), height: 1.35),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPredictionAlert() {
    final risky = _predictions.where((p) => p.risk == BudgetRiskLevel.berisiko).toList();
    final warned = _predictions.where((p) => p.risk == BudgetRiskLevel.waspada).toList();
    final BudgetPrediction? focus = risky.isNotEmpty
        ? risky.first
        : (warned.isNotEmpty ? warned.first : null);
    final bool danger = focus != null && focus.risk == BudgetRiskLevel.berisiko;

    final Color background = focus == null
        ? const Color(0xFFE8F8F0)
        : danger
            ? const Color(0xFFFDF3F0)
            : const Color(0xFFFFF7ED);
    final Color border = focus == null
        ? const Color(0xFFD4F2DE)
        : danger
            ? const Color(0xFF8C381E).withValues(alpha: 0.3)
            : const Color(0xFFFFEDD5);
    final Color accent = focus == null
        ? const Color(0xFF1B8A46)
        : danger
            ? const Color(0xFF8C381E)
            : const Color(0xFFB78103);
    final IconData icon = focus == null
        ? Icons.verified_rounded
        : danger
            ? Icons.warning_amber_rounded
            : Icons.info_outline_rounded;

    String message;
    if (focus == null) {
      message = 'Semua budget diperkirakan aman hingga akhir bulan.';
    } else if (danger) {
      message = focus.daysUntilEmpty != null
          ? 'Diperkirakan budget ${focus.categoryName} habis dalam ${focus.daysUntilEmpty} hari jika pola pengeluaran tetap sama.'
          : 'Proyeksi pengeluaran ${focus.categoryName} melebihi limit (${CurrencyFormatter.formatRupiah(focus.projectedSpend)} dari ${CurrencyFormatter.formatRupiah(focus.limit)}).';
    } else {
      message =
          'Proyeksi budget ${focus.categoryName} mencapai ${focus.projectedPercent.round()}% dari limit bulan ini.';
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: accent),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: TextStyle(fontSize: 12, color: accent, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  // ==================== TAB 3: REKOMENDASI ====================
  Widget _buildRekomendasiTab() {
    final risky = _predictions.where((p) => p.risk == BudgetRiskLevel.berisiko).toList();
    final warned = _predictions.where((p) => p.risk == BudgetRiskLevel.waspada).toList();
    final focusList = <BudgetPrediction>[...risky, ...warned].take(3).toList();

    final double monthlyExpense =
        _predictions.fold<double>(0, (sum, p) => sum + p.spent);
    final BudgetPrediction? safeWithRemaining = _predictions
        .cast<BudgetPrediction?>()
        .firstWhere(
          (p) => p != null && p.risk == BudgetRiskLevel.aman && p.limit > p.spent,
          orElse: () => null,
        );

    return RefreshIndicator(
      color: const Color(0xFF8C381E),
      onRefresh: () async {
        await Future.wait([_loadPrediction(), _loadSummary()]);
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_isLoadingPrediction)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 48),
                child: Center(child: CircularProgressIndicator(color: Color(0xFF8C381E))),
              )
            else ...[
              _buildRecommendationAlert(focusList),
              const SizedBox(height: 24),
              const Text(
                'REKOMENDASI SOLUSI AI',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF8C827A)),
              ),
              const SizedBox(height: 12),
              if (_predictions.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF0EAE1)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.tips_and_updates_outlined, size: 32, color: Color(0xFFB9A99E)),
                      const SizedBox(height: 10),
                      const Text(
                        'Belum ada budget untuk dianalisis.',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14)),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Buat budget kategori terlebih dahulu agar rekomendasi bisa dihitung dari data asli.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 11, color: Color(0xFF8C827A), height: 1.4),
                      ),
                      const SizedBox(height: 14),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF592314),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        onPressed: () async {
                          await Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const BudgetScreen()),
                          );
                          if (mounted) _loadPrediction();
                        },
                        child: const Text(
                          'Atur Budget',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                )
              else if (focusList.isEmpty)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8F8F0),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFD4F2DE)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.verified_rounded, color: Color(0xFF1B8A46)),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Tidak ada kategori yang berisiko. Semua budget diperkirakan aman hingga akhir bulan.',
                          style: TextStyle(fontSize: 12, color: Color(0xFF1B8A46), height: 1.4),
                        ),
                      ),
                    ],
                  ),
                )
              else
                ...focusList.map((prediction) {
                  final bool isRisk = prediction.risk == BudgetRiskLevel.berisiko;
                  return _buildRecommendationCard(
                    icon: isRisk ? Icons.trending_down_rounded : Icons.visibility_outlined,
                    title: isRisk
                        ? 'Tekan Pengeluaran ${prediction.categoryName}'
                        : 'Pantau Budget ${prediction.categoryName}',
                    description:
                        'Terpakai ${CurrencyFormatter.formatRupiah(prediction.spent)} dari limit '
                        '${CurrencyFormatter.formatRupiah(prediction.limit)} '
                        '(${prediction.percentUsed.toStringAsFixed(0)}%). '
                        '${prediction.daysUntilEmpty != null ? 'Perkiraan habis dalam ${prediction.daysUntilEmpty} hari. ' : ''}'
                        'Proyeksi akhir bulan ${CurrencyFormatter.formatRupiah(prediction.projectedSpend)}.',
                    buttonText: 'Atur Budget',
                    onPressed: () async {
                      await Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const BudgetScreen()),
                      );
                      if (mounted) _loadPrediction();
                    },
                  );
                }),
              if (safeWithRemaining != null && focusList.isNotEmpty) ...[
                const SizedBox(height: 4),
                _buildRecommendationCard(
                  icon: Icons.swap_horiz_rounded,
                  title: 'Realokasi Budget',
                  description:
                      'Sisa budget ${safeWithRemaining.categoryName} '
                      '${CurrencyFormatter.formatRupiah(safeWithRemaining.limit - safeWithRemaining.spent)}. '
                      'Pertimbangkan memindahkan sebagian ke kategori yang berisiko.',
                  buttonText: 'Buka Budget',
                  onPressed: () async {
                    await Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const BudgetScreen()),
                    );
                    if (mounted) _loadPrediction();
                  },
                ),
              ],
              if (monthlyExpense > 0) ...[
                const SizedBox(height: 4),
                _buildAiGoalRecommendationCard(
                  displayIcon: Icons.savings_outlined,
                  title: 'Buat Dana Darurat',
                  description:
                      'Pengeluaran bulan ini ${CurrencyFormatter.formatRupiah(monthlyExpense)}. '
                      'AI menyarankan dana darurat sekitar 3x pengeluaran bulanan.',
                  targetAmount: monthlyExpense * 3,
                  monthDuration: 6,
                  icon: 'savings',
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildRecommendationAlert(List<BudgetPrediction> focusList) {
    if (focusList.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFEFFAF3),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFD4F2DE)),
        ),
        child: const Row(
          children: [
            Icon(Icons.verified_rounded, color: Color(0xFF1B8A46), size: 26),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'Semua budget aman. Tidak ada kategori yang perlu perhatian khusus bulan ini.',
                style: TextStyle(fontSize: 12, color: Color(0xFF2C1A14), height: 1.4),
              ),
            ),
          ],
        ),
      );
    }

    final focus = focusList.first;
    final bool danger = focus.risk == BudgetRiskLevel.berisiko;
    final Color accent = danger ? const Color(0xFF8C381E) : const Color(0xFFB78103);
    final Color bg = danger ? const Color(0xFFFDF3F0) : const Color(0xFFFFF7ED);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: accent.withValues(alpha: 0.3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            danger ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
            color: accent,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              danger
                  ? 'Pengeluaran ${focus.categoryName} perlu ditekan. '
                      'Proyeksi akhir bulan ${CurrencyFormatter.formatRupiah(focus.projectedSpend)} dari limit '
                      '${CurrencyFormatter.formatRupiah(focus.limit)}.'
                  : 'Proyeksi budget ${focus.categoryName} mencapai '
                      '${focus.projectedPercent.toStringAsFixed(0)}% dari limit bulan ini.',
              style: TextStyle(fontSize: 12, color: accent, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendationCard({
    required IconData icon,
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
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFFAF0EB),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: const Color(0xFF8C381E), size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(description, style: const TextStyle(fontSize: 13, color: Color(0xFF8C827A), height: 1.3)),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 40,
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF8C381E)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: onPressed,
              child: Text(buttonText, style: const TextStyle(color: Color(0xFF8C381E), fontWeight: FontWeight.bold, fontSize: 13)),
            ),
          ),
        ],
      ),
    );
  }

  // ==================== KARTU AI GOAL RECOMMENDATION ====================
  Widget _buildAiGoalRecommendationCard({
    required IconData displayIcon,
    required String title,
    required String description,
    required double targetAmount,
    required int monthDuration,
    required String icon,
  }) {
    bool isSaving = false;

    String formatRp(double v) {
      final s = v.round().toString();
      final buf = StringBuffer();
      for (int i = 0; i < s.length; i++) {
        if (i > 0 && (s.length - i) % 3 == 0) buf.write('.');
        buf.write(s[i]);
      }
      return 'Rp ${buf.toString()}';
    }

    final deadline = DateTime.now().add(Duration(days: monthDuration * 30));
    final deadlineStr = '${deadline.year}-${deadline.month.toString().padLeft(2, '0')}-${deadline.day.toString().padLeft(2, '0')}';
    final monthly = targetAmount / monthDuration;

    return StatefulBuilder(
      builder: (ctx, setCardState) {
        return Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFDE8D8)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF0EB),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.auto_awesome, size: 14, color: Color(0xFF8C381E)),
                  ),
                  const SizedBox(width: 6),
                  const Text('REKOMENDASI GOAL AI',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF8C381E), letterSpacing: 0.5)),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF0EB),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(displayIcon, color: const Color(0xFF8C381E), size: 20),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(title,
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF2C1A14))),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(description, style: const TextStyle(fontSize: 12, color: Color(0xFF8C827A), height: 1.3)),
              const SizedBox(height: 10),
              Row(
                children: [
                  _buildSmallChip('Target: ${formatRp(targetAmount)}'),
                  const SizedBox(width: 8),
                  _buildSmallChip('${formatRp(monthly)}/bln'),
                  const SizedBox(width: 8),
                  _buildSmallChip('$monthDuration bln'),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: SizedBox(
                      height: 40,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF592314),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          elevation: 0,
                        ),
                        onPressed: isSaving
                            ? null
                            : () async {
                                setCardState(() => isSaving = true);
                                final success = await ApiService.addGoal({
                                  'title': title,
                                  'target_amount': targetAmount,
                                  'current_amount': 0,
                                  'icon': icon,
                                  'deadline': deadlineStr,
                                });
                                setCardState(() => isSaving = false);
                                if (!context.mounted) return;
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(success ? 'Goal "$title" berhasil dibuat.' : 'Gagal menyimpan goal.'),
                                    backgroundColor: success ? const Color(0xFF27AE60) : Colors.red,
                                    behavior: SnackBarBehavior.floating,
                                  ),
                                );
                              },
                      child: isSaving
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.add_rounded, color: Colors.white, size: 18),
                                SizedBox(width: 6),
                                Text('Buat Goal Ini',
                                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                              ],
                            ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  SizedBox(
                    height: 40,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF8C381E)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => AddGoalScreen(
                              initialDraft: {
                                'title': title,
                                'target_amount': targetAmount,
                                'icon': icon,
                                'deadline': deadlineStr,
                              },
                            ),
                          ),
                        );
                      },
                      child: const Text('Edit', style: TextStyle(color: Color(0xFF8C381E), fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSmallChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF0EB),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF592314), fontWeight: FontWeight.w600)),
    );
  }
}
