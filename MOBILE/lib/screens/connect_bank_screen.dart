import 'package:flutter/material.dart';
import '../utils/theme.dart';

class ConnectBankScreen extends StatefulWidget {
  const ConnectBankScreen({super.key});

  @override
  State<ConnectBankScreen> createState() => _ConnectBankScreenState();
}

class _ConnectBankScreenState extends State<ConnectBankScreen> {
  // Data akun bank / e-wallet yang terhubung (dummy siap integrasi backend)
  final List<Map<String, dynamic>> _connectedAccounts = [
    {
      'id': 'acc-1',
      'bankName': 'Bank Central Asia (BCA)',
      'accountNumber': '**** 8921',
      'holderName': 'Keisya Exa Haniyah',
      'type': 'BANK',
      'icon': Icons.account_balance_rounded,
      'color': const Color(0xFF003D79),
      'status': 'Terhubung',
    },
    {
      'id': 'acc-2',
      'bankName': 'GoPay',
      'accountNumber': '0812-****-7890',
      'holderName': 'Keisya Exa Haniyah',
      'type': 'E-WALLET',
      'icon': Icons.account_balance_wallet_rounded,
      'color': const Color(0xFF00AED6),
      'status': 'Terhubung',
    },
  ];

  // Daftar opsi bank & e-wallet yang tersedia untuk dihubungkan
  final List<String> _availableInstitutions = [
    'Bank Central Asia (BCA)',
    'Bank Mandiri',
    'Bank Rakyat Indonesia (BRI)',
    'Bank Negara Indonesia (BNI)',
    'Bank Jago',
    'GoPay',
    'OVO',
    'Dana',
  ];

  void _showAddAccountSheet() {
    String selectedInstitution = _availableInstitutions[0];
    final numberController = TextEditingController();
    final nameController = TextEditingController(text: 'Keisya Exa Haniyah');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Hubungkan Rekening Baru',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'Pilih Bank atau E-Wallet',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: AppColors.inputBg,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.inputBorder),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    isExpanded: true,
                    value: selectedInstitution,
                    items: _availableInstitutions
                        .map((inst) => DropdownMenuItem(
                              value: inst,
                              child: Text(inst, style: const TextStyle(fontSize: 13)),
                            ))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setSheetState(() => selectedInstitution = val);
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                'Nomor Rekening / HP Akun',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: numberController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: 'Contoh: 1234567890',
                  hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.inputBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.inputBorder),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                'Nama Pemilik Rekening',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  hintText: 'Nama sesuai rekening',
                  hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.inputBg,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.inputBorder),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBrown,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    if (numberController.text.trim().isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Nomor rekening tidak boleh kosong')),
                      );
                      return;
                    }

                    setState(() {
                      _connectedAccounts.add({
                        'id': 'acc-${DateTime.now().millisecondsSinceEpoch}',
                        'bankName': selectedInstitution,
                        'accountNumber': '**** ${numberController.text.substring(numberController.text.length > 4 ? numberController.text.length - 4 : 0)}',
                        'holderName': nameController.text.trim(),
                        'type': selectedInstitution.contains('GoPay') || selectedInstitution.contains('OVO') || selectedInstitution.contains('Dana') ? 'E-WALLET' : 'BANK',
                        'icon': Icons.account_balance_rounded,
                        'color': AppColors.primaryBrown,
                        'status': 'Terhubung',
                      });
                    });

                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('$selectedInstitution berhasil dihubungkan!')),
                    );
                  },
                  child: const Text(
                    'Hubungkan Sekarang',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _disconnectAccount(int index) {
    final account = _connectedAccounts[index];
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Putuskan Akun?'),
        content: Text('Apakah kamu yakin ingin memutuskan koneksi dengan ${account['bankName']}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal', style: TextStyle(color: AppColors.textMuted)),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                _connectedAccounts.removeAt(index);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Akun bank berhasil diputuskan')),
              );
            },
            child: const Text('Putuskan', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Hubungkan ke Bank',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.primaryBrown,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppColors.primaryBrown, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Banner info keamanan
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.insightBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.insightBorder),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.lock_rounded, color: AppColors.accentOrange, size: 24),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Data akun kamu dienkripsi dengan standar keamanan perbankan (256-bit SSL). MoneyMate tidak menyimpan kata sandi perbankanmu.',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textDark,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Daftar Akun Terhubung
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Akun yang Terhubung',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                  Text(
                    '${_connectedAccounts.length} Akun',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.accentOrange,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (_connectedAccounts.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.account_balance_outlined,
                          size: 40, color: AppColors.textMuted),
                      SizedBox(height: 8),
                      Text(
                        'Belum ada akun bank yang dihubungkan',
                        style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _connectedAccounts.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _connectedAccounts[index];
                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppColors.background,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(
                              item['icon'] as IconData,
                              color: AppColors.primaryBrown,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item['bankName'] as String,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.textDark,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  '${item['accountNumber']} • ${item['holderName']}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: AppColors.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline_rounded,
                                color: Colors.redAccent, size: 20),
                            onPressed: () => _disconnectAccount(index),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              const SizedBox(height: 24),

              // Tombol Tambah Rekening
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primaryBrown, width: 1.5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    backgroundColor: Colors.white,
                  ),
                  icon: const Icon(Icons.add_rounded, color: AppColors.primaryBrown),
                  label: const Text(
                    'Hubungkan Bank / E-Wallet Baru',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryBrown,
                    ),
                  ),
                  onPressed: _showAddAccountSheet,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
