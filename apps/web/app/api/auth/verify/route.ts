import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import crypto from "node:crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token verifikasi tidak ditemukan." },
        { status: 400 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const verificationToken =
      await prisma.emailVerificationToken.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!verificationToken) {
      return NextResponse.json(
        { message: "Token verifikasi tidak valid." },
        { status: 400 }
      );
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: {
          id: verificationToken.id,
        },
      });

      return NextResponse.json(
        { message: "Token verifikasi sudah kedaluwarsa." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    if (!user.emailVerified) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: true,
        },
      });
    }

    await prisma.emailVerificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email berhasil diverifikasi.",
    });
  } catch (error) {
    console.error("VERIFY_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Verifikasi email gagal.",
      },
      { status: 500 }
    );
  }
}