import 'package:flutter/material.dart';

const List<IconData> budgetIconOptions = [
  Icons.restaurant_rounded,
  Icons.celebration_rounded,
  Icons.shopping_bag_rounded,
  Icons.directions_car_rounded,
  Icons.bolt_rounded,
  Icons.local_cafe_rounded,
  Icons.medical_services_rounded,
  Icons.menu_book_rounded,
  Icons.home_rounded,
  Icons.flight_takeoff_rounded,
];

const Map<String, IconData> _legacyEmojiIcons = {
  '🍔': Icons.restaurant_rounded,
  '🎟️': Icons.celebration_rounded,
  '🛍️': Icons.shopping_bag_rounded,
  '🚗': Icons.directions_car_rounded,
  '⚡': Icons.bolt_rounded,
  '☕': Icons.local_cafe_rounded,
  '🏥': Icons.medical_services_rounded,
  '📚': Icons.menu_book_rounded,
  '🏠': Icons.home_rounded,
  '✈️': Icons.flight_takeoff_rounded,
};

const Map<String, IconData> _backendIcons = {
  'utensils': Icons.restaurant_rounded,
  'bus': Icons.directions_bus_rounded,
  'shopping-cart': Icons.shopping_bag_rounded,
  'file-text': Icons.receipt_long_rounded,
  'book': Icons.menu_book_rounded,
  'music': Icons.celebration_rounded,
  'activity': Icons.medical_services_rounded,
  'wallet': Icons.account_balance_wallet_rounded,
  'laptop': Icons.laptop_mac_rounded,
  'award': Icons.emoji_events_rounded,
  'heart': Icons.favorite_rounded,
  'trending-up': Icons.trending_up_rounded,
  'plus-circle': Icons.add_circle_rounded,
  'minus-circle': Icons.category_rounded,
  'home': Icons.home_rounded,
  'car': Icons.directions_car_rounded,
  'flight': Icons.flight_takeoff_rounded,
  'savings': Icons.savings_rounded,
  'school': Icons.school_rounded,
};

IconData budgetIconForName(String? name) {
  final n = (name ?? '').toLowerCase();
  if (n.contains('makan') || n.contains('minum') || n.contains('food')) {
    return Icons.restaurant_rounded;
  }
  if (n.contains('hiburan') || n.contains('libur') || n.contains('nonton')) {
    return Icons.celebration_rounded;
  }
  if (n.contains('belanja') || n.contains('shopping')) {
    return Icons.shopping_bag_rounded;
  }
  if (n.contains('transport') || n.contains('ojol') || n.contains('bensin')) {
    return Icons.directions_car_rounded;
  }
  if (n.contains('tagihan') || n.contains('utilitas') || n.contains('listrik')) {
    return Icons.bolt_rounded;
  }
  if (n.contains('pendidikan') || n.contains('kuliah') || n.contains('kursus') || n.contains('buku')) {
    return Icons.menu_book_rounded;
  }
  if (n.contains('kesehatan') || n.contains('obat') || n.contains('dokter')) {
    return Icons.medical_services_rounded;
  }
  if (n.contains('rumah') || n.contains('sewa') || n.contains('kos')) {
    return Icons.home_rounded;
  }
  if (n.contains('liburan') || n.contains('pesawat') || n.contains('travel')) {
    return Icons.flight_takeoff_rounded;
  }
  if (n.contains('kopi') || n.contains('cafe') || n.contains('kafe')) {
    return Icons.local_cafe_rounded;
  }
  return Icons.category_rounded;
}

IconData resolveBudgetIcon(Map<String, dynamic> category) {
  final icon = category['icon'];
  if (icon is IconData) return icon;
  if (icon is String) {
    final legacy = _legacyEmojiIcons[icon];
    if (legacy != null) return legacy;
    final backend = _backendIcons[icon.toLowerCase()];
    if (backend != null) return backend;
  }
  return budgetIconForName(category['title']?.toString());
}

String budgetIconKey(IconData icon) {
  if (icon == Icons.restaurant_rounded) return 'utensils';
  if (icon == Icons.celebration_rounded) return 'music';
  if (icon == Icons.shopping_bag_rounded) return 'shopping-cart';
  if (icon == Icons.directions_car_rounded) return 'bus';
  if (icon == Icons.bolt_rounded) return 'file-text';
  if (icon == Icons.local_cafe_rounded) return 'local-cafe';
  if (icon == Icons.medical_services_rounded) return 'activity';
  if (icon == Icons.menu_book_rounded) return 'book';
  if (icon == Icons.home_rounded) return 'home';
  if (icon == Icons.flight_takeoff_rounded) return 'flight';
  return 'minus-circle';
}
