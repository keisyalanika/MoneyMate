"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService, type AdminProfileData } from "@/lib/services/admin";
import { passwordSchema, profileSchema, type PasswordInput, type ProfileInput } from "@/lib/validators";
import { useToastStore } from "@/stores/toastStore";
import { useAuthStore } from "@/stores/authStore";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:5000";

function resolveAvatar(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function SettingsPage() {
  const toast = useToastStore((state) => state.push);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    let active = true;
    adminService
      .getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        profileForm.reset({
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
        });
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar_url: data.avatar_url ?? "",
          phone: data.phone ?? undefined,
        });
      })
      .catch((error: Error) => toast(error.message, "error"))
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser]);

  const onSaveProfile = profileForm.handleSubmit(async (values) => {
    try {
      const updated = await adminService.updateProfile({
        name: values.name,
        phone: values.phone,
      });
      setProfile((current) => ({ ...(current as AdminProfileData), ...updated }));
      if (user) {
        setUser({
          ...user,
          name: updated.name,
          phone: updated.phone,
        });
      }
      toast("Profil berhasil diperbarui", "success");
    } catch (error) {
      toast((error as Error).message, "error");
    }
  });

  const onChangePassword = passwordForm.handleSubmit(async (values) => {
    try {
      await adminService.changePassword(values.currentPassword, values.newPassword);
      toast("Kata sandi berhasil diperbarui", "success");
      passwordForm.reset();
    } catch (error) {
      toast((error as Error).message, "error");
    }
  });

  const onPickAvatar = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const updated = await adminService.uploadAvatar(file);
      setProfile((current) => ({ ...(current as AdminProfileData), ...updated }));
      if (user) {
        setUser({
          ...user,
          avatar_url: updated.avatar_url,
        });
      } else if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatar_url: updated.avatar_url,
          phone: profile.phone ?? undefined,
        });
      }
      toast("Foto profil berhasil diperbarui", "success");
    } catch (error) {
      toast((error as Error).message, "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const avatarUrl = resolveAvatar(profile?.avatar_url);

  return (
    <Tabs defaultSelectedKey="profil" aria-label="Pengaturan akun" className="w-full">
      <TabsList variant="line" className="w-full justify-start gap-1 rounded-none border-b border-line p-0">
        {[
          { id: "profil", label: "Profil" },
          { id: "keamanan", label: "Keamanan" },
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
              <span
                className="flex size-16 items-center justify-center rounded-full bg-[#E6D0C7] bg-cover bg-center text-[22px] font-bold text-brand"
                style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
              >
                {!avatarUrl && (profile?.name?.[0]?.toUpperCase() ?? "A")}
              </span>
              <div className="flex flex-col gap-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => onPickAvatar(event.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onPress={() => fileInputRef.current?.click()}
                  isDisabled={isUploading}
                  className="h-8 gap-1.5 rounded-lg border-transparent bg-tint px-3 text-[11px] font-semibold text-brand"
                >
                  {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                  {isUploading ? "Mengunggah..." : "Ubah foto"}
                </Button>
                <span className="text-[9px] text-subtle">JPG, PNG, atau WEBP, maksimal 5 MB.</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-xs text-subtle">
                <Loader2 className="size-4 animate-spin" /> Memuat profil...
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Nama lengkap</Label>
                  <Input {...profileForm.register("name")} placeholder="Nama lengkap" aria-label="Nama lengkap" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                  {profileForm.formState.errors.name && (
                    <span className="text-[10px] text-bad">{profileForm.formState.errors.name.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Email</Label>
                  <Input {...profileForm.register("email")} readOnly type="email" aria-label="Email" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                  <span className="text-[9px] text-subtle">Email akun tidak dapat diubah dari halaman ini.</span>
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
              </>
            )}
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
    </Tabs>
  );
}
