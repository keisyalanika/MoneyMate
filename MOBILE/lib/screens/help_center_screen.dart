import 'package:flutter/material.dart';
import '../utils/theme.dart';

class HelpCenterScreen extends StatefulWidget {
  const HelpCenterScreen({super.key});

  @override
  State<HelpCenterScreen> createState() => _HelpCenterScreenState();
}

class _HelpCenterScreenState extends State<HelpCenterScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, String>> _faqs = [
    {
      'question': 'Bagaimana cara mencatat transaksi baru?',
      'answer':
          'Kamu dapat menekan tombol tambah (+) di bagian tengah navigation bar bawah. Masukkan jumlah nominal transaksi, keterangan kategori, lalu tekan "Simpan Transaksi".'
    },
    {
      'question': 'Bagaimana cara menghubungkan rekening bank?',
      'answer':
          'Buka menu Profil > pilih tombol "Hubungkan Bank". Pilih institusi bank atau dompet digital milikmu, lalu masukkan nomor rekening dan nama sesuai identitas.'
    },
    {
      'question': 'Apakah data transaksi dan perbankan saya aman?',
      'answer':
          'Ya, MoneyMate menerapkan enkripsi standar industri dan tidak pernah menyimpan PIN maupun password perbankan pengguna.'
    },
    {
      'question': 'Bagaimana cara mengubah anggaran / budget?',
      'answer':
          'Kunjungi menu Laporan atau Budget di aplikasi, pilih kategori yang ingin diubah, lalu sesuaikan batas limit pengeluaran bulananmu.'
    },
    {
      'question': 'Bagaimana jika saya lupa kata sandi akun?',
      'answer':
          'Pada halaman login, kamu dapat menekan tautan "Lupa kata sandi?" dan ikuti petunjuk verifikasi yang dikirimkan ke email terdaftarmu.'
    },
  ];

  late List<Map<String, String>> _filteredFaqs;

  @override
  void initState() {
    super.initState();
    _filteredFaqs = List.from(_faqs);
  }

  void _filterFaqs(String query) {
    setState(() {
      if (query.trim().isEmpty) {
        _filteredFaqs = List.from(_faqs);
      } else {
        _filteredFaqs = _faqs
            .where((item) =>
                item['question']!.toLowerCase().contains(query.toLowerCase()) ||
                item['answer']!.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
  }

  void _showContactSupportDialog() {
    final messageController = TextEditingController();
    final subjectController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
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
                  'Kirim Pesan Bantuan',
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
              'Topik / Subjek Masalah',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: subjectController,
              decoration: InputDecoration(
                hintText: 'Contoh: Kendala hubungkan rekening',
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
              'Detail Pertanyaan atau Masukan',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: messageController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Jelaskan pertanyaan atau kendala yang kamu alami...',
                hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                filled: true,
                fillColor: AppColors.inputBg,
                contentPadding: const EdgeInsets.all(14),
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
                  if (messageController.text.trim().isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Pesan tidak boleh kosong')),
                    );
                    return;
                  }
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Pesan bantuan terkirim! Tim kami akan segera merespons.'),
                      backgroundColor: AppColors.primaryBrown,
                    ),
                  );
                },
                child: const Text('Kirim Pertanyaan', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Pusat Bantuan',
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
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Bar
              TextField(
                controller: _searchController,
                onChanged: _filterFaqs,
                decoration: InputDecoration(
                  hintText: 'Cari pertanyaan atau kata kunci...',
                  hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  prefixIcon: const Icon(Icons.search_rounded, color: AppColors.primaryBrown, size: 22),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            _filterFaqs('');
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Contact Channels
              Row(
                children: [
                  Expanded(
                    child: _buildContactCard(
                      icon: Icons.chat_bubble_outline_rounded,
                      title: 'Live Chat',
                      subtitle: 'Hubungi CS kami',
                      onTap: _showContactSupportDialog,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildContactCard(
                      icon: Icons.mail_outline_rounded,
                      title: 'Email Kami',
                      subtitle: 'support@moneymate.id',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Email support: support@moneymate.id')),
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // FAQ Section
              const Text(
                'Pertanyaan Populer (FAQ)',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBrown,
                ),
              ),
              const SizedBox(height: 12),

              if (_filteredFaqs.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.search_off_rounded, size: 40, color: AppColors.textMuted),
                      SizedBox(height: 8),
                      Text(
                        'Tidak ada FAQ yang cocok dengan pencarian.',
                        style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _filteredFaqs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final item = _filteredFaqs[index];
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Theme(
                        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                        child: ExpansionTile(
                          iconColor: AppColors.primaryBrown,
                          collapsedIconColor: AppColors.textMuted,
                          title: Text(
                            item['question']!,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textDark,
                            ),
                          ),
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                              child: Text(
                                item['answer']!,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textMuted,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.primaryBrown, size: 20),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
            ),
          ],
        ),
      ),
    );
  }
}
