import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'api_service.dart';

/// Klien untuk fitur chatbot AI (Gemini) di backend.
class AiChatService {
  static const Duration _timeout = Duration(seconds: 30);

  static Future<Map<String, dynamic>?> sendMessage({
    required String message,
    int? conversationId,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiService.baseUrl}/ai/chat'),
            headers: ApiService.headers,
            body: jsonEncode({
              'message': message,
              if (conversationId != null) 'conversation_id': conversationId,
            }),
          )
          .timeout(_timeout);

      if (response.statusCode == 200) {
        final body = json.decode(response.body) as Map<String, dynamic>;
        return body['data'] as Map<String, dynamic>?;
      }

      if (kDebugMode) {
        debugPrint('AI chat gagal (${response.statusCode}): ${response.body}');
      }
    } catch (error) {
      if (kDebugMode) debugPrint('AI chat error: $error');
    }
    return null;
  }

  static String? lastActionError;

  static Future<bool> resolveAction(int proposalId, {required bool confirm}) async {
    lastActionError = null;
    try {
      final path = confirm ? 'confirm' : 'cancel';
      final response = await http
          .post(
            Uri.parse('${ApiService.baseUrl}/ai/actions/$proposalId/$path'),
            headers: ApiService.headers,
          )
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) return true;

      try {
        final body = json.decode(response.body) as Map<String, dynamic>;
        lastActionError = body['message']?.toString();
      } catch (_) {}
      if (kDebugMode) {
        debugPrint('AI action gagal (${response.statusCode}): ${response.body}');
      }
      return false;
    } catch (error) {
      lastActionError = 'Tidak bisa menghubungi server AI. Periksa koneksi.';
      if (kDebugMode) debugPrint('AI action error: $error');
      return false;
    }
  }
}
