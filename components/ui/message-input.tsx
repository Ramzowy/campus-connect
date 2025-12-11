"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "./button";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;

    onSend(text);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex items-end gap-2">
        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={disabled ? "Connecting to chat.." : "Type your message"}
          className="min-h-[40px] max-h-[120px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          rows={1}
          disabled={disabled}
          style={{
            height: "auto",
            overflowY: message.split("\n").length > 3 ? "auto" : "hidden",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        {/* Send Button */}
        <Button
          onClick={handleSend}
          size="icon"
          className="shrink-0"
          disabled={disabled || !message.trim()}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
