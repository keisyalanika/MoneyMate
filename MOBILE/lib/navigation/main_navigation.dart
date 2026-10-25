import 'package:flutter/material.dart';
import '../screens/dashboard_screen.dart';
import '../screens/transaction_screen.dart';
import '../screens/laporan_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/add_transaction_screen.dart';

class MainNavigationWrapper extends StatefulWidget {
  const MainNavigationWrapper({super.key});

  @override
  State<MainNavigationWrapper> createState() => _MainNavigationWrapperState();
}

class _MainNavigationWrapperState extends State<MainNavigationWrapper> {
  int _currentIndex = 0;

  List<Widget> get _pages => const [
    DashboardScreen(key: ValueKey('tab_dashboard')),
    TransactionScreen(key: ValueKey('tab_transaction')),
    SizedBox(key: ValueKey('tab_placeholder')),
    LaporanScreen(key: ValueKey('tab_laporan')),
    ProfileScreen(key: ValueKey('tab_profile')),
  ];

  void _goToAddTransaction(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AddTransactionScreen()),
    );
    if (result != null) {
      if (result is Map<String, dynamic>) {
        newTransactionNotifier.value = result;
      }
      setState(() {
        _currentIndex = 1;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        key: const ValueKey('main_nav_indexed_stack_v2_fixed'),
        index: _currentIndex.clamp(0, 4),
        children: _pages,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          backgroundColor: Colors.white,
          selectedItemColor: const Color(0xFF5E2B16),
          unselectedItemColor: Colors.grey.shade400,
          type: BottomNavigationBarType.fixed,
          selectedFontSize: 10,
          unselectedFontSize: 10,
          onTap: (idx) {
            if (idx == 2) {
              _goToAddTransaction(context);
            } else {
              setState(() => _currentIndex = idx);
            }
          },
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              label: 'Dashboard',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.receipt_long_rounded),
              label: 'Transaksi',
            ),
            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(9),
                decoration: const BoxDecoration(
                  color: Color(0xFF5E2B16),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 20),
              ),
              label: '',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.bar_chart_rounded),
              label: 'Laporan',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.person_outline_rounded),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}
