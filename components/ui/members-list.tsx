"use client";

import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  isOnline: boolean;
}

const members: Member[] = [
  {
    id: "1",
    name: "Priya Sharma",
    country: "India",
    countryFlag: "🇮🇳",
    isOnline: true,
  },
  {
    id: "2",
    name: "John Smith",
    country: "USA",
    countryFlag: "🇺🇸",
    isOnline: true,
  },
  {
    id: "3",
    name: "Maria Garcia",
    country: "Spain",
    countryFlag: "🇪🇸",
    isOnline: false,
  },
  {
    id: "4",
    name: "Yuki Tanaka",
    country: "Japan",
    countryFlag: "🇯🇵",
    isOnline: true,
  },
];

export default function MembersList() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="font-semibold text-foreground">Members</h2>
        <p className="text-xs text-muted-foreground">{members.length} online</p>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50"
          >
            {/* Profile Picture Placeholder */}
            <div className="relative">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {member.name.charAt(0)}
              </div>
              {/* Online Status Dot */}
              <div
                className={cn(
                  "absolute bottom-0 right-0 size-3 rounded-full border-2 border-card",
                  member.isOnline ? "bg-green-500" : "bg-gray-400"
                )}
              />
            </div>

            {/* Name and Country */}
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {member.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{member.countryFlag}</span>
                <span>{member.country}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
