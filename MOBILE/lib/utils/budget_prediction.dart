import '../models/budget_model.dart';

enum BudgetRiskLevel { aman, waspada, berisiko }

class BudgetPrediction {
  final String categoryName;
  final String categoryIcon;
  final double limit;
  final double spent;
  final double percentUsed;
  final double dailyAverage;
  final double projectedSpend;
  final double projectedPercent;
  final int remainingDays;
  final int? daysUntilEmpty;
  final BudgetRiskLevel risk;

  const BudgetPrediction({
    required this.categoryName,
    required this.categoryIcon,
    required this.limit,
    required this.spent,
    required this.percentUsed,
    required this.dailyAverage,
    required this.projectedSpend,
    required this.projectedPercent,
    required this.remainingDays,
    required this.daysUntilEmpty,
    required this.risk,
  });

  double get progress => limit > 0 ? (spent / limit).clamp(0.0, 1.0) : 0.0;

  bool get isRisk => risk == BudgetRiskLevel.berisiko;

  String get statusLabel {
    switch (risk) {
      case BudgetRiskLevel.berisiko:
        return 'Berisiko';
      case BudgetRiskLevel.waspada:
        return 'Waspada';
      case BudgetRiskLevel.aman:
        return 'Aman';
    }
  }
}

/// Menghitung proyeksi pemakaian budget sampai akhir bulan.
///
/// Proyeksi hanya dilakukan setelah tanggal 3 agar pengeluaran awal bulan
/// tidak langsung dianggap berisiko. Semua angka berasal dari data budget
/// backend (limit dan terpakai bulan berjalan).
List<BudgetPrediction> computeBudgetPredictions(
  List<BudgetModel> budgets, {
  DateTime? now,
}) {
  final today = now ?? DateTime.now();
  final daysInMonth = DateTime(today.year, today.month + 1, 0).day;
  final dayOfMonth = today.day.clamp(1, daysInMonth);
  final remainingDays = daysInMonth - dayOfMonth;

  final predictions = budgets.map((budget) {
    final limit = budget.limitAmount;
    final spent = budget.spentAmount;
    final percentUsed = limit > 0 ? (spent / limit) * 100 : 0.0;

    final canProject = dayOfMonth >= 3 && spent > 0;
    final dailyAverage = canProject ? spent / dayOfMonth : 0.0;
    final projectedSpend = canProject ? spent + dailyAverage * remainingDays : spent;
    final projectedPercent = limit > 0 ? (projectedSpend / limit) * 100 : 0.0;

    int? daysUntilEmpty;
    if (dailyAverage > 0) {
      final remaining = limit - spent;
      daysUntilEmpty = remaining <= 0 ? 0 : (remaining / dailyAverage).ceil();
    }

    BudgetRiskLevel risk;
    if (limit <= 0) {
      risk = spent > 0 ? BudgetRiskLevel.berisiko : BudgetRiskLevel.aman;
    } else if (spent >= limit ||
        projectedSpend > limit ||
        (daysUntilEmpty != null && daysUntilEmpty < remainingDays)) {
      risk = BudgetRiskLevel.berisiko;
    } else if (projectedPercent >= 80) {
      risk = BudgetRiskLevel.waspada;
    } else {
      risk = BudgetRiskLevel.aman;
    }

    return BudgetPrediction(
      categoryName: budget.categoryName,
      categoryIcon: budget.categoryIcon,
      limit: limit,
      spent: spent,
      percentUsed: percentUsed,
      dailyAverage: dailyAverage,
      projectedSpend: projectedSpend,
      projectedPercent: projectedPercent,
      remainingDays: remainingDays,
      daysUntilEmpty: daysUntilEmpty,
      risk: risk,
    );
  }).toList();

  const riskOrder = {
    BudgetRiskLevel.berisiko: 0,
    BudgetRiskLevel.waspada: 1,
    BudgetRiskLevel.aman: 2,
  };

  predictions.sort((a, b) {
    final byRisk = riskOrder[a.risk]!.compareTo(riskOrder[b.risk]!);
    if (byRisk != 0) return byRisk;
    return b.projectedPercent.compareTo(a.projectedPercent);
  });

  return predictions;
}
