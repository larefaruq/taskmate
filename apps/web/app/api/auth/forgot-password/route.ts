import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { prisma } from "@/app/lib/prisma";
import { sendToN8N } from "@/app/lib/n8n";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    // Selalu balikin response yang sama
    // supaya email tidak bisa dipakai untuk enumerasi account.
    const genericResponse = NextResponse.json(
      {
        message:
          "Kalau email terdaftar, OTP akan dikirim.",
      },
      { status: 200 }
    );

    if (!email) {
      return genericResponse;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return genericResponse;
    }

    const otp = String(
      crypto.randomInt(100000, 1000000)
    );

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    await prisma.passwordResetToken.deleteMany({
      where: {
        email,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        email,
        otpHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      },
    });

    await sendToN8N({
      type: "PASSWORD_RESET",
      email: user.email,
      name: user.name,
      otp,
    });

    return genericResponse;
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);

    return NextResponse.json(
      {
        message: "Permintaan reset password gagal.",
      },
      { status: 500 }
    );
  }
}