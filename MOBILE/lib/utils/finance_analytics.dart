import '../models/transaction_model.dart';

class FinanceTotals {
  final double income;
  final double expense;

  const FinanceTotals({required this.income, required this.expense});

  double get net => income - expense;
}

class CategoryBreakdown {
  final String name;
  final String icon;
  final double amount;
  final double percentage;

  const CategoryBreakdown({
    required this.name,
    required this.icon,
    required this.amount,
    required this.percentage,
  });
}

class ChartPoint {
  final String label;
  final double income;
  final double expense;

  const ChartPoint({required this.label, required this.income, required this.expense});
}

DateTime? parseTransactionDate(TransactionModel tx) {
  final parsed = DateTime.tryParse(tx.date);
  if (parsed == null) return null;
  return DateTime(parsed.year, parsed.month, parsed.day);
}

DateTime startOfMonth(DateTime date) => DateTime(date.year, date.month, 1);

DateTime endOfMonth(DateTime date) => DateTime(date.year, date.month + 1, 0);

bool isWithin(DateTime? date, DateTime start, DateTime end) {
  if (date == null) return false;
  return !date.isBefore(start) && !date.isAfter(end);
}

FinanceTotals sumTransactions(Iterable<TransactionModel> transactions) {
  double income = 0;
  double expense = 0;
  for (final tx in transactions) {
    if (tx.type.toUpperCase() == 'INCOME') {
      income += tx.amount;
    } else {
      expense += tx.amount;
    }
  }
  return FinanceTotals(income: income, expense: expense);
}

List<CategoryBreakdown> expenseBreakdown(Iterable<TransactionModel> transactions) {
  final amounts = <String, double>{};
  final icons = <String, String>{};

  for (final tx in transactions) {
    if (tx.type.toUpperCase() != 'EXPENSE') continue;
    final key = tx.categoryName.isEmpty ? 'Lainnya' : tx.categoryName;
    amounts[key] = (amounts[key] ?? 0) + tx.amount;
    icons[key] = tx.categoryIcon;
  }

  final total = amounts.values.fold<double>(0, (sum, value) => sum + value);
  final list = amounts.entries
      .map((entry) => CategoryBreakdown(
            name: entry.key,
            icon: icons[entry.key] ?? '',
            amount: entry.value,
            percentage: total > 0 ? (entry.value / total) * 100 : 0,
          ))
      .toList();

  list.sort((a, b) => b.amount.compareTo(a.amount));
  return list;
}

Map<DateTime, List<TransactionModel>> groupTransactionsByDate(
  Iterable<TransactionModel> transactions,
) {
  final grouped = <DateTime, List<TransactionModel>>{};
  for (final tx in transactions) {
    final date = parseTransactionDate(tx);
    if (date == null) continue;
    grouped.putIfAbsent(date, () => []).add(tx);
  }

  final keys = grouped.keys.toList()..sort((a, b) => b.compareTo(a));
  return {for (final key in keys) key: grouped[key]!};
}

List<ChartPoint> buildChartPoints(
  List<TransactionModel> transactions,
  DateTime start,
  DateTime end,
) {
  final days = end.difference(start).inDays + 1;
  final points = <ChartPoint>[];

  if (days <= 14) {
    for (var i = 0; i < days; i++) {
      final day = DateTime(start.year, start.month, start.day + i);
      final dayTx = transactions.where((tx) {
        final date = parseTransactionDate(tx);
        return date != null &&
            date.year == day.year &&
            date.month == day.month &&
            date.day == day.day;
      });
      final totals = sumTransactions(dayTx);
      points.add(ChartPoint(
        label: '${day.day}/${day.month}',
        income: totals.income,
        expense: totals.expense,
      ));
    }
    return points;
  }

  if (days <= 62) {
    var weekStart = start;
    var week = 1;
    while (!weekStart.isAfter(end)) {
      final weekEnd = weekStart.add(const Duration(days: 6));
      final cappedEnd = weekEnd.isAfter(end) ? end : weekEnd;
      final weekTx = transactions.where((tx) {
        final date = parseTransactionDate(tx);
        return isWithin(date, weekStart, cappedEnd);
      });
      final totals = sumTransactions(weekTx);
      points.add(ChartPoint(
        label: 'Mgg $week',
        income: totals.income,
        expense: totals.expense,
      ));
      weekStart = cappedEnd.add(const Duration(days: 1));
      week++;
    }
    return points;
  }

  var cursor = DateTime(start.year, start.month, 1);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  while (!cursor.isAfter(end)) {
    final monthEnd = DateTime(cursor.year, cursor.month + 1, 0);
    final monthTx = transactions.where((tx) {
      final date = parseTransactionDate(tx);
      return isWithin(date, cursor, monthEnd);
    });
    final totals = sumTransactions(monthTx);
    points.add(ChartPoint(
      label: monthNames[cursor.month - 1],
      income: totals.income,
      expense: totals.expense,
    ));
    cursor = DateTime(cursor.year, cursor.month + 1, 1);
  }

  return points;
}
