"use client";

import MessageInput from "./message-input";

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

const sampleMessages: Message[] = [
  {
    id: 1,
    sender: "Sarah Johnson",
    text: "Hey everyone! Has anyone figured out the final project requirements yet?",
    timestamp: "10:30 AM",
    isSent: false,
  },
  {
    id: 2,
    sender: "You",
    text: "I think we need to submit it by next Friday. Let me check the syllabus.",
    timestamp: "10:32 AM",
    isSent: true,
  },
  {
    id: 3,
    sender: "Mike Chen",
    text: "Yeah, it's due Friday at 11:59 PM. We should probably start forming groups soon.",
    timestamp: "10:35 AM",
    isSent: false,
  },
  {
    id: 4,
    sender: "You",
    text: "Good idea! I'm free tomorrow afternoon if anyone wants to meet up and discuss.",
    timestamp: "10:37 AM",
    isSent: true,
  },
];

export default function ChatArea() {
  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {sampleMessages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.isSent ? "items-end" : "items-start"
              }`}
            >
              {/* Sender Name */}
              <span className="mb-1 px-1 text-xs text-muted-foreground">
                {message.sender}
              </span>

              {/* Message Bubble */}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.isSent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>

              {/* Timestamp */}
              <span className="mt-1 px-1 text-xs text-muted-foreground">
                {message.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input at Bottom */}
      <MessageInput />
    </div>
  );
}
