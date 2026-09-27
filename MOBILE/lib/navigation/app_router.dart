import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/login_screen.dart';
import '../screens/register_screen.dart';
import '../screens/edit_profile_screen.dart';
import '../screens/notification_screen.dart';
import '../screens/connect_bank_screen.dart';
import '../screens/security_screen.dart';
import '../screens/help_center_screen.dart';
import 'main_navigation.dart';

class AppRouter {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String mainNav = '/main';

  // Sub-routes halaman Profil
  static const String editProfile = '/profile/edit';
  static const String profileNotification = '/profile/notification';
  static const String connectBank = '/profile/bank';
  static const String security = '/profile/security';
  static const String helpCenter = '/profile/help';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
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
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(child: Text('Halaman tidak ditemukan')),
          ),
        );
    }
  }
}
