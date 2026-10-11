class BudgetModel {
  final String id;
  final String categoryId;
  final String categoryName;
  final double limitAmount;
  final double spentAmount;
  final double percentage;

  BudgetModel({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.limitAmount,
    required this.spentAmount,
    required this.percentage,
  });

  factory BudgetModel.fromJson(Map<String, dynamic> json) {
    return BudgetModel(
      id: json['id']?.toString() ?? '',
      categoryId: (json['category_id'] ?? json['categoryId'])?.toString() ?? '',
      categoryName: json['category_name'] ?? json['categoryName'] ?? 'Kategori',
      limitAmount: ((json['amount'] ?? json['limitAmount'] ?? 0) as num).toDouble(),
      spentAmount: ((json['spent_amount'] ?? json['spentAmount'] ?? 0) as num).toDouble(),
      percentage: ((json['percentage'] ?? 0) as num).toDouble(),
    );
  }
}
