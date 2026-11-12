import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/theme.dart';
import '../navigation/app_router.dart';
import '../services/auth_provider.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String? email;
  final String? serverOtp;

  const OtpVerificationScreen({
    super.key,
    this.email,
    this.serverOtp,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  // Controller untuk 6 digit OTP
  final List<TextEditingController> _controllers =
      List.generate(6, (index) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (index) => FocusNode());

  bool _isLoading = false;
  bool _isResending = false;
  int _countdown = 60;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startCountdown();

    for (int i = 0; i < 6; i++) {
      _focusNodes[i].addListener(() {
        if (mounted) setState(() {});
      });
    }

    // Auto-focus first input after build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_focusNodes.isNotEmpty) {
        _focusNodes[0].requestFocus();
      }
    });
  }

  void _startCountdown() {
    _timer?.cancel();
    setState(() => _countdown = 60);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countdown > 0) {
        if (mounted) setState(() => _countdown--);
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (var controller in _controllers) {
      controller.dispose();
    }
    for (var focusNode in _focusNodes) {
      focusNode.dispose();
    }
    super.dispose();
  }

  Future<void> _handleVerifyOtp() async {
    final otp = _controllers.map((c) => c.text.trim()).join();
    if (otp.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan lengkapi 6 digit kode OTP.'),
          backgroundColor: AppColors.errorText,
        ),
      );
      return;
    }

    final email = widget.email ?? '';
    setState(() => _isLoading = true);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final res = await auth.verifyOtp(email, otp);
    if (!mounted) return;
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      Navigator.pushNamed(
        context,
        AppRouter.resetPassword,
        arguments: {
          'email': email,
          'otp': otp,
        },
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Kode OTP salah atau telah kadaluarsa.'),
          backgroundColor: AppColors.errorText,
        ),
      );
    }
  }

  Future<void> _handleResendOtp() async {
    if (_countdown > 0 || _isResending) return;
    final email = widget.email ?? '';
    if (email.isEmpty) return;

    setState(() => _isResending = true);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final res = await auth.sendForgotPasswordOtp(email);
    if (!mounted) return;
    setState(() => _isResending = false);

    if (res['success'] == true) {
      _startCountdown();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Kode OTP baru telah dikirim.'),
          backgroundColor: AppColors.greenAccent,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Gagal mengirim ulang kode OTP.'),
          backgroundColor: AppColors.errorText,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final emailText = widget.email ?? 'email Anda';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Container(
          margin: const EdgeInsets.all(8),
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: const Icon(Icons.arrow_back,
                color: AppColors.textDark, size: 18),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16, top: 12, bottom: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.iconBg,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: const [
                Icon(Icons.check_circle_outline,
                    size: 14, color: AppColors.primaryBrown),
                SizedBox(width: 4),
                Text(
                  'Langkah 2 dari 3',
                  style: TextStyle(
                    color: AppColors.primaryBrown,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 12),
            // Envelope Icon Box
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.iconBg,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(
                Icons.mark_email_read_outlined,
                color: AppColors.primaryBrown,
                size: 28,
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Verifikasi Kode Reset',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Masukkan 6 digit kode OTP yang kami kirimkan ke $emailText untuk mengatur ulang kata sandi Anda.',
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 12,
                height: 1.4,
              ),
            ),

            if (widget.serverOtp != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.accentOrange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.accentOrange.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, size: 16, color: AppColors.accentOrange),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Demo OTP: ${widget.serverOtp}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.accentOrange,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        final code = widget.serverOtp!;
                        for (int i = 0; i < code.length && i < 6; i++) {
                          _controllers[i].text = code[i];
                        }
                        if (_focusNodes.isNotEmpty) {
                          _focusNodes.last.requestFocus();
                        }
                      },
                      child: const Text(
                        'Isi Otomatis',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryBrown,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 24),

            // OTP Box Container Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.inputBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'KODE KEAMANAN 6 DIGIT',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.textMuted,
                          fontSize: 10,
                          letterSpacing: 1.1,
                        ),
                      ),
                      GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Row(
                          children: const [
                            Icon(Icons.edit_outlined,
                                size: 12, color: AppColors.accentOrange),
                            SizedBox(width: 4),
                            Text(
                              'Ubah Email',
                              style: TextStyle(
                                color: AppColors.accentOrange,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),

                  // 6 OTP Digit Inputs
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: List.generate(
                      6,
                      (index) => _buildOtpBox(index),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Resend Timer Box
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.inputBg,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.access_time,
                              size: 14,
                              color: AppColors.primaryBrown,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              _countdown > 0
                                  ? 'Kirim ulang kode dalam '
                                  : 'Belum menerima kode?',
                              style: const TextStyle(
                                color: AppColors.textDark,
                                fontSize: 11,
                              ),
                            ),
                            if (_countdown > 0)
                              Text(
                                '00:${_countdown.toString().padLeft(2, '0')}',
                                style: const TextStyle(
                                  color: AppColors.primaryBrown,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        GestureDetector(
                          onTap: (_countdown == 0 && !_isResending)
                              ? _handleResendOtp
                              : null,
                          child: _isResending
                              ? const SizedBox(
                                  width: 14,
                                  height: 14,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : Text(
                                  'Kirim Ulang Kode',
                                  style: TextStyle(
                                    color: _countdown == 0
                                        ? AppColors.accentOrange
                                        : AppColors.textMuted,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    decoration: _countdown == 0
                                        ? TextDecoration.underline
                                        : TextDecoration.none,
                                  ),
                                ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Tombol Lanjutkan ke Sandi Baru
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBrown,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                onPressed: _isLoading ? null : _handleVerifyOtp,
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text(
                            'Lanjutkan ke Sandi Baru',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 20),

            // Footer Alternatif & Security Info
            Row(
              children: const [
                Expanded(child: Divider(color: AppColors.inputBorder)),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12),
                  child: Text(
                    'Atau alternatif lain',
                    style: TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 11,
                    ),
                  ),
                ),
                Expanded(child: Divider(color: AppColors.inputBorder)),
              ],
            ),
            const SizedBox(height: 16),
            Center(
              child: Column(
                children: [
                  RichText(
                    text: const TextSpan(
                      style:
                          TextStyle(fontSize: 11, color: AppColors.textMuted),
                      children: [
                        TextSpan(text: 'Tidak menerima kode? '),
                        TextSpan(
                          text: 'Hubungi Bantuan MoneyMate ↗',
                          style: TextStyle(
                            color: AppColors.accentOrange,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(
                        Icons.shield_outlined,
                        size: 12,
                        color: AppColors.textMuted,
                      ),
                      SizedBox(width: 4),
                      Text(
                        'Enkripsi 256-bit standar perbankan',
                        style: TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(
                        Icons.lock_outline,
                        size: 12,
                        color: AppColors.textMuted,
                      ),
                      SizedBox(width: 4),
                      Text(
                        'Enkripsi ujung-ke-ujung 256-bit demi keamanan akun Anda',
                        style: TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildOtpBox(int index) {
    bool isFocused = _focusNodes[index].hasFocus;
    return Container(
      width: 44,
      height: 52,
      decoration: BoxDecoration(
        color: AppColors.inputBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isFocused ? AppColors.primaryBrown : AppColors.inputBorder,
          width: isFocused ? 1.5 : 1,
        ),
      ),
      child: TextField(
        controller: _controllers[index],
        focusNode: _focusNodes[index],
        textAlign: TextAlign.center,
        keyboardType: TextInputType.number,
        maxLength: 1,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: AppColors.textDark,
        ),
        decoration: const InputDecoration(
          counterText: '',
          border: InputBorder.none,
        ),
        onChanged: (value) {
          if (value.isNotEmpty) {
            if (index < 5) {
              _focusNodes[index + 1].requestFocus();
            } else {
              _focusNodes[index].unfocus();
            }
          } else if (value.isEmpty && index > 0) {
            _focusNodes[index - 1].requestFocus();
          }
        },
      ),
    );
  }
}
