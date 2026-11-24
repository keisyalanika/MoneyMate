import nodemailer from 'nodemailer';

// ─── Konfigurasi transporter dari environment variable ──────────────────────
// Dukung 2 mode:
//   1. SMTP biasa  : Gmail App Password, Mailtrap, dll.
//   2. Dev/mock   : EMAIL_MOCK=true → tidak kirim email, OTP hanya di console.
// ─────────────────────────────────────────────────────────────────────────────

function createTransporter() {
  const isMock = process.env.EMAIL_MOCK === 'true';
  if (isMock) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true untuk port 465
    auth: {
      user: (process.env.SMTP_USER || '').trim(),
      // Gmail App Password sering disalin dengan spasi; hapus semua spasi.
      pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    },
    tls: {
      rejectUnauthorized: false, // izinkan self-signed cert di dev
    },
  });
}

// ─── Template HTML email OTP ────────────────────────────────────────────────
function buildOtpEmailHtml(otp: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Kode OTP MoneyMate</title>
</head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:20px;overflow:hidden;
                 box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#7C5C3E;padding:28px 24px;">
              <div style="display:inline-block;background:#ffffff;
                          border-radius:14px;padding:10px 18px;">
                <span style="font-size:22px;font-weight:bold;color:#7C5C3E;
                             letter-spacing:1px;">MoneyMate</span>
              </div>
              <p style="color:#F5E6D8;margin:12px 0 0;font-size:13px;">
                Pemulihan Kata Sandi
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 24px;">
              <p style="margin:0 0 8px;font-size:18px;font-weight:bold;
                         color:#2D2D2D;">Kode Verifikasi OTP</p>
              <p style="margin:0 0 28px;font-size:13px;color:#888;line-height:1.6;">
                Gunakan kode di bawah untuk mengatur ulang kata sandi akun MoneyMate Anda.
                Kode berlaku selama <strong>15 menit</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#F5F0EB;border-radius:14px;
                           padding:28px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 8px;font-size:11px;color:#999;
                           letter-spacing:2px;text-transform:uppercase;">
                  Kode OTP Anda
                </p>
                <p style="margin:0;font-size:40px;font-weight:bold;
                           letter-spacing:12px;color:#7C5C3E;">
                  ${otp}
                </p>
              </div>

              <p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">
                ⚠️ <strong>Jangan bagikan kode ini</strong> kepada siapapun, 
                termasuk tim MoneyMate. Jika Anda tidak meminta reset kata sandi, 
                abaikan email ini.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#FAF7F4;padding:16px 36px;border-top:1px solid #EEE;">
              <p style="margin:0;font-size:11px;color:#BBB;text-align:center;">
                © ${new Date().getFullYear()} MoneyMate · Email ini dikirim otomatis, 
                jangan balas email ini.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─── Fungsi utama: kirim OTP via email ──────────────────────────────────────
export async function sendOtpEmail(toEmail: string, otp: string): Promise<void> {
  const isMock = process.env.EMAIL_MOCK === 'true';

  // Mode mock: hanya console.log — tidak butuh SMTP
  if (isMock) {
    console.log('─'.repeat(50));
    console.log(`[EMAIL MOCK] Kepada  : ${toEmail}`);
    console.log(`[EMAIL MOCK] OTP     : ${otp}`);
    console.log(`[EMAIL MOCK] Berlaku : 15 menit`);
    console.log('─'.repeat(50));
    return;
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      'SMTP_USER / SMTP_PASS belum diisi. Atur kredensial SMTP atau set EMAIL_MOCK=true.'
    );
  }

  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Gagal membuat koneksi SMTP.');
  }

  await transporter.sendMail({
    from: `"MoneyMate" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `${otp} — Kode OTP Pemulihan Kata Sandi MoneyMate`,
    html: buildOtpEmailHtml(otp),
    text: `Kode OTP MoneyMate Anda: ${otp}\n\nBerlaku 15 menit. Jangan bagikan ke siapapun.`,
  });

  console.log(`[EMAIL] OTP berhasil dikirim ke ${toEmail}`);
}
