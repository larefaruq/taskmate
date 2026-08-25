import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/hash";
import { sendToN8N } from "@/app/lib/n8n";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    // =========================
    // VALIDASI INPUT
    // =========================
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Nama, email, dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password minimal 8 karakter.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CEK EMAIL
    // =========================
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan.",
        },
        { status: 409 }
      );
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const hashedPassword = await hashPassword(password);

    // =========================
    // BUAT USER
    // =========================
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        emailVerified: false,
      },
    });

    // =========================
    // GENERATE VERIFICATION TOKEN
    // =========================
    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Hapus token lama untuk email yang sama
    await prisma.emailVerificationToken.deleteMany({
      where: {
        email,
      },
    });

    // Simpan hash token, bukan token asli
    await prisma.emailVerificationToken.create({
      data: {
        email,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 menit
      },
    });

    // =========================
    // BUAT VERIFICATION URL
    // =========================
    const origin =
      process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const verificationUrl =
      `${origin}/auth/verify?token=${rawToken}`;

    // =========================
    // KIRIM KE N8N
    // =========================
    await sendToN8N({
      type: "REGISTER_VERIFY",
      email: user.email,
      name: user.name ?? "TaskMate User",
      verificationUrl,
    });

    // =========================
    // RESPONSE SUCCESS
    // =========================
    return NextResponse.json(
      {
        message:
          "Registrasi berhasil. Silakan cek email untuk verifikasi akun.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        message: "Registrasi gagal. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}