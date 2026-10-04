import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Primary & Accent (Dari kodemu)
  static const Color primaryBrown = Color(0xFF592314);
  static const Color accentOrange = Color(0xFFD95B27);
  static const Color background = Color(0xFFFAF6F0);

  static const Color primary = primaryBrown;
  static const Color secondary = accentOrange;

  // Card & Input (Dari kodemu)
  static const Color cardWhite = Color(0xFFFFFFFF);
  static const Color inputBg = Color(0xFFFAF8F5);
  static const Color inputBorder = Color(0xFFEFE8E0);

  // Status & Insights (Dari kodemu)
  static const Color insightBg = Color(0xFFFFF7F2);
  static const Color insightBorder = Color(0xFFFDE3D3);
  static const Color greenAccent = Color(0xFF27AE60);
  static const Color greenBg = Color(0xFFE8F5E9);

  // Text Colors (Dari kodemu)
  static const Color textDark = Color(0xFF221F1F);
  static const Color textMuted = Color(0xFF8C837B);

  // --- TAMBAHAN UNTUK HALAMAN LOGIN, LUPA SANDI & OTP ---
  static const Color errorBg = Color(0xFFFFEAEA); // Background banner error
  static const Color errorText = Color(0xFFD32F2F); // Teks & border error
  static const Color successText = Color(0xFF388E3C); // Teks hijau format valid
  static const Color iconBg =
      Color(0xFFF3E5DF); // Background lingkaran ikon di OTP/Lupa Sandi
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
      // Menggunakan font Plus Jakarta Sans dari kodemu
      textTheme: GoogleFonts.plusJakartaSansTextTheme(),
    );
  }
}
