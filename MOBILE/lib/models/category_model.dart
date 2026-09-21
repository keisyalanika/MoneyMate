class CategoryModel {
  final String id;
  final String name;
  final String type;
  final String icon;
  final String color;

  CategoryModel({
    required this.id,
    required this.name,
    required this.type,
    required this.icon,
    required this.color,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? 'EXPENSE',
      icon: json['icon'] ?? '',
      color: json['color'] ?? '#3B82F6',
    );
  }
}
