import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'navigation/app_router.dart';
import 'services/auth_provider.dart';
import 'services/database_service.dart';
import 'services/preferences_service.dart';
import 'services/offline_first_service.dart';
import 'providers/data_provider.dart';
import 'providers/user_provider.dart';
import 'utils/theme.dart';

import 'package:intl/date_symbol_data_local.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('id_ID', null);

  // Inisialisasi service-service penyimpanan lokal
  final db = AppDatabase();
  final prefs = await PreferencesService.getInstance();
  final offlineService = OfflineFirstService(db, prefs);

  runApp(
    MultiProvider(
      providers: [
        // Auth Provider (Login/Register)
        ChangeNotifierProvider(create: (_) => AuthProvider()),

        // User Provider (Drift Stream untuk data pengguna)
        ChangeNotifierProvider(create: (_) => UserProvider(db)),

        // Data Provider (Orchestrator utama offline-first)
        ChangeNotifierProvider(
          create: (_) => DataProvider(
            db: db,
            offlineService: offlineService,
            prefs: prefs,
          ),
        ),
      ],
      child: const MoneyMateApp(),
    ),
  );
}

class MoneyMateApp extends StatelessWidget {
  const MoneyMateApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MoneyMate',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: AppRouter.splash,
      onGenerateRoute: AppRouter.generateRoute,
    );
  }
}
