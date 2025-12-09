"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

const groups: Group[] = [
  { id: "1", name: "Students from India", memberCount: 234 },
  { id: "2", name: "Computer Science Majors", memberCount: 567 },
  { id: "3", name: "Soccer Club", memberCount: 89 },
];

export default function GroupsList() {
  const [activeGroupId, setActiveGroupId] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      {/* Search Bar */}
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto">
        {filteredGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroupId(group.id)}
            className={cn(
              "flex w-full items-center justify-between border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50",
              activeGroupId === group.id && "bg-muted"
            )}
          >
            <div className="flex-1">
              <h3
                className={cn(
                  "text-sm font-medium",
                  activeGroupId === group.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {group.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3" />
              <span>{group.memberCount}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
