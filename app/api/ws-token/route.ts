import { NextResponse } from "next/server";
import { auth } from "@/auth";
import jwt from "jsonwebtoken";

export async function GET() {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not defined");
  }

  const token = jwt.sign(
    {
      sub: session.user.id, // this becomes userId in the websocket
    },
    secret,
    { expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}
