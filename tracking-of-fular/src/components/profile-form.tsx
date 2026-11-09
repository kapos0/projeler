"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileForm({ name, email }: { name: string; email: string }) {
    const [form, setForm] = useState({ name, email });
    const [passwords, setPasswords] = useState({ current: "", next: "", confirmation: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setError("");
        setIsPending(true);

        const nameResult = await authClient.updateUser({ name: form.name.trim() });
        if (nameResult.error) {
            setError(nameResult.error.message ?? "Hesap bilgileri güncellenemedi.");
            setIsPending(false);
            return;
        }

        if (form.email.trim().toLowerCase() !== email.toLowerCase()) {
            const emailResult = await authClient.changeEmail({
                newEmail: form.email.trim(),
                callbackURL: "/profile",
            });
            if (emailResult.error) {
                setError(emailResult.error.message ?? "E-posta adresi güncellenemedi.");
                setIsPending(false);
                return;
            }
            setMessage("Değişiklikler kaydedildi. Yeni e-posta adresini doğrulaman gerekebilir.");
        } else {
            setMessage("Değişiklikler kaydedildi.");
        }
        setIsPending(false);
    }

    async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordMessage("");
        setPasswordError("");
        if (passwords.next !== passwords.confirmation) {
            setPasswordError("Yeni şifreler eşleşmiyor.");
            return;
        }
        setIsPending(true);
        const result = await authClient.changePassword({
            currentPassword: passwords.current,
            newPassword: passwords.next,
            revokeOtherSessions: true,
        });
        if (result.error) {
            setPasswordError(result.error.message ?? "Şifre değiştirilemedi.");
        } else {
            setPasswords({ current: "", next: "", confirmation: "" });
            setPasswordMessage("Şifren değiştirildi.");
        }
        setIsPending(false);
    }

    return <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
            <Label htmlFor="profile-name">Ad soyad</Label>
            <Input id="profile-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </div>
        <div className="space-y-1.5">
            <Label htmlFor="profile-email">E-posta</Label>
            <Input id="profile-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {message && <p role="status" className="text-sm text-green-600">{message}</p>}
        <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>{isPending ? "Kaydediliyor..." : "Kaydet"}</Button>
        </div>
        </form>
        <div className="border-t border-pink-100 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Şifre değiştir</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5"><Label htmlFor="current-password">Mevcut şifre</Label><Input id="current-password" type="password" value={passwords.current} onChange={(event) => setPasswords({ ...passwords, current: event.target.value })} required /></div>
                <div className="space-y-1.5"><Label htmlFor="new-password">Yeni şifre</Label><Input id="new-password" type="password" minLength={8} value={passwords.next} onChange={(event) => setPasswords({ ...passwords, next: event.target.value })} required /></div>
                <div className="space-y-1.5"><Label htmlFor="confirm-password">Yeni şifre tekrar</Label><Input id="confirm-password" type="password" minLength={8} value={passwords.confirmation} onChange={(event) => setPasswords({ ...passwords, confirmation: event.target.value })} required /></div>
                {passwordError && <p role="alert" className="text-sm text-red-600">{passwordError}</p>}
                {passwordMessage && <p role="status" className="text-sm text-green-600">{passwordMessage}</p>}
                <div className="flex justify-end"><Button type="submit" disabled={isPending}>{isPending ? "Güncelleniyor..." : "Şifreyi güncelle"}</Button></div>
            </form>
        </div>
    </div>;
}
