import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const otp = String(body.otp ?? "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP tidak valid." },
        { status: 400 }
      );
    }

    const record = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: "OTP tidak ditemukan." },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "OTP sudah kadaluarsa." },
        { status: 400 }
      );
    }

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (otpHash !== record.otpHash) {
      return NextResponse.json(
        { message: "OTP salah." },
        { status: 400 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { resetHash },
    });

    return NextResponse.json({
      message: "OTP valid.",
      resetToken,
    });
  } catch (error) {
    console.error("VERIFY_OTP_ERROR:", error);

    return NextResponse.json(
      {
        message: "Verifikasi OTP gagal.",
      },
      { status: 500 }
    );
  }
}
