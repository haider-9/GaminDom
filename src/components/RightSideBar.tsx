"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Users2, MessageCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { friendsList, recentMessages } from "@/constants";

const RightSideBar = () => {
  return (
    <>
      {/* Desktop Version - Only visible on lg+ screens */}
      <div className="hidden lg:flex absolute right-0 top-7 mr-5 flex-col gap-4">
        {/* Friends section - 70% height */}
        <div className="h-[60vh] bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-20 shadow-xl">
          {/* Profile section - Fixed at top */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <Avatar className="size-10 border-2 border-white/20">
              <AvatarImage src="https://github.com/haider-9.png" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <Separator className="bg-white/30 rounded-full p-[1px]" />
          </div>

          {/* Scrollable Friends section */}
          <ScrollArea className="h-[calc(100%-80px)]">
            <div className="flex flex-col items-center gap-4">
              <Users2 className="text-white" />
              {friendsList.map((friend) => (
                <Avatar key={friend.id} className="size-10 border-2 border-white/10 hover:border-white/30 transition-colors cursor-pointer">
                  <AvatarImage src={friend.image} />
                  <AvatarFallback>{friend.Name}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Messages section - 30% height */}
        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl h-[40vh] p-4 w-20 shadow-xl">
          {/* Message icon - Fixed at top */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <MessageCircle className="text-white" />
          </div>

          {/* Scrollable Messages section */}
          <ScrollArea className="h-[calc(100%-50px)]">
            <div className="flex flex-col items-center gap-4">
              {recentMessages.map((message) => (
                <Avatar key={message.id} className="size-10 border-2 border-white/10 hover:border-white/30 transition-colors cursor-pointer">
                  <AvatarImage src={message.image} />
                  <AvatarFallback>{message.Name}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default RightSideBar;