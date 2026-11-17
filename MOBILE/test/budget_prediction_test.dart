import 'package:flutter_test/flutter_test.dart';
import 'package:moneymate_mobile/models/budget_model.dart';
import 'package:moneymate_mobile/utils/budget_prediction.dart';

BudgetModel budget({
  required double limit,
  required double spent,
  String name = 'Makanan',
}) {
  return BudgetModel(
    id: '1',
    categoryId: '1',
    categoryName: name,
    limitAmount: limit,
    spentAmount: spent,
    percentage: limit > 0 ? (spent / limit) * 100 : 0,
    categoryIcon: 'utensils',
  );
}

void main() {
  final midMonth = DateTime(2026, 11, 15);

  group('computeBudgetPredictions', () {
    test('menandai aman saat proyeksi jauh di bawah limit', () {
      final result = computeBudgetPredictions(
        [budget(limit: 1000000, spent: 300000)],
        now: midMonth,
      ).single;

      expect(result.risk, BudgetRiskLevel.aman);
      expect(result.projectedSpend, 600000);
      expect(result.daysUntilEmpty, greaterThan(result.remainingDays));
    });

    test('menandai waspada saat proyeksi mencapai 80% limit', () {
      final result = computeBudgetPredictions(
        [budget(limit: 1000000, spent: 400000)],
        now: midMonth,
      ).single;

      expect(result.risk, BudgetRiskLevel.waspada);
      expect(result.projectedPercent, closeTo(80, 0.01));
    });

    test('menandai berisiko saat proyeksi melewati limit', () {
      final result = computeBudgetPredictions(
        [budget(limit: 1000000, spent: 850000)],
        now: midMonth,
      ).single;

      expect(result.risk, BudgetRiskLevel.berisiko);
      expect(result.daysUntilEmpty, lessThan(result.remainingDays));
    });

    test('belum memproyeksikan di awal bulan (tanggal 1-2)', () {
      final result = computeBudgetPredictions(
        [budget(limit: 500000, spent: 50000)],
        now: DateTime(2026, 11, 2),
      ).single;

      expect(result.risk, BudgetRiskLevel.aman);
      expect(result.dailyAverage, 0);
      expect(result.projectedSpend, 50000);
    });

    test('budget tanpa pengeluaran tetap aman', () {
      final result = computeBudgetPredictions(
        [budget(limit: 750000, spent: 0)],
        now: midMonth,
      ).single;

      expect(result.risk, BudgetRiskLevel.aman);
      expect(result.percentUsed, 0);
      expect(result.daysUntilEmpty, isNull);
    });

    test('limit nol dengan pengeluaran dianggap berisiko', () {
      final result = computeBudgetPredictions(
        [budget(limit: 0, spent: 10000)],
        now: midMonth,
      ).single;

      expect(result.risk, BudgetRiskLevel.berisiko);
      expect(result.progress, 0);
    });

    test('mengurutkan kategori berisiko lebih dulu', () {
      final result = computeBudgetPredictions(
        [
          budget(limit: 1000000, spent: 100000, name: 'Aman'),
          budget(limit: 1000000, spent: 900000, name: 'Berisiko'),
        ],
        now: midMonth,
      );

      expect(result.first.categoryName, 'Berisiko');
      expect(result.last.categoryName, 'Aman');
    });

    test('daftar kosong menghasilkan daftar kosong', () {
      expect(computeBudgetPredictions([], now: midMonth), isEmpty);
    });
  });
}
