import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  // 1) Make sure the user is logged in

  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId } = params;

  // 2) Make sure user belongs to this group

  const membership = await prisma.userGroup.findFirst({
    where: { userId: session.user.id, groupId },
  });

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3) Fetch messages from  DB

  const messages = await prisma.message.findMany({
    where: { groupId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });

  // 4) Return as JSON
  return NextResponse.json(messages);
}
