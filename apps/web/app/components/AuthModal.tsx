"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "register" | "forgot" | "otp" | "reset";

type NoticeType = "info" | "success" | "error";

export default function AuthModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = searchParams.get("auth");

  const initialMode: Mode | null =
    auth === "register" ? "register" : auth === "login" ? "login" : null;

  const [mode, setMode] = useState<Mode | null>(initialMode);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [noticeType, setNoticeType] = useState<NoticeType>("info");

  useEffect(() => {
    if (auth === "login" || auth === "register") {
      setMode(auth);
      return;
    }

    setMode(null);
  }, [auth]);

  useEffect(() => {
    if (!mode) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, loading]);

  function setNotice(text: string, type: NoticeType = "info") {
    setMessage(text);
    setNoticeType(type);
  }

  function clearNotice() {
    setMessage("");
    setNoticeType("info");
  }

  function resetSensitiveState() {
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setResetToken("");
  }

  function close() {
    if (loading) return;

    setMode(null);
    clearNotice();
    resetSensitiveState();

    router.replace("/", {
      scroll: false,
    });
  }

  function switchMode(nextMode: Mode) {
    if (loading) return;

    clearNotice();
    setMode(nextMode);

    if (nextMode === "login" || nextMode === "register" || nextMode === "forgot") {
      router.replace(`/?auth=${nextMode}`, {
        scroll: false,
      });
    }
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    clearNotice();

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setNotice(
          "Login gagal. Pastikan email, password, dan verifikasi akun benar.",
          "error",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("LOGIN_ERROR:", error);
      setNotice("Terjadi kesalahan saat login. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    clearNotice();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setNotice("Nama wajib diisi.", "error");
      setLoading(false);
      return;
    }

    if (!cleanEmail) {
      setNotice("Email wajib diisi.", "error");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setNotice("Password minimal 8 karakter.", "error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setNotice("Konfirmasi password tidak sama.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setNotice(data.message ?? "Register gagal.", "error");
        return;
      }

      setEmail(cleanEmail);
      setPassword("");
      setConfirmPassword("");

      setNotice(
        data.message ??
          "Account berhasil dibuat. Cek email kamu untuk link verifikasi.",
        "success",
      );
    } catch (error) {
      console.error("REGISTER_ERROR:", error);
      setNotice("Terjadi kesalahan saat register. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function submitForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    clearNotice();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setNotice("Masukkan email terlebih dahulu.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setNotice(data.message ?? "Permintaan reset password gagal.", "error");
        return;
      }

      setEmail(cleanEmail);
      setNotice(
        data.message ??
          "Kalau email terdaftar, OTP akan dikirim.",
        "success",
      );
      setMode("otp");
    } catch (error) {
      console.error("FORGOT_PASSWORD_ERROR:", error);
      setNotice("Terjadi kesalahan. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    clearNotice();

    const cleanOtp = otp.trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      setNotice("OTP harus terdiri dari 6 angka.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: cleanOtp,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setNotice(data.message ?? "OTP salah atau sudah kadaluarsa.", "error");
        return;
      }

      setResetToken(data.resetToken ?? "");
      setMode("reset");
      setNotice("OTP valid. Buat password baru kamu.", "success");
    } catch (error) {
      console.error("VERIFY_OTP_ERROR:", error);
      setNotice("Terjadi kesalahan saat memverifikasi OTP.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    clearNotice();

    if (password.length < 8) {
      setNotice("Password minimal 8 karakter.", "error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setNotice("Konfirmasi password tidak sama.", "error");
      setLoading(false);
      return;
    }

    if (!resetToken) {
      setNotice("Reset token tidak ditemukan. Ulangi proses OTP.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          resetToken,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setNotice(data.message ?? "Reset password gagal.", "error");
        return;
      }

      resetSensitiveState();
      setMode("login");
      setNotice(
        data.message ?? "Password berhasil diubah. Silakan login.",
        "success",
      );

      router.replace("/?auth=login", {
        scroll: false,
      });
    } catch (error) {
      console.error("RESET_PASSWORD_ERROR:", error);
      setNotice("Terjadi kesalahan saat reset password.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!mode) {
    return null;
  }

  const titleMap: Record<Mode, string> = {
    login: "WELCOME BACK",
    register: "CREATE YOUR ACCOUNT",
    forgot: "RESET QUEST KEY",
    otp: "VERIFY OTP",
    reset: "SET NEW PASSWORD",
  };

  const descriptionMap: Record<Mode, string> = {
    login: "Enter your account to continue your quest.",
    register: "Create your TaskMate account and start a quest.",
    forgot: "We'll send a verification code to your email.",
    otp: "Enter the 6-digit code sent to your email.",
    reset: "Choose a new password for your account.",
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          close();
        }
      }}
      role="presentation"
    >
      <div
        key={mode}
        className="modal-panel relative w-full max-w-md overflow-hidden border border-violet-400/20 bg-[#0d111b] shadow-[10px_10px_0_rgba(124,58,237,.12)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="taskmate-auth-title"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

        <button
          type="button"
          onClick={close}
          disabled={loading}
          aria-label="Close authentication dialog"
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center border border-white/5 text-xl text-white/30 transition-all duration-200 hover:rotate-90 hover:border-white/10 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          ×
        </button>

        <div className="relative border-b border-white/8 p-7">
          <div className="text-[10px] font-bold tracking-[0.25em] text-violet-300">
            TASKMATE
          </div>

          <h2
            id="taskmate-auth-title"
            className="mt-2 text-2xl font-black tracking-tight"
          >
            {titleMap[mode]}
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
            {descriptionMap[mode]}
          </p>
        </div>

        <div className="relative p-7">
          <div key={`content-${mode}`} className="auth-content">
            {message && (
              <div
                role="status"
                className={`mb-5 border p-3 text-sm leading-5 ${
                  noticeType === "success"
                    ? "border-emerald-300/15 bg-emerald-400/5 text-emerald-200"
                    : noticeType === "error"
                      ? "border-rose-300/15 bg-rose-400/5 text-rose-200"
                      : "border-violet-400/15 bg-violet-400/5 text-violet-200"
                }`}
              >
                {message}
              </div>
            )}

            {mode === "login" && (
              <form onSubmit={submitLogin} className="space-y-4">
                <Input
                  label="EMAIL"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                />

                <Input
                  label="PASSWORD"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-violet-400 bg-violet-500 px-5 py-3.5 text-sm font-black transition duration-200 hover:-translate-y-0.5 hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "ENTERING..." : "ENTER QUEST →"}
                </button>

                <div className="flex items-center justify-between gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    disabled={loading}
                    className="text-cyan-300 transition hover:text-cyan-200 disabled:opacity-50"
                  >
                    Forgot password?
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    disabled={loading}
                    className="text-white/45 transition hover:text-white disabled:opacity-50"
                  >
                    Create account
                  </button>
                </div>
              </form>
            )}

            {mode === "register" && (
              <form onSubmit={submitRegister} className="space-y-4">
                <Input
                  label="NAME"
                  value={name}
                  onChange={setName}
                  placeholder="Your name"
                  autoComplete="name"
                  autoFocus
                />

                <Input
                  label="EMAIL"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                <Input
                  label="PASSWORD"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />

                <Input
                  label="CONFIRM PASSWORD"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-violet-400 bg-violet-500 px-5 py-3.5 text-sm font-black transition duration-200 hover:-translate-y-0.5 hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "CREATING..." : "CREATE ACCOUNT →"}
                </button>

                <div className="text-center text-xs text-white/40">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    disabled={loading}
                    className="font-bold text-violet-300 transition hover:text-violet-200 disabled:opacity-50"
                  >
                    Login
                  </button>
                </div>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={submitForgot} className="space-y-4">
                <Input
                  label="EMAIL"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-3.5 text-sm font-black text-cyan-200 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND OTP →"}
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  disabled={loading}
                  className="w-full text-center text-xs text-white/40 transition hover:text-white disabled:opacity-50"
                >
                  ← Back to login
                </button>
              </form>
            )}

            {mode === "otp" && (
              <form onSubmit={submitOtp} className="space-y-4">
                <div className="border border-white/8 bg-white/[0.02] p-4 text-xs leading-5 text-white/40">
                  OTP dikirim untuk <strong className="text-white/70">{email}</strong>.
                  Kode berlaku selama 5 menit.
                </div>

                <Input
                  label="6-DIGIT OTP"
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={6}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-3.5 text-sm font-black text-cyan-200 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "VERIFYING..." : "VERIFY OTP →"}
                </button>

                <div className="flex items-center justify-between text-xs text-white/40">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    disabled={loading}
                    className="transition hover:text-white disabled:opacity-50"
                  >
                    ← Change email
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    disabled={loading}
                    className="transition hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {mode === "reset" && (
              <form onSubmit={submitReset} className="space-y-4">
                <Input
                  label="NEW PASSWORD"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  autoFocus
                />

                <Input
                  label="CONFIRM PASSWORD"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-emerald-300/40 bg-emerald-400/10 px-5 py-3.5 text-sm font-black text-emerald-200 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "RESETTING..." : "RESET PASSWORD →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  autoFocus,
  inputMode,
  maxLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: "text" | "numeric" | "decimal" | "email" | "tel" | "url" | "search" | "none";
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold tracking-[0.18em] text-white/35">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        inputMode={inputMode}
        maxLength={maxLength}
        required
        className="w-full border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-white/15 focus:border-violet-400/50 focus:bg-white/[0.055]"
      />
    </div>
  );
}