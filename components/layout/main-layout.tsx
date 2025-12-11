"use client";

import { useState } from "react";
import type React from "react";
import GroupsList from "@/components/ui/groups-list";
import ChatArea from "@/components/ui/chat-area";
import MembersList from "@/components/ui/members-list";
import Header from "@/components/ui/header";

export default function MainLayout() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  return (
    <>
      <div className="hidden flex-col h-screen bg-background md:flex">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Groups List */}
          <div className="w-64 border-r border-border bg-card lg:w-80">
            <GroupsList
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
            />
          </div>

          {/* Main Center Area - Chat */}
          <div className="flex flex-1 flex-col">
            {selectedGroupId ? (
              <ChatArea groupId={selectedGroupId} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Select a group to start chatting
              </div>
            )}
          </div>

          {/* Right Sidebar - Members List */}
          <div className="w-64 border-l border-border bg-card lg:w-80">
            <MembersList />
          </div>
        </div>
      </div>
    </>
  );
}
