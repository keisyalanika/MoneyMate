class TransactionModel {
  final String id;
  final String title;
  final double amount;
  final String type; // INCOME | EXPENSE
  final String categoryId;
  final String categoryName;
  final String categoryIcon;
  final String date;
  final String? notes;

  TransactionModel({
    required this.id,
    required this.title,
    required this.amount,
    required this.type,
    required this.categoryId,
    required this.categoryName,
    required this.categoryIcon,
    required this.date,
    this.notes,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id']?.toString() ?? '',
      title: json['note'] ?? json['title'] ?? 'Transaksi',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : double.tryParse(json['amount']?.toString() ?? '0') ?? 0.0,
      type: (json['type']?.toString().toUpperCase() == 'INCOME') ? 'INCOME' : 'EXPENSE',
      categoryId: (json['category_id'] ?? json['categoryId'])?.toString() ?? '',
      categoryName: json['category_name'] ?? json['categoryName'] ?? 'Lainnya',
      categoryIcon: json['category_icon'] ?? json['categoryIcon'] ?? 'tag',
      date: json['date']?.toString() ?? '',
      notes: json['note'] ?? json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'amount': amount,
      'type': type,
      'categoryId': categoryId,
      'categoryName': categoryName,
      'categoryIcon': categoryIcon,
      'date': date,
      'notes': notes,
    };
  }
}
