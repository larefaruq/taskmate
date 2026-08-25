"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Registrasi gagal.");
      setLoading(false);
      return;
    }
    router.push("/login");
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f7fb", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", padding: 40, borderRadius: 20, boxShadow: "0 10px 40px rgba(0,0,0,.08)" }}>
        <h1 style={{ margin: 0, textAlign: "center", fontSize: 32 }}>TaskMate</h1>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 30 }}>Buat akun pengguna</p>
        {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 12, borderRadius: 10, marginBottom: 18 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 14 }}>Nama<input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: 13, marginTop: 6, boxSizing: "border-box" }} /></label>
          <label style={{ display: "block", marginBottom: 14 }}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 13, marginTop: 6, boxSizing: "border-box" }} /></label>
          <label style={{ display: "block", marginBottom: 22 }}>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required style={{ width: "100%", padding: 13, marginTop: 6, boxSizing: "border-box" }} /></label>
          <button disabled={loading} style={{ width: "100%", padding: 14, border: 0, borderRadius: 10, background: "#111827", color: "white", fontWeight: 700 }}>{loading ? "Mendaftarkan..." : "Register"}</button>
        </form>
      </div>
    </main>
  );
}
