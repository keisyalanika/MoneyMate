import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:moneymate_mobile/main.dart';
import 'package:provider/provider.dart';
import 'package:moneymate_mobile/services/auth_provider.dart';

Future<void> tapText(WidgetTester tester, String label) async {
  final finder = find.text(label);
  expect(finder, findsWidgets, reason: 'tidak menemukan "$label"');
  final target = finder.last;
  await tester.ensureVisible(target);
  await tester.pumpAndSettle();
  await tester.tap(target, warnIfMissed: true);
  await tester.pumpAndSettle();
}

Widget buildApp() {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AuthProvider()),
    ],
    child: const MoneyMateApp(),
  );
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('splash tampil lalu masuk ke halaman login', (tester) async {
    await tester.pumpWidget(buildApp());

    expect(find.text('MoneyMate'), findsOneWidget);
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();

    expect(find.text('Selamat datang kembali '), findsOneWidget);
    expect(find.text('Masuk'), findsWidgets);
  });

  testWidgets('login dapat membuka halaman daftar akun', (tester) async {
    await tester.pumpWidget(buildApp());
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();

    await tapText(tester, 'Daftar sekarang');
    expect(find.text('Buat Akun Baru'), findsOneWidget);
  });
}
