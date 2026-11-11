import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class DraftGoalService {
  static const String _storageKey = 'moneymate_draft_goals';

  /// Mendapatkan daftar semua draf goal yang tersimpan
  static Future<List<Map<String, dynamic>>> getDraftGoals() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? jsonStr = prefs.getString(_storageKey);
      if (jsonStr == null || jsonStr.trim().isEmpty) return [];
      final List<dynamic> list = json.decode(jsonStr);
      return list.map((item) => Map<String, dynamic>.from(item)).toList();
    } catch (e) {
      return [];
    }
  }

  /// Menyimpan atau memperbarui draf goal
  static Future<bool> saveDraftGoal(Map<String, dynamic> draft) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<Map<String, dynamic>> current = await getDraftGoals();

      final String draftId = draft['id'] ?? 'draft_${DateTime.now().millisecondsSinceEpoch}';
      draft['id'] = draftId;
      draft['is_draft'] = true;
      draft['updated_at'] = DateTime.now().toIso8601String();

      final int existingIndex = current.indexWhere((item) => item['id'] == draftId);
      if (existingIndex >= 0) {
        current[existingIndex] = draft;
      } else {
        current.insert(0, draft);
      }

      return await prefs.setString(_storageKey, json.encode(current));
    } catch (e) {
      return false;
    }
  }

  /// Menghapus draf goal berdasarkan ID
  static Future<bool> deleteDraftGoal(String id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<Map<String, dynamic>> current = await getDraftGoals();
      current.removeWhere((item) => item['id'] == id);
      return await prefs.setString(_storageKey, json.encode(current));
    } catch (e) {
      return false;
    }
  }

  /// Menghapus semua draf goal
  static Future<bool> clearAllDrafts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_storageKey);
    } catch (e) {
      return false;
    }
  }
}

