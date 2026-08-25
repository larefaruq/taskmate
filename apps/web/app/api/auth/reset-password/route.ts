import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/hash";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const resetToken = String(body.resetToken ?? "").trim();

    if (!email || !resetToken || !password || password.length < 8) {
      return NextResponse.json(
        { message: "Data reset password tidak valid." },
        { status: 400 }
      );
    }

    const record = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        usedAt: null,
        resetHash: { not: null },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Token reset tidak valid." },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Token reset sudah kadaluarsa." },
        { status: 400 }
      );
    }

    const incomingResetHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    if (incomingResetHash !== record.resetHash) {
      return NextResponse.json(
        { message: "Token reset tidak valid." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.update({
        where: { id: record.id },
        data: {
          usedAt: new Date(),
          resetHash: null,
        },
      });
    });

    return NextResponse.json({
      message: "Password berhasil diubah.",
    });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);

    return NextResponse.json(
      {
        message: "Reset password gagal.",
      },
      { status: 500 }
    );
  }
}