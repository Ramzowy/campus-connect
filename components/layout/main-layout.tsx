import type React from "react";
import GroupsList from "@/components/ui/groups-list";
import ChatArea from "@/components/ui/chat-area";
import MembersList from "@/components/ui/members-list";
import Header from "@/components/ui/header";

export default function MainLayout() {
  return (
    <>
      {/* Mobile Layout - Stack vertically, hide sidebars by default */}
      <div className="flex h-screen flex-col bg-background md:hidden">
        <Header />

        {/* Mobile Tab Navigation */}
        <div className="flex border-b border-border bg-card">
          <button className="flex-1 border-r border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50">
            Groups
          </button>
          <button className="flex-1 border-r border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
            Chat
          </button>
          <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50">
            Members
          </button>
        </div>

        {/* Mobile Content - Show only chat by default */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatArea />
        </div>
      </div>

      {/* Desktop Layout - Three columns */}
      <div className="hidden flex-col h-screen bg-background md:flex">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Groups List */}
          <div className="w-64 border-r border-border bg-card lg:w-80">
            <GroupsList />
          </div>

          {/* Main Center Area - Chat */}
          <div className="flex flex-1 flex-col">
            <ChatArea />
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
