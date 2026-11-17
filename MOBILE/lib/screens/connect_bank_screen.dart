import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/auth_provider.dart';

class ConnectBankScreen extends StatefulWidget {
  final bool isNewUser; // True jika pengguna baru set saldo awal

  const ConnectBankScreen({Key? key, this.isNewUser = false}) : super(key: key);

  @override
  State<ConnectBankScreen> createState() => _ConnectBankScreenState();
}

class _ConnectBankScreenState extends State<ConnectBankScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _amountController = TextEditingController();
  String _selectedType = 'Tambah'; // 'Tambah' atau 'Kurang' (untuk user lama)
  String _selectedWallet = 'Dompet Utama';
  int? _selectedWalletId;
  List<Map<String, dynamic>> _wallets = [];
  bool _isLoadingWallets = true;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadWallets();
  }

  Future<void> _loadWallets() async {
    final result = await ApiService.fetchWallets();
    if (!mounted) return;
    final list = (result['data'] as List?)?.cast<Map<String, dynamic>>() ?? [];
    setState(() {
      _wallets = list;
      if (list.isNotEmpty) {
        _selectedWalletId = list.first['id'] as int?;
        _selectedWallet = (list.first['name'] ?? 'Dompet Utama').toString();
      } else {
        _selectedWalletId = null;
        _selectedWallet = 'Dompet Utama';
      }
      _isLoadingWallets = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isNewUser ? 'Atur Saldo Awal' : 'Kelola Saldo'),
        leading: widget.isNewUser
            ? null
            : IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.pop(context),
              ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.isNewUser
                    ? 'Selamat Datang di MoneyMate! 👋'
                    : 'Penyesuaian Saldo',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.isNewUser
                    ? 'Masukkan saldo awal yang kamu miliki saat ini untuk mulai mengelola budget.'
                    : 'Tambah atau kurangi nominal saldo akun secara manual.',
                style: const TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 24),

              // Pilihan Dompet/Akun
              DropdownButtonFormField<String>(
                value: _selectedWallet,
                decoration: InputDecoration(
                  labelText: 'Pilih Akun / Kategori Saldo',
                  prefixIcon: const Icon(Icons.account_balance_wallet_outlined),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                items: (_wallets.isEmpty
                        ? [
                            {'id': null, 'name': 'Dompet Utama'}
                          ]
                        : _wallets)
                    .map((wallet) {
                  final name = (wallet['name'] ?? 'Dompet Utama').toString();
                  return DropdownMenuItem<String>(
                    value: name,
                    child: Text(name),
                  );
                }).toList(),
                onChanged: _isLoadingWallets
                    ? null
                    : (value) {
                        setState(() {
                          _selectedWallet = value ?? 'Dompet Utama';
                          final match = _wallets.cast<Map<String, dynamic>?>().firstWhere(
                                (wallet) => wallet?['name'] == value,
                                orElse: () => null,
                              );
                          _selectedWalletId = match?['id'] as int?;
                        });
                      },
              ),
              const SizedBox(height: 16),

              // Pilihan Tambah/Kurang (Khusus Pengguna Lama)
              if (!widget.isNewUser) ...[
                Row(
                  children: [
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('Tambah Saldo')),
                        selected: _selectedType == 'Tambah',
                        selectedColor: Colors.green.shade100,
                        onSelected: (selected) {
                          if (selected)
                            setState(() => _selectedType = 'Tambah');
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('Kurangi Saldo')),
                        selected: _selectedType == 'Kurang',
                        selectedColor: Colors.red.shade100,
                        onSelected: (selected) {
                          if (selected)
                            setState(() => _selectedType = 'Kurang');
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],

              // Input Nominal
              TextFormField(
                controller: _amountController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText:
                      widget.isNewUser ? 'Saldo Awal (Rp)' : 'Nominal (Rp)',
                  prefixText: 'Rp ',
                  prefixIcon: const Icon(Icons.attach_money),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Masukkan nominal saldo';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Masukkan angka yang valid';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 30),

              // Tombol Submit
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isSubmitting
                      ? null
                      : () async {
                          if (!_formKey.currentState!.validate()) return;

                          final amount = double.tryParse(
                                _amountController.text.replaceAll(RegExp(r'[^0-9]'), ''),
                              ) ??
                              0;
                          if (amount <= 0) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Nominal saldo tidak valid.')),
                            );
                            return;
                          }

                          setState(() => _isSubmitting = true);
                          final auth = Provider.of<AuthProvider>(context, listen: false);
                          bool success = false;
                          String message = '';

                          if (widget.isNewUser) {
                            final result = await ApiService.setupInitialWalletBalance(amount);
                            success = result['success'] == true;
                            message = result['message']?.toString() ?? '';
                          } else if (_selectedWalletId != null) {
                            final result = await ApiService.adjustWalletBalance(
                              walletId: _selectedWalletId!,
                              type: _selectedType == 'Tambah' ? 'add' : 'subtract',
                              amount: amount,
                            );
                            success = result['success'] == true;
                            message = result['message']?.toString() ?? '';
                          } else {
                            final result = await ApiService.setupInitialWalletBalance(amount);
                            success = result['success'] == true;
                            message = result['message']?.toString() ?? '';
                          }

                          if (!mounted) return;
                          setState(() => _isSubmitting = false);

                          if (!success) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  message.isNotEmpty
                                      ? message
                                      : 'Gagal menyimpan saldo. Periksa koneksi ke server.',
                                ),
                              ),
                            );
                            return;
                          }

                          await auth.refreshFinance();
                          if (!mounted) return;
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Saldo berhasil disimpan.')),
                          );
                          Navigator.pop(context);
                        },
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : Text(
                          widget.isNewUser ? 'Mulai Kelola Budget' : 'Simpan Saldo',
                          style: const TextStyle(fontSize: 16),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
