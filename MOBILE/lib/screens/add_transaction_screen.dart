import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/category_model.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({super.key});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  String title = '';
  double amount = 0;
  String type = 'EXPENSE';
  String? selectedCategoryId;
  String notes = '';

  List<CategoryModel> categories = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    final cats = await ApiService.fetchCategories();
    if (!mounted) return;
    setState(() {
      categories = cats;
      if (cats.isNotEmpty) selectedCategoryId = cats.first.id;
      isLoading = false;
    });
  }

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      final success = await ApiService.addTransaction({
        'title': title,
        'amount': amount,
        'type': type,
        'categoryId': selectedCategoryId,
        'notes': notes,
      });

      if (!mounted) return;
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Transaksi berhasil ditambahkan!')),
        );
        Navigator.pop(context, true);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Catat Transaksi Baru', style: TextStyle(color: Colors.white)),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: ListView(
                  children: [
                    DropdownButtonFormField<String>(
                      initialValue: type,
                      dropdownColor: const Color(0xFF1E293B),
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(labelText: 'Tipe Transaksi', labelStyle: TextStyle(color: Colors.white70)),
                      items: const [
                        DropdownMenuItem(value: 'EXPENSE', child: Text('Pengeluaran')),
                        DropdownMenuItem(value: 'INCOME', child: Text('Pemasukan')),
                      ],
                      onChanged: (val) => setState(() => type = val!),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(labelText: 'Judul Transaksi', labelStyle: TextStyle(color: Colors.white70)),
                      validator: (val) => val == null || val.isEmpty ? 'Judul wajib diisi' : null,
                      onSaved: (val) => title = val!,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(labelText: 'Nominal (Rp)', labelStyle: TextStyle(color: Colors.white70)),
                      validator: (val) => val == null || val.isEmpty ? 'Nominal wajib diisi' : null,
                      onSaved: (val) => amount = double.parse(val!),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      initialValue: selectedCategoryId,
                      dropdownColor: const Color(0xFF1E293B),
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(labelText: 'Kategori', labelStyle: TextStyle(color: Colors.white70)),
                      items: categories.map((c) {
                        return DropdownMenuItem(value: c.id, child: Text(c.name));
                      }).toList(),
                      onChanged: (val) => setState(() => selectedCategoryId = val),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(labelText: 'Catatan', labelStyle: TextStyle(color: Colors.white70)),
                      onSaved: (val) => notes = val ?? '',
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6366F1),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _submit,
                      child: const Text('Simpan Transaksi', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                    )
                  ],
                ),
              ),
            ),
    );
  }
}
