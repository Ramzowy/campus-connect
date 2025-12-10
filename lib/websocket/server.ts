import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

interface ExtWebSocket extends WebSocket {
  userId?: string;
  groupIds?: Set<string>;
}

type IncomingMessage =
  | { type: "join"; groupId: string }
  | { type: "message"; groupId: string; content: string };

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  // groupId -> set of sockets
  const groups = new Map<string, Set<ExtWebSocket>>();

  function broadcastToGroup(
    groupId: string,
    payload: any,
    exclude?: ExtWebSocket
  ) {
    const sockets = groups.get(groupId);
    if (!sockets) return;

    const data = JSON.stringify(payload);
    for (const client of sockets) {
      if (client.readyState === WebSocket.OPEN && client !== exclude) {
        client.send(data);
      }
    }
  }

  wss.on("connection", (ws: ExtWebSocket, req) => {
    try {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close(10008, "Auth token required");
        return;
      }

      const decoded = jwt.verify(token, process.env.AUTH_SECRET!);
      const userId = (decoded as any).sub as string | undefined;

      if (!userId) {
        ws.close(1008, "Invalid token");
        return;
      }

      ws.userId = userId;
      ws.groupIds = new Set();

      ws.on("message", async (raw) => {
        let msg: IncomingMessage;

        try {
          msg = JSON.parse(raw.toString());
        } catch {
          console.error("Invalid JSON from client");
          return;
        }

        if (!ws.userId) return;

        // JOIN GROUP
        if (msg.type === "join") {
          const groupId = msg.groupId;

          ws.groupIds!.add(groupId);

          if (!groups.has(groupId)) {
            groups.set(groupId, new Set());
          }

          groups.get(groupId)!.add(ws);

          broadcastToGroup(groupId, {
            type: "system",
            groupId,
            text: `User ${ws.userId} joined`,
            timeStamp: Date.now(),
          });
        }

        // SEND MESSAGE
        if (msg.type === "message") {
          const { groupId, content } = msg;

          if (!content.trim()) return;
          if (!ws.groupIds?.has(groupId)) return; // must have joined first

          // Save to DB
          const saved = await prisma.message.create({
            data: {
              content: content.trim(),
              authorId: ws.userId,
              groupId,
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

          // Broadcast to group
          broadcastToGroup(groupId, {
            type: "message",
            id: saved.id,
            content: saved.content,
            groupId: saved.groupId,
            createdAt: saved.createdAt,
            author: saved.author,
          });
        }
      });

      ws.on("close", (err) => {
        console.error("WebSocket error:", err);
      });
    } catch (err) {
      console.error("WebSocket connection error", err);
      ws.close(1011, "Unexpected error");
    }
  });

  console.log("WebSocket server running on /api/ws");
  return wss;
}
