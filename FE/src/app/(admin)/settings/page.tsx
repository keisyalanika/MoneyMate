"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminProfile } from "@/lib/mock";
import { passwordSchema, profileSchema, type PasswordInput, type ProfileInput } from "@/lib/validators";
import { useToastStore } from "@/stores/toastStore";

export default function SettingsPage() {
  const toast = useToastStore((state) => state.push);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: adminProfile.name,
      email: adminProfile.email,
      phone: adminProfile.phone,
    },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = profileForm.handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast("Profil berhasil diperbarui", "success");
  });

  const onChangePassword = passwordForm.handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast("Kata sandi berhasil diperbarui", "success");
    passwordForm.reset();
  });

  return (
    <Tabs defaultSelectedKey="profil" aria-label="Pengaturan akun" className="w-full">
      <TabsList variant="line" className="w-full justify-start gap-1 rounded-none border-b border-line p-0">
        {[
          { id: "profil", label: "Profil" },
          { id: "keamanan", label: "Keamanan" },
          { id: "preferensi", label: "Preferensi" },
        ].map((tab) => (
          <TabsTrigger
            key={tab.id}
            id={tab.id}
            className="h-10 flex-none rounded-none px-3.5 text-[11px] font-semibold text-subtle after:bottom-0 after:h-0.5 after:bg-brand data-selected:bg-tint data-selected:text-brand"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent id="profil" className="pt-4">
        <Card className="w-full max-w-3xl gap-0 rounded-2xl py-0 ring-1 ring-line">
          <form onSubmit={onSaveProfile} className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-extrabold text-ink">Profil Administrator</span>
              <span className="text-[10px] text-subtle">Informasi ini tampil pada log aktivitas.</span>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="flex size-16 items-center justify-center rounded-full bg-[#E6D0C7] text-[22px] font-bold text-brand">
                A
              </span>
              <div className="flex flex-col gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg border-transparent bg-tint px-3 text-[11px] font-semibold text-brand"
                >
                  <Upload className="size-3.5" />
                  Ubah foto
                </Button>
                <span className="text-[9px] text-subtle">JPG atau PNG, maksimal 2 MB.</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold text-ink">Nama lengkap</Label>
              <Input {...profileForm.register("name")} placeholder="Nama lengkap" aria-label="Nama lengkap" className="h-10 rounded-[10px] border-line bg-field text-xs" />
              {profileForm.formState.errors.name && (
                <span className="text-[10px] text-bad">{profileForm.formState.errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold text-ink">Email</Label>
              <Input {...profileForm.register("email")} type="email" placeholder="admin@moneymate.com" aria-label="Email" className="h-10 rounded-[10px] border-line bg-field text-xs" />
              {profileForm.formState.errors.email && (
                <span className="text-[10px] text-bad">{profileForm.formState.errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold text-ink">Nomor telepon</Label>
              <Input {...profileForm.register("phone")} placeholder="0812-3456-7890" aria-label="Nomor telepon" className="h-10 rounded-[10px] border-line bg-field text-xs" />
            </div>

            <Button
              type="submit"
              isDisabled={profileForm.formState.isSubmitting}
              className="h-10 w-fit gap-1.5 rounded-[10px] bg-brand px-4 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90"
            >
              <Save className="size-3.5" />
              {profileForm.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </Card>
      </TabsContent>

      <TabsContent id="keamanan" className="pt-4">
        <Card className="w-full max-w-3xl gap-0 rounded-2xl py-0 ring-1 ring-line">
          <form onSubmit={onChangePassword} className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-extrabold text-ink">Keamanan Akun</span>
              <span className="text-[10px] text-subtle">Ganti kata sandi administrator.</span>
            </div>

            {[
              { name: "currentPassword" as const, label: "Kata sandi saat ini", placeholder: "••••••••" },
              { name: "newPassword" as const, label: "Kata sandi baru", placeholder: "Minimal 6 karakter" },
              { name: "confirmPassword" as const, label: "Ulangi kata sandi baru", placeholder: "Ulangi kata sandi baru" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-semibold text-ink">{field.label}</Label>
                <Input
                  {...passwordForm.register(field.name)}
                  type="password"
                  placeholder={field.placeholder}
                  aria-label={field.label}
                  className="h-10 rounded-[10px] border-line bg-field text-xs"
                />
                {passwordForm.formState.errors[field.name] && (
                  <span className="text-[10px] text-bad">
                    {passwordForm.formState.errors[field.name]?.message}
                  </span>
                )}
              </div>
            ))}

            <Button
              type="submit"
              isDisabled={passwordForm.formState.isSubmitting}
              className="h-10 w-fit gap-1.5 rounded-[10px] bg-brand px-4 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90"
            >
              <Save className="size-3.5" />
              {passwordForm.formState.isSubmitting ? "Menyimpan..." : "Simpan Kata Sandi"}
            </Button>
          </form>
        </Card>
      </TabsContent>

      <TabsContent id="preferensi" className="pt-4">
        <Card className="w-full max-w-3xl gap-0 rounded-2xl py-0 ring-1 ring-line">
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-extrabold text-ink">Preferensi</span>
              <span className="text-[10px] text-subtle">Pengaturan tampilan dan notifikasi admin.</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink">Notifikasi email</span>
                <span className="text-[10px] text-subtle">Terima ringkasan aktivitas harian.</span>
              </div>
              <Switch defaultSelected aria-label="Aktifkan notifikasi" />
            </div>

            <div className="h-px w-full bg-line-soft" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink">Notifikasi pengguna baru</span>
                <span className="text-[10px] text-subtle">Beri tahu saat ada pendaftar baru.</span>
              </div>
              <Switch defaultSelected aria-label="Aktifkan notifikasi" />
            </div>

            <div className="h-px w-full bg-line-soft" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink">Mode gelap</span>
                <span className="text-[10px] text-subtle">Segera hadir.</span>
              </div>
              <Switch isDisabled aria-label="Mode gelap" />
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
