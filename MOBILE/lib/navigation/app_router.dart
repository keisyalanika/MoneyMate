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
import '../screens/edit_profile_screen.dart';
import '../screens/notification_screen.dart';
import '../screens/connect_bank_screen.dart';
import '../screens/security_screen.dart';
import '../screens/help_center_screen.dart';
import '../screens/kelola_kategori_screen.dart';
import '../screens/laporan_screen.dart';
import '../screens/budget_screen.dart';
import '../screens/goals_screen.dart';
import '../screens/goal_detail_screen.dart';
import '../screens/add_goal_screen.dart';
import '../screens/add_goal_funds_screen.dart';
import '../screens/add_transaction_screen.dart';
import '../screens/ai_chat_screen.dart';
import '../screens/ai_insight_screen.dart';
import '../screens/setup_saldo_screen.dart';
import '../screens/transaction_screen.dart';
import '../screens/transaction_kosong_screen.dart';

class AppRouter {
  // Definisi Rute (Route Names)
  static const String splash = '/';
  static const String login = '/login';
  static const String loginError = '/login-error';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String budget = '/budget';
  static const String otpVerification = '/otp-verification';
  static const String resetPassword = '/reset-password';
  static const String dashboard = '/dashboard';
  static const String mainNav = '/main-navigation';
  static const String editProfile = '/edit-profile';
  static const String profileNotification = '/profile-notification';
  static const String connectBank = '/connect-bank';
  static const String security = '/security';
  static const String helpCenter = '/help-center';
  static const String kelolaKategori = '/kelola-kategori';
  static const String laporan = '/laporan';
  static const String goals = '/goals';
  static const String goalDetail = '/goal-detail';
  static const String addGoal = '/add-goal';
  static const String addGoalFunds = '/add-goal-funds';
  static const String addTransaction = '/add-transaction';
  static const String aiChat = '/ai-chat';
  static const String aiInsight = '/ai-insight';
  static const String setupSaldo = '/setup-saldo';
  static const String transaction = '/transaction';
  static const String transactionKosong = '/transaction-kosong';

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
      case '/main':
        return MaterialPageRoute(builder: (_) => const MainNavigationWrapper());
      case editProfile:
      case '/profile/edit':
        return MaterialPageRoute(builder: (_) => const EditProfileScreen());
      case profileNotification:
      case '/profile/notification':
        return MaterialPageRoute(builder: (_) => const NotificationScreen());
      case connectBank:
      case '/profile/bank':
        return MaterialPageRoute(builder: (_) => const ConnectBankScreen());
      case security:
      case '/profile/security':
        return MaterialPageRoute(builder: (_) => const SecurityScreen());
      case helpCenter:
      case '/profile/help':
        return MaterialPageRoute(builder: (_) => const HelpCenterScreen());
      case kelolaKategori:
        return MaterialPageRoute(builder: (_) => const KelolaKategoriScreen());
      case laporan:
        return MaterialPageRoute(builder: (_) => const LaporanScreen());
      case budget:
        return MaterialPageRoute(builder: (_) => const BudgetScreen());
      case goals:
        return MaterialPageRoute(builder: (_) => const GoalsScreen());
      case goalDetail:
        return MaterialPageRoute(builder: (_) => const GoalDetailScreen());
      case addGoal:
        return MaterialPageRoute(builder: (_) => const AddGoalScreen());
      case addGoalFunds:
        return MaterialPageRoute(builder: (_) => const AddGoalFundsScreen());
      case addTransaction:
        return MaterialPageRoute(builder: (_) => const AddTransactionScreen());
      case aiChat:
        return MaterialPageRoute(builder: (_) => const AiChatScreen());
      case aiInsight:
        return MaterialPageRoute(builder: (_) => const AiInsightScreen());
      case setupSaldo:
        return MaterialPageRoute(builder: (_) => const SetupSaldoScreen());
      case transaction:
        return MaterialPageRoute(builder: (_) => const TransactionScreen());
      case transactionKosong:
        return MaterialPageRoute(builder: (_) => const TransactionKosongScreen());
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
