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
import '../screens/budget_screen.dart';
import '../screens/edit_profile_screen.dart';
import '../screens/notification_screen.dart';
import '../screens/connect_bank_screen.dart';
import '../screens/security_screen.dart';
import '../screens/help_center_screen.dart';
import '../screens/data_management_screen.dart';
import '../screens/user_screen.dart';

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
  static const String budget = '/budget';
  static const String mainNav = '/main-navigation';
  static const String editProfile = '/edit-profile';
  static const String profileNotification = '/profile-notification';
  static const String connectBank = '/connect-bank';
  static const String security = '/security';
  static const String helpCenter = '/help-center';
  static const String dataManagement = '/data-management';
  static const String userData = '/user-data';

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
      case otpVerification: {
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => OtpVerificationScreen(
            email: args?['email'],
            serverOtp: args?['otp'],
          ),
        );
      }
      case resetPassword: {
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => ResetPasswordScreen(
            email: args?['email'],
            otp: args?['otp'],
          ),
        );
      }
      case dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      case budget:
        return MaterialPageRoute(builder: (_) => const BudgetScreen());
      case mainNav:
        return MaterialPageRoute(builder: (_) => const MainNavigationWrapper());
      case editProfile:
        return MaterialPageRoute(builder: (_) => const EditProfileScreen());
      case profileNotification:
        return MaterialPageRoute(builder: (_) => const NotificationScreen());
      case connectBank:
        return MaterialPageRoute(builder: (_) => const ConnectBankScreen());
      case security:
        return MaterialPageRoute(builder: (_) => const SecurityScreen());
      case helpCenter:
        return MaterialPageRoute(builder: (_) => const HelpCenterScreen());
      case dataManagement:
        return MaterialPageRoute(builder: (_) => const DataManagementScreen());
      case userData:
        return MaterialPageRoute(builder: (_) => const UserScreen());
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
