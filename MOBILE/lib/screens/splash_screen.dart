import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:provider/provider.dart';
import '../navigation/app_router.dart';
import '../services/auth_provider.dart';
import '../utils/theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();

    // Hapus native splash screen secara mulus begitu widget splash Flutter mulai siap
    FlutterNativeSplash.remove();

    // Sembunyikan status bar agar splash full-screen
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);

    _animController = AnimationController(
      duration: const Duration(milliseconds: 900),
      vsync: this,
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeIn);
    _scaleAnim = Tween<double>(begin: 0.75, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutBack),
    );

    _animController.forward();

    // Navigasi setelah splash selesai: langsung ke app jika sesi masih aktif.
    // Sesi sudah dipulihkan di main() sebelum UI pertama tampil.
    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      final auth = Provider.of<AuthProvider>(context, listen: false);
      // Kembalikan status bar sebelum pindah halaman
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
      Navigator.pushReplacementNamed(
        context,
        auth.isLoggedIn ? AppRouter.mainNav : AppRouter.login,
      );
    });
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background, // #FAF6F0 Warm Beige — sama dgn native splash
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: ScaleTransition(
            scale: _scaleAnim,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // === Logo MoneyMate Squircle ===
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: AppColors.primaryBrown,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryBrown.withValues(alpha: 0.35),
                        blurRadius: 28,
                        offset: const Offset(0, 12),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Image.asset(
                      'assets/logo_moneymate.png',
                      width: 96,
                      height: 96,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const Center(
                        child: Text(
                          'M',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 44,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // === Brand Name MoneyMate ===
                const Text.rich(
                  TextSpan(
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                    children: [
                      TextSpan(
                        text: 'Money',
                        style: TextStyle(color: AppColors.textDark),
                      ),
                      TextSpan(
                        text: 'Mate',
                        style: TextStyle(color: AppColors.accentOrange),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

