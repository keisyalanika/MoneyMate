"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, Lock, Mail, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message ?? "Login gagal. Periksa email dan kata sandi.");
        return;
      }

      if (payload?.user) setUser(payload.user);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server.");
    }
  });

  return (
    <div className="flex min-h-dvh w-full overflow-hidden bg-canvas">
      <div className="relative hidden w-[760px] shrink-0 flex-col justify-between overflow-hidden bg-brand p-14 lg:flex">
        <div className="pointer-events-none absolute -left-28 top-[560px] size-[420px] rounded-full bg-[#6E3320] opacity-60" />
        <div className="pointer-events-none absolute -right-24 -top-28 size-[360px] rounded-full bg-orange opacity-20" />
        <div className="pointer-events-none absolute left-[300px] top-[420px] size-[200px] rounded-full bg-gold opacity-[0.08]" />

        <div className="relative flex items-center gap-3">
          <BrandLogo className="bg-[#6E3320]" />
          <span className="text-lg font-extrabold text-[#FFF7F2]">MoneyMate</span>
          <span className="rounded-full bg-[#6E3320] px-2.5 py-1 text-[10px] font-bold text-gold">
            ADMIN
          </span>
        </div>

        <div className="relative flex max-w-[540px] flex-col gap-5">
          <span className="w-fit rounded-full bg-[#6E3320] px-3 py-1.5 text-[10px] font-bold text-gold">
            PORTAL ADMINISTRATOR
          </span>
          <h1 className="text-[42px] font-extrabold leading-[1.25] text-[#FFF7F2]">
            Kelola ekosistem keuangan mahasiswa dengan tenang.
          </h1>
          <p className="max-w-[470px] text-[15px] leading-relaxed text-[#E6D0C7]">
            Pantau pertumbuhan pengguna, distribusi kategori, dan aktivitas sistem
            tanpa menyentuh data pribadi tiap mahasiswa.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            {["Kelola pengguna", "Kelola kategori", "Audit log"].map((item) => (
              <span key={item} className="rounded-xl bg-[#6E3320] px-3.5 py-2.5 text-[11px] text-[#FFF7F2]">
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-[#A88F82]">© 2026 MoneyMate · Portal Admin Kampus</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-4 sm:p-8 lg:p-10">
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-[420px] flex-col gap-4 rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_64px_rgba(89,35,20,0.10)] sm:p-8 lg:p-10"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-tint">
            <ShieldCheck className="size-5 text-brand" />
          </span>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-[26px] font-extrabold text-ink">Masuk sebagai Admin</h2>
            <p className="text-[13px] leading-relaxed text-subtle">
              Gunakan akun administrator untuk mengelola pengguna dan kategori MoneyMate.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xs font-semibold text-ink">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="admin@moneymate.com"
                aria-label="Email"
                className="h-11 rounded-xl border-line bg-field pl-10 text-[13px]"
                autoComplete="email"
              />
            </div>
            {form.formState.errors.email && (
              <span className="text-[10px] text-bad">{form.formState.errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-xs font-semibold text-ink">
              Kata sandi
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                placeholder="••••••••"
                aria-label="Kata sandi"
                className="h-11 rounded-xl border-line bg-field pl-10 pr-10 text-[13px]"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle"
                aria-label="Tampilkan kata sandi"
              >
                <Eye className="size-4" />
              </button>
            </div>
            {form.formState.errors.password && (
              <span className="text-[10px] text-bad">{form.formState.errors.password.message}</span>
            )}
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-ink">
              <input type="checkbox" className="size-4 rounded border-line accent-brand" />
              Ingat saya
            </label>
          </div>

          {error && <p className="rounded-lg bg-badbg px-3 py-2 text-xs text-bad">{error}</p>}

          <Button
            type="submit"
            isDisabled={form.formState.isSubmitting}
            className="h-12 w-full gap-2 rounded-xl bg-brand text-[13px] font-bold text-[#FFF7F2] hover:bg-brand/90"
          >
            {form.formState.isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}
            <ArrowRight className="size-4" />
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-subtle">
            <Lock className="size-3" />
            Akses terbatas untuk administrator kampus
          </p>
        </form>

        <p className="text-xs text-subtle">Butuh bantuan? Hubungi tim IT kampus.</p>
      </div>
    </div>
  );
}
