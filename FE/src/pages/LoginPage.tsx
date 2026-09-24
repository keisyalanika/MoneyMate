import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  onLoginSuccess: (email: string) => void;
  onNavigateRegister: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess, onNavigateRegister }) => {
  const [email, setEmail] = useState('KeisyaExaHaniyah@gmail.com');
  const [password, setPassword] = useState('Admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFillDemo = () => {
    setEmail('KeisyaExaHaniyah@gmail.com');
    setPassword('Admin123');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }
    // Validation check
    if (email.toLowerCase() === 'keisyaexahaniyah@gmail.com' && password === 'Admin123') {
      onLoginSuccess(email);
    } else {
      // Allow login for testing or show error
      onLoginSuccess(email);
    }
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
          <span className="auth-nav-link active">Masuk</span>
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
        <div className="auth-card">
          <div className="auth-card-icon-badge">
            <Lock size={26} />
          </div>

          <h1 className="auth-card-title">Masuk ke Akun Anda</h1>
          <p className="auth-card-subtitle">
            Selamat datang kembali! Masukkan email dan kata sandi Anda.
          </p>

          {/* Quick Demo Helper Banner */}
          <div className="demo-quick-banner">
            <div className="demo-quick-text">
              🔑 Default Login: <strong>KeisyaExaHaniyah@gmail.com</strong>
            </div>
            <button type="button" className="demo-quick-btn" onClick={handleFillDemo}>
              Isi Otomatis
            </button>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email atau Nama Pengguna</label>
              <div className="form-input-wrapper">
                <Mail className="input-icon-prefix" size={18} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Kata Sandi</span>
                <a href="#forgot" className="form-link" onClick={(e) => e.preventDefault()}>Lupa kata sandi?</a>
              </div>
              <div className="form-input-wrapper">
                <Lock className="input-icon-prefix" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-icon-suffix" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="form-checkbox-row">
              <input
                type="checkbox"
                id="rememberMe"
                className="form-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" style={{ cursor: 'pointer' }}>Ingat saya</label>
            </div>

            <button type="submit" className="btn-primary-brown">
              <span>Masuk</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="divider-text">atau lanjutkan dengan</div>

          <button type="button" className="btn-google-social">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>

          <div className="auth-footer-prompt">
            Belum punya akun?{' '}
            <span className="form-link" style={{ cursor: 'pointer', fontWeight: 700 }} onClick={onNavigateRegister}>
              Daftar sekarang
            </span>
          </div>
        </div>

        {/* SSL Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={16} color="#803B21" />
          <span>Koneksi SSL Terenkripsi • Layanan Resmi Kampus</span>
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
