"use client";

import MessageInput from "./message-input";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface ChatAreaProps {
  groupId: string;
}

export default function ChatArea({ groupId }: ChatAreaProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id as string | undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // 1) Load existing messages from REST API

  useEffect(() => {
    if (!groupId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/groups/${groupId}/messages`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to load messages");
          return;
        }

        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [groupId]);

  // 2) Set up WebSocket connection
  useEffect(() => {
    if (!groupId || !currentUserId) return;

    let cancelled = false;

    const connect = async () => {
      try {
        // Get JWT token for WS auth
        const res = await fetch("/api/ws-token");
        if (!res.ok) {
          console.error("Failed to get WS token");
          return;
        }

        const { token } = await res.json();
        if (cancelled) return;

        const protocol = window.location.protocol === "https:" ? "wss" : "ws";

        // standalone WS server on port 4000
        const ws = new WebSocket(
          `${protocol}://${
            window.location.hostname
          }:4000?token=${encodeURIComponent(token)}`
        );

        wsRef.current = ws;

        ws.onopen = () => {
          setWsReady(true);

          // tell server which group we're joining

          ws.send(
            JSON.stringify({
              type: "Join",
              groupId,
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === "message") {
              // Message shape matches what WS server broadcasts
              setMessages((prev) => [...prev, msg]);
            } else if (msg.type === "system") {
              // Optionally: handle system messages (user join/leave)
              console.log("system:", msg.text);
            }
          } catch (error) {
            console.error("Error parsing WS message:", error);
          }
        };

        ws.onclose = () => {
          console.log("WebSocket closed");
          wsRef.current = null;
          setWsReady(false);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
      }
    };

    connect();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      wsRef.current = null;
      setWsReady(false);
    };
  }, [groupId, currentUserId]);

  // 3) Send message over WebSocket
  const handleSend = (text: string) => {
    const socket = wsRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected");
      return;
    }

    socket.send(
      JSON.stringify({
        type: "message",
        groupId,
        content: text,
      })
    );

    // We DO NOT manually push into messages here.
    // Server will save to DB and broadcast back,
    // then onmessage will append it for all users.
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="mb-2 text-xs text-muted-foreground">
            Loading messages...
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-xs text-muted-foreground">
            No messages yet. Say hi
          </div>
        )}

        <div className="mt-2 flex flex-col gap-4">
          {messages.map((message) => {
            const isSent = message.author.id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex flex-col ${
                  isSent ? "items-end" : "items-start"
                }`}
              >
                {/* Sender Name */}
                <span className="mb-1 px-1 text-xs text-muted-foreground">
                  {isSent ? "You" : message.author.name}
                </span>

                {/* Message Bubble */}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isSent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {/* Timestamp */}
                <span className="mt-1 px-1 text-xs text-muted-foreground">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input at Bottom */}
      <MessageInput onSend={handleSend} disabled={!wsReady} />
    </div>
  );
}
