import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/budget_model.dart';
import '../utils/currency_formatter.dart';

class BudgetScreen extends StatefulWidget {
  const BudgetScreen({super.key});

  @override
  State<BudgetScreen> createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  List<BudgetModel> budgets = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final list = await ApiService.fetchBudgets();
    if (!mounted) return;
    setState(() {
      budgets = list;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Target & Anggaran', style: TextStyle(color: Colors.white)),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: budgets.length,
              itemBuilder: (context, idx) {
                final b = budgets[idx];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(b.categoryName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: (b.percentage / 100).clamp(0.0, 1.0),
                        backgroundColor: Colors.white10,
                        color: b.percentage > 80 ? Colors.redAccent : const Color(0xFF6366F1),
                        minHeight: 8,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Terpakai ${CurrencyFormatter.formatRupiah(b.spentAmount)} dari ${CurrencyFormatter.formatRupiah(b.limitAmount)}',
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      )
                    ],
                  ),
                );
              },
            ),
    );
  }
}
