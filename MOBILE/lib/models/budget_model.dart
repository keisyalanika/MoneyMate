class BudgetModel {
  final String id;
  final String categoryId;
  final String categoryName;
  final double limitAmount;
  final double spentAmount;
  final double percentage;
  final String categoryIcon;
  final int month;
  final int year;

  BudgetModel({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.limitAmount,
    required this.spentAmount,
    required this.percentage,
    this.categoryIcon = '',
    this.month = 0,
    this.year = 0,
  });

  factory BudgetModel.fromJson(Map<String, dynamic> json) {
    return BudgetModel(
      id: json['id']?.toString() ?? '',
      categoryId: (json['category_id'] ?? json['categoryId'])?.toString() ?? '',
      categoryName: json['category_name'] ?? json['categoryName'] ?? 'Kategori',
      limitAmount: ((json['amount'] ?? json['limitAmount'] ?? 0) as num).toDouble(),
      spentAmount: ((json['spent_amount'] ?? json['spentAmount'] ?? 0) as num).toDouble(),
      percentage: ((json['percentage'] ?? 0) as num).toDouble(),
      categoryIcon: (json['category_icon'] ?? json['categoryIcon'])?.toString() ?? '',
      month: (json['month'] as num?)?.toInt() ?? 0,
      year: (json['year'] as num?)?.toInt() ?? 0,
    );
  }
}
