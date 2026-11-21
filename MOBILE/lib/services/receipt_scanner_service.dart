import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';

class ReceiptScanResult {
  final double? totalAmount;
  final DateTime? date;
  final String? merchantName;
  final List<String> rawLines;

  const ReceiptScanResult({
    this.totalAmount,
    this.date,
    this.merchantName,
    this.rawLines = const [],
  });

  bool get hasData =>
      totalAmount != null ||
      date != null ||
      (merchantName != null && merchantName!.trim().isNotEmpty);

  @override
  String toString() {
    return 'ReceiptScanResult(merchant: $merchantName, total: $totalAmount, date: $date, lines: ${rawLines.length})';
  }
}

class ReceiptScannerService {
  ReceiptScannerService._();
  static final ReceiptScannerService instance = ReceiptScannerService._();

  /// Memindai teks struk dari file gambar dan mengekstrak data penting
  Future<ReceiptScanResult> scanReceipt(File imageFile) async {
    final textRecognizer = TextRecognizer(script: TextRecognitionScript.latin);
    try {
      final inputImage = InputImage.fromFile(imageFile);
      final RecognizedText recognizedText =
          await textRecognizer.processImage(inputImage);

      final List<String> allLines = [];
      for (final block in recognizedText.blocks) {
        for (final line in block.lines) {
          final clean = line.text.trim();
          if (clean.isNotEmpty) {
            allLines.add(clean);
          }
        }
      }

      if (allLines.isEmpty) {
        return const ReceiptScanResult();
      }

      final total = _extractTotal(allLines);
      final date = _extractDate(allLines);
      final merchant = _extractMerchant(allLines);

      return ReceiptScanResult(
        totalAmount: total,
        date: date,
        merchantName: merchant,
        rawLines: allLines,
      );
    } catch (e) {
      debugPrint('[ReceiptScannerService] Error scanning receipt: $e');
      return const ReceiptScanResult();
    } finally {
      await textRecognizer.close();
    }
  }

  /// Ekstraksi total transaksi berdasarkan kata kunci struk Indonesia
  double? _extractTotal(List<String> lines) {
    // 1. Prioritas utama: Kata kunci Total / Grand Total / Tagihan / Jumlah
    final totalKeywords = RegExp(
      r'(?:grand\s*total|total\s*akhir|total\s*belanja|total\s*bayar|total|tagihan|jumlah\s*bayar|jumlah|netto|tunai|cash)',
      caseSensitive: false,
    );

    // Iterasi dari bawah ke atas karena baris TOTAL struk biasanya di bagian bawah
    for (int i = lines.length - 1; i >= 0; i--) {
      final line = lines[i];
      if (totalKeywords.hasMatch(line)) {
        // Coba ekstrak angka dari baris yang sama
        final amountInLine = _parseAmountFromLine(line);
        if (amountInLine != null && amountInLine > 0) {
          return amountInLine;
        }

        // Jika angka ada di baris berikutnya (misal: "TOTAL" di baris n, "Rp 50.000" di baris n+1)
        if (i + 1 < lines.length) {
          final amountNextLine = _parseAmountFromLine(lines[i + 1]);
          if (amountNextLine != null && amountNextLine > 0) {
            return amountNextLine;
          }
        }
      }
    }

    // 2. Fallback: Cari baris berawalan "Rp" atau simbol mata uang
    final rpPattern = RegExp(r'rp\.?\s*([0-9\.\,]+)', caseSensitive: false);
    double? maxRp;
    for (final line in lines) {
      final match = rpPattern.firstMatch(line);
      if (match != null) {
        final val = _cleanNumber(match.group(1));
        if (val != null && val > 0) {
          if (maxRp == null || val > maxRp) {
            maxRp = val;
          }
        }
      }
    }
    if (maxRp != null) return maxRp;

    return null;
  }

  /// Parsing angka mata uang dari baris teks
  double? _parseAmountFromLine(String text) {
    // Hapus kata kunci struk agar tersisa bagian angka
    final cleanedText = text
        .replaceAll(
          RegExp(
            r'(?:grand\s*total|total\s*akhir|total\s*belanja|total\s*bayar|total|tagihan|jumlah\s*bayar|jumlah|netto|tunai|cash|rp|idr|:|=)',
            caseSensitive: false,
          ),
          ' ',
        )
        .trim();

    // Regex mencari angka format Rupiah: misal 25.000 atau 25,000.00 atau 25000
    final numberMatches = RegExp(r'([0-9]{1,3}(?:[\.,][0-9]{3})*(?:[\.,][0-9]{2})?|[0-9]{3,})')
        .allMatches(cleanedText);

    double? highestFound;
    for (final m in numberMatches) {
      final numStr = m.group(1);
      final val = _cleanNumber(numStr);
      if (val != null && val >= 500) {
        if (highestFound == null || val > highestFound) {
          highestFound = val;
        }
      }
    }
    return highestFound;
  }

  /// Normalisasi string angka ke double
  double? _cleanNumber(String? raw) {
    if (raw == null) return null;
    String clean = raw.trim();

    // Format Indonesia: 50.000,00 -> hilangkan titik, ubah koma jadi titik
    if (clean.contains('.') && clean.contains(',')) {
      if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
        // Format ID: 50.000,00
        clean = clean.replaceAll('.', '').replaceAll(',', '.');
      } else {
        // Format US: 50,000.00
        clean = clean.replaceAll(',', '');
      }
    } else if (clean.contains('.')) {
      final parts = clean.split('.');
      if (parts.length > 2) {
        // Banyak titik ribuan: 1.000.000 -> 1000000
        clean = clean.replaceAll('.', '');
      } else if (parts[1].length == 3) {
        // Titik ribuan: 50.000 -> 50000
        clean = clean.replaceAll('.', '');
      }
    } else if (clean.contains(',')) {
      final parts = clean.split(',');
      if (parts.length > 2) {
        clean = clean.replaceAll(',', '');
      } else if (parts[1].length == 3) {
        clean = clean.replaceAll(',', '');
      } else {
        clean = clean.replaceAll(',', '.');
      }
    }

    return double.tryParse(clean);
  }

  /// Ekstraksi tanggal transaksi dari teks struk
  DateTime? _extractDate(List<String> lines) {
    // Pola 1: dd/mm/yyyy atau dd-mm-yyyy atau dd.mm.yyyy
    final dmyPattern = RegExp(
      r'\b([0-3]?[0-9])[\/\.\-]([0-1]?[0-9])[\/\.\-](20[2-3][0-9]|[2-3][0-9])\b',
    );

    // Pola 2: yyyy-mm-dd atau yyyy/mm/dd
    final ymdPattern = RegExp(
      r'\b(20[2-3][0-9])[\/\.\-]([0-1]?[0-9])[\/\.\-]([0-3]?[0-9])\b',
    );

    // Pola 3: dd MMM yyyy (misal 21 Nov 2026 atau 21 November 2026)
    final textMonthPattern = RegExp(
      r'\b([0-3]?[0-9])\s+(jan|feb|mar|apr|mei|may|jun|jul|agu|aug|sep|okt|oct|nov|des|dec)[a-z]*\s+(20[2-3][0-9]|[2-3][0-9])\b',
      caseSensitive: false,
    );

    for (final line in lines) {
      // Cek pola teks bulan
      final textMonthMatch = textMonthPattern.firstMatch(line);
      if (textMonthMatch != null) {
        final day = int.tryParse(textMonthMatch.group(1) ?? '');
        final monthStr = (textMonthMatch.group(2) ?? '').toLowerCase();
        var year = int.tryParse(textMonthMatch.group(3) ?? '');
        if (year != null && year < 100) year += 2000;
        final month = _monthStringToNumber(monthStr);

        if (day != null && month != null && year != null) {
          try {
            return DateTime(year, month, day);
          } catch (_) {}
        }
      }

      // Cek DMY
      final dmyMatch = dmyPattern.firstMatch(line);
      if (dmyMatch != null) {
        final day = int.tryParse(dmyMatch.group(1) ?? '');
        final month = int.tryParse(dmyMatch.group(2) ?? '');
        var year = int.tryParse(dmyMatch.group(3) ?? '');
        if (year != null && year < 100) year += 2000;

        if (day != null && month != null && year != null && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          try {
            return DateTime(year, month, day);
          } catch (_) {}
        }
      }

      // Cek YMD
      final ymdMatch = ymdPattern.firstMatch(line);
      if (ymdMatch != null) {
        final year = int.tryParse(ymdMatch.group(1) ?? '');
        final month = int.tryParse(ymdMatch.group(2) ?? '');
        final day = int.tryParse(ymdMatch.group(3) ?? '');

        if (day != null && month != null && year != null && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          try {
            return DateTime(year, month, day);
          } catch (_) {}
        }
      }
    }
    return null;
  }

  int? _monthStringToNumber(String m) {
    if (m.startsWith('jan')) return 1;
    if (m.startsWith('feb')) return 2;
    if (m.startsWith('mar')) return 3;
    if (m.startsWith('apr')) return 4;
    if (m.startsWith('mei') || m.startsWith('may')) return 5;
    if (m.startsWith('jun')) return 6;
    if (m.startsWith('jul')) return 7;
    if (m.startsWith('agu') || m.startsWith('aug')) return 8;
    if (m.startsWith('sep')) return 9;
    if (m.startsWith('okt') || m.startsWith('oct')) return 10;
    if (m.startsWith('nov')) return 11;
    if (m.startsWith('des') || m.startsWith('dec')) return 12;
    return null;
  }

  /// Ekstraksi nama merchant / toko dari header struk
  String? _extractMerchant(List<String> lines) {
    final ignoredWords = RegExp(
      r'(?:selamat\s*datang|welcome|struk|receipt|invoice|no\.|nota|order|kasir|cashier|pos|jl\.|jalan|telp|phone|tanggal|date|waktu|time|table|meja)',
      caseSensitive: false,
    );

    // Ambil dari 5 baris pertama yang paling masuk akal sebagai nama toko
    final candidates = lines.take(5).toList();
    for (final line in candidates) {
      final trimmed = line.trim();
      if (trimmed.length < 3 || trimmed.length > 50) continue;
      // Jangan ambil jika mengandung kata yang diabaikan atau format angka/tanggal dominan
      if (ignoredWords.hasMatch(trimmed)) continue;
      if (RegExp(r'^[0-9\/\-\:\.\s]+$').hasMatch(trimmed)) continue;

      // Bersihkan tanda baca aneh di awal/akhir
      final clean = trimmed.replaceAll(RegExp(r'^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$'), '');
      if (clean.length >= 3) {
        return clean;
      }
    }
    return null;
  }
}
