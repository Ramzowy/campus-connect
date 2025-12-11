"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  description?: string | null;
  memberCount: number;
}

interface GroupsListProps {
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
}

export default function GroupsList({
  selectedGroupId,
  onSelectGroup,
}: GroupsListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/groups", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to load groups", res.status);
          return;
        }

        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups", error);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

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
        {filteredGroups.map((group) => {
          const isActive = selectedGroupId === group.id;

          return (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className={cn(
                "flex w-full items-center justify-between border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50",
                isActive && "bg-muted"
              )}
            >
              <div className="flex-1">
                <h3
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {group.name}
                </h3>
                {group.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {group.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3" />
                <span>{group.memberCount}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
