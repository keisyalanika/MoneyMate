import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  onLoginSuccess: (email: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
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
    onLoginSuccess(email);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#2C221E] flex flex-col justify-between font-sans antialiased">
      {/* Header Bar */}
      <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-[#EBE4D8]/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#5C2D16] text-white flex items-center justify-center font-black text-base shadow-sm">
            M
          </div>
          <div>
            <div className="font-extrabold text-base leading-tight text-[#2C221E]">MoneyMate</div>
            <div className="text-[10px] text-[#8C8077]">Portal Keuangan Kampus</div>
          </div>
        </div>

        <div className="text-sm font-bold text-[#5C2D16] tracking-wide">
          Masuk
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 my-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-[#EBE4D8] shadow-xl space-y-6 relative">
          
          {/* Top Icon Badge */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF0EC] text-[#5C2D16] flex items-center justify-center shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-[#2C221E] tracking-tight">Masuk ke Akun Anda</h1>
            <p className="text-xs text-[#786C65] leading-relaxed">
              Selamat datang kembali! Masukkan email dan kata sandi Anda.
            </p>
          </div>

          {/* Quick Demo Fill Helper Banner */}
          <div className="p-3 bg-[#F8F6F2] border border-[#EBE4D8] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#6E635B]">
              🔑 Demo Admin: <strong className="text-[#2C221E]">KeisyaExaHaniyah@gmail.com</strong>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 bg-[#5C2D16] text-white font-bold rounded-lg text-[11px] hover:bg-[#482210] transition-colors"
            >
              Isi Otomatis
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2C221E] block">
                Email atau Nama Pengguna
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0948D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBE4D8] rounded-xl text-xs text-[#2C221E] placeholder-[#A0948D] focus:outline-none focus:ring-2 focus:ring-[#5C2D16]/20 focus:border-[#5C2D16] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C221E]">Kata Sandi</label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] font-semibold text-[#5C2D16] hover:underline"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0948D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#EBE4D8] rounded-xl text-xs text-[#2C221E] placeholder-[#A0948D] focus:outline-none focus:ring-2 focus:ring-[#5C2D16]/20 focus:border-[#5C2D16] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0948D] hover:text-[#5C2D16]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#5C2D16] rounded border-[#EBE4D8]"
              />
              <label htmlFor="remember" className="text-xs text-[#6E635B] cursor-pointer">
                Ingat saya
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#482210] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5C2D16]/20"
            >
              <span>Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* SSL Badge Subtext */}
        <div className="flex items-center gap-2 mt-6 text-xs text-[#8C8077]">
          <ShieldCheck className="w-4 h-4 text-[#5C2D16]" />
          <span>Koneksi SSL Terenkripsi • Layanan Resmi Kampus</span>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="px-8 py-5 bg-[#F4F0EA] border-t border-[#EBE4D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C8077]">
        <div className="flex items-center gap-1.5">
          <span>🛡️</span>
          <span>© 2024 MoneyMate Keuangan Kampus. Terenkripsi 256-bit SSL.</span>
        </div>
        <div className="flex items-center gap-6 font-medium text-[#6E635B]">
          <a href="#spp" onClick={(e) => e.preventDefault()} className="hover:text-[#5C2D16]">Panduan SPP</a>
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#5C2D16]">Kebijakan Privasi</a>
          <a href="#contact" onClick={(e) => e.preventDefault()} className="hover:text-[#5C2D16]">Hubungi Biro Keuangan</a>
        </div>
      </footer>
    </div>
  );
};
