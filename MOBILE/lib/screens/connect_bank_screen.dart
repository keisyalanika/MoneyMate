import 'package:flutter/material.dart';

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

  final List<String> _wallets = [
    'Dompet Utama',
    'Rekening Bank',
    'E-Wallet',
    'Tabungan'
  ];

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
                items: _wallets.map((wallet) {
                  return DropdownMenuItem(
                    value: wallet,
                    child: Text(wallet),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedWallet = value!;
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
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      final amount = _amountController.text;
                      final actionText = widget.isNewUser
                          ? 'Saldo awal sebesar Rp $amount berhasil diatur!'
                          : 'Saldo $_selectedWallet berhasil di${_selectedType.toLowerCase()}kan sebesar Rp $amount';

                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(actionText)),
                      );

                      if (widget.isNewUser) {
                        // Navigate ke Home / Dashboard
                        Navigator.pushReplacementNamed(context, '/home');
                      } else {
                        Navigator.pop(context);
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
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
