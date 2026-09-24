import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, RotateCcw, ArrowRight } from 'lucide-react';

interface Props {
  onRegisterSuccess: (email: string) => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<Props> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: 'Belum diisi', color: '#D1D5DB' };
    if (password.length < 6) return { level: 1, text: 'Lemah', color: '#EF4444' };
    if (password.length < 10) return { level: 2, text: 'Sedang', color: '#F59E0B' };
    return { level: 3, text: 'Kuat', color: '#10B981' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Anda harus menyetujui Syarat & Ketentuan.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    onRegisterSuccess(email || 'KeisyaExaHaniyah@gmail.com');
  };

  return (
    <div className="auth-page-container">
      {/* Header */}
      <header className="auth-header">
        <div className="logo-brand">
          <div className="logo-icon-bg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3L2 10h20L12 3z" />
            </svg>
          </div>
          <div>
            <div className="logo-title">MoneyMate</div>
            <div className="logo-subtitle">Portal Keuangan Kampus</div>
          </div>
        </div>

        <nav className="auth-header-nav">
          <span className="auth-nav-link" onClick={onNavigateLogin}>Masuk</span>
          <span className="auth-nav-link">Pusat Bantuan</span>
          <span className="auth-nav-link">Status Pembayaran</span>
          <div className="user-avatar-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </nav>
      </header>

      {/* Main Body */}
      <main className="auth-main">
        <div className="auth-card" style={{ maxWidth: '520px' }}>
          <div className="auth-card-icon-badge">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="17" y1="11" x2="23" y2="11" />
            </svg>
          </div>

          <h1 className="auth-card-title">Buat Akun Baru</h1>
          <p className="auth-card-subtitle">
            Daftar dalam 1 menit untuk mulai mengelola keuangan Anda.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <span>Nama Lengkap <span className="form-label-required">*</span></span>
              </label>
              <div className="form-input-wrapper">
                <User className="input-icon-prefix" size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nama lengkap Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Alamat Email <span className="form-label-required">*</span></span>
              </label>
              <div className="form-input-wrapper">
                <Mail className="input-icon-prefix" size={18} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Kata Sandi <span className="form-label-required">*</span></span>
              </label>
              <div className="form-input-wrapper">
                <Lock className="input-icon-prefix" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-icon-suffix" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      style={{
                        height: '4px',
                        borderRadius: '2px',
                        backgroundColor: step <= strength.level ? strength.color : '#E5E7EB',
                        transition: 'background-color 0.2s'
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Kekuatan Sandi:</span>
                  <span style={{ fontWeight: 700, color: strength.color }}>{strength.text}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Konfirmasi Kata Sandi <span className="form-label-required">*</span></span>
              </label>
              <div className="form-input-wrapper">
                <RotateCcw className="input-icon-prefix" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="input-icon-suffix" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="form-checkbox-row">
              <input
                type="checkbox"
                id="agreeTerms"
                className="form-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="agreeTerms" style={{ cursor: 'pointer', lineHeight: '1.4' }}>
                Saya menyetujui <a href="#terms" className="form-link">Syarat & Ketentuan</a> dan <a href="#privacy" className="form-link">Kebijakan Privasi</a> MoneyMate.
              </label>
            </div>

            <button type="submit" className="btn-primary-brown">
              <span>Daftar Akun Baru</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="divider-text">ATAU DAFTAR DENGAN</div>

          <button type="button" className="btn-google-social">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Daftar dengan Google</span>
          </button>

          <div className="auth-footer-prompt">
            Sudah memiliki akun?{' '}
            <span className="form-link" style={{ cursor: 'pointer', fontWeight: 700 }} onClick={onNavigateLogin}>
              Masuk di sini
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-page-footer">
        <div>© 2024 MoneyMate Keuangan Kampus. Terenkripsi 256-bit SSL.</div>
        <div className="auth-footer-links">
          <a href="#spp">Panduan SPP</a>
          <a href="#privacy">Kebijakan Privasi</a>
          <a href="#contact">Hubungi Biro Keuangan</a>
        </div>
      </footer>
    </div>
  );
};
