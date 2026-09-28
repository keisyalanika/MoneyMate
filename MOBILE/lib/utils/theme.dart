import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Primary & Accent
  static const Color primaryBrown = Color(0xFF592314); // Cokelat utama
  static const Color accentOrange =
      Color(0xFFD95B27); // Orange "Mate" & Highlight
  static const Color background = Color(0xFFFAF6F0); // Cream latar belakang

  // Card & Input
  static const Color cardWhite = Color(0xFFFFFFFF);
  static const Color inputBg = Color(0xFFFAF8F5);
  static const Color inputBorder = Color(0xFFEFE8E0);

  // Status & Insights
  static const Color insightBg = Color(0xFFFFF7F2);
  static const Color insightBorder = Color(0xFFFDE3D3);
  static const Color greenAccent = Color(0xFF27AE60);
  static const Color greenBg = Color(0xFFE8F5E9);

  // Text Colors
  static const Color textDark = Color(0xFF221F1F);
  static const Color textMuted = Color(0xFF8C837B);
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryBrown,
        primary: AppColors.primaryBrown,
        secondary: AppColors.accentOrange,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(),
    );
  }
}
