"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyPage() {
  const [status, setStatus] = useState("Memverifikasi akun...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verify() {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        setStatus("Token verifikasi tidak ditemukan.");
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/verify?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        setStatus(data.message ?? "Verifikasi selesai.");
        setSuccess(response.ok);
      } catch (error) {
        console.error(error);
        setStatus("Terjadi kesalahan saat melakukan verifikasi.");
      }
    }

    verify();
  }, []);

  return (
    <main className="min-h-screen bg-[#080a12] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg border border-[#25283a] bg-[#0d111b] p-10 text-center shadow-2xl">
        <div className="text-xs tracking-[0.35em] font-bold text-violet-400 mb-4">
          TASKMATE
        </div>

        <h1 className="text-3xl font-black mb-4">
          {success ? "EMAIL VERIFIED" : "EMAIL VERIFICATION"}
        </h1>

        <p className="text-zinc-400 leading-7 mb-8">
          {status}
        </p>

        <Link
          href="/?auth=login"
          className="inline-block bg-violet-500 hover:bg-violet-400 transition px-6 py-3 font-bold"
        >
          GO TO LOGIN →
        </Link>
      </div>
    </main>
  );
}