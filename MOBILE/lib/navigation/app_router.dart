import 'package:flutter/material.dart';

// Semua import screen HANYA ada di sini
import 'main_navigation.dart';
import '../screens/splash_screen.dart';
import '../screens/login_screen.dart';
import '../screens/login_error_screen.dart';
import '../screens/register_screen.dart';
import '../screens/forgot_password_screen.dart';
import '../screens/otp_verification_screen.dart';
import '../screens/reset_password_screen.dart';
import '../screens/dashboard_screen.dart';

class AppRouter {
  // Definisi Rute (Route Names)
  static const String splash = '/';
  static const String login = '/login';
  static const String loginError = '/login-error';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String otpVerification = '/otp-verification';
  static const String resetPassword = '/reset-password';
  static const String dashboard = '/dashboard';
  static const String mainNav = '/main-navigation';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case loginError:
        return MaterialPageRoute(builder: (_) => const LoginErrorScreen());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());
      case otpVerification:
        return MaterialPageRoute(builder: (_) => const OtpVerificationScreen());
      case resetPassword:
        return MaterialPageRoute(builder: (_) => const ResetPasswordScreen());
      case dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      case mainNav:
        return MaterialPageRoute(builder: (_) => const MainNavigationWrapper());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('Halaman ${settings.name} tidak ditemukan'),
            ),
          ),
        );
    }
  }
}
