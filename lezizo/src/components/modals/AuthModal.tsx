import { X } from "lucide-react";
import { authClient } from "../../lib/auth-client";
export default function AuthModal({
  mode,
  onMode,
  onClose,
  error,
  onError,
}: {
  mode: "signIn" | "signUp";
  onMode: () => void;
  onClose: () => void;
  error: string;
  onError: (v: string) => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        <span className="eyebrow">Lezizo topluluğu</span>
        <h2>{mode === "signUp" ? "Mutfağına katıl" : "Tekrar hoş geldin"}</h2>
        <p>
          {mode === "signUp"
            ? "Favorilerini ve menünü hesabında sakla."
            : "Tariflerine kaldığın yerden devam et."}
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            onError("");
            const f = new FormData(e.currentTarget);
            const result =
              mode === "signUp"
                ? await authClient.signUp.email({
                    name: String(f.get("name")),
                    email: String(f.get("email")),
                    password: String(f.get("password")),
                  })
                : await authClient.signIn.email({
                    email: String(f.get("email")),
                    password: String(f.get("password")),
                  });
            if (result.error)
              onError(result.error.message ?? "İşlem tamamlanamadı.");
            else onClose();
          }}
        >
          {mode === "signUp" && (
            <label>
              Ad soyad
              <input name="name" required placeholder="Ayşe Yılmaz" />
            </label>
          )}
          <label>
            E-posta
            <input
              name="email"
              type="email"
              required
              placeholder="sen@example.com"
            />
          </label>
          <label>
            Şifre
            <input
              name="password"
              type="password"
              minLength={8}
              required
              placeholder="En az 8 karakter"
            />
          </label>
          {error && <span className="auth-error">{error}</span>}
          <button className="primary-button" type="submit">
            {mode === "signUp" ? "Kayıt ol" : "Giriş yap"}
          </button>
        </form>
        <button className="auth-switch" onClick={onMode}>
          {mode === "signUp"
            ? "Zaten hesabın var mı? Giriş yap"
            : "Hesabın yok mu? Kayıt ol"}
        </button>
      </div>
    </div>
  );
}
