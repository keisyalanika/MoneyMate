import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:moneymate_mobile/main.dart';

Future<void> tapText(WidgetTester tester, String label) async {
  final finder = find.text(label);
  expect(finder, findsWidgets, reason: 'tidak menemukan "$label"');
  final target = finder.last;
  await tester.ensureVisible(target);
  await tester.pumpAndSettle();
  await tester.tap(target, warnIfMissed: true);
  await tester.pumpAndSettle();
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('flow: splash -> login -> lupa sandi -> OTP -> reset -> sukses -> login',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MoneyMateApp());

    // Splash -> Login (setelah timer 2 detik)
    expect(find.text('MoneyMate'), findsOneWidget);
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();
    expect(find.text('Selamat datang kembali '), findsOneWidget);

    // Login -> Lupa Kata Sandi
    await tapText(tester, 'Lupa kata sandi?');
    expect(find.text('Kirim Kode Pemulihan'), findsOneWidget);

    // Lupa Kata Sandi -> Verifikasi Kode (OTP)
    await tapText(tester, 'Kirim Kode Pemulihan');
    expect(find.text('Verifikasi Kode Reset'), findsOneWidget);

    // OTP -> Ganti Kata Sandi
    await tapText(tester, 'Lanjutkan ke Sandi Baru');
    expect(find.text('Simpan Kata Sandi Baru'), findsOneWidget);

    // Ganti Kata Sandi -> Modal Sukses
    await tapText(tester, 'Simpan Kata Sandi Baru');
    expect(find.text('Kata Sandi Berhasil Diubah!'), findsOneWidget);

    // Sukses -> Login lagi
    await tapText(tester, 'Masuk Sekarang');
    expect(find.text('Selamat datang kembali '), findsOneWidget);
    expect(find.text('Kirim Kode Pemulihan'), findsNothing);
  });
}
