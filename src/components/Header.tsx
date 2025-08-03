"use client";
import {
  Bell,
  Search,
  ShoppingCart,
  Command,
  Clock,
  TrendingUp,
  Star,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const iconProps = {
    size: 24,
    className:
      "text-gray-400 hover:text-gray-200 transition-colors duration-200",
  };

  const badgeProps = {
    asChild: true,
    className:
      "bg-black/50 rounded-full size-10 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors",
  };

  // Sample search suggestions and recent searches
  const recentSearches = ["Call of Duty", "FIFA 24", "Minecraft"];
  const popularGames = [
    "Cyberpunk 2077",
    "The Witcher 3",
    "GTA V",
    "Red Dead Redemption 2",
  ];

  return (
    <header className="py-4 md:py-6 px-4 max-w-7xl mx-auto">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Top row: Greeting and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="size-12">
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="object-fit"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  {...badgeProps}
                  aria-label="Shopping cart"
                  className="bg-black/50 rounded-full size-9 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                >
                  <ShoppingCart
                    size={20}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  />
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white">
                <p>Cart</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  {...badgeProps}
                  aria-label="Notifications"
                  className="bg-black/50 rounded-full size-9 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                >
                  <Bell
                    size={20}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  />
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Search Section - Full width on mobile */}
        <div className="w-full" onClick={() => setIsSearchOpen(true)}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full pl-10 pr-16 py-3 bg-black/50 text-white placeholder-gray-400 rounded-full focus:outline-none cursor-pointer"
              aria-label="Search"
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <kbd className="hidden sm:flex px-2 py-1 text-xs text-gray-400 bg-gray-700/50 rounded border border-gray-600 items-center">
                <Command className="inline w-3 h-3 mr-1" />+K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        {/* Greeting Section */}
        <div className="size-12">
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="object-fit"
          />
        </div>

        {/* Search Section */}
        <div
          className="flex-1 max-w-md mx-8 flex items-center justify-between"
          onClick={() => setIsSearchOpen(true)}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full pl-10 pr-20 py-2 bg-black/50 text-white placeholder-gray-400 rounded-full focus:outline-none cursor-pointer"
              aria-label="Search"
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-700/50 rounded border border-gray-600">
                <Command className="inline w-3 h-3 mr-1" />K
              </kbd>
            </div>
          </div>

          {/* Actions Section - Desktop */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger>
                <Badge {...badgeProps} aria-label="Shopping cart">
                  <ShoppingCart {...iconProps} />
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white">
                <p>Cart</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Badge {...badgeProps} aria-label="Notifications">
                  <Bell {...iconProps} />
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* Shared Dialog Content for both Mobile and Desktop */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-gradient-to-tr from-red-600/50 via-[var(--color-maroon)] to-[var(--color-maroon)] backdrop-blur-sm  rounded-xl p-0 overflow-hidden ">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Games
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-4 ">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for games, genres, or publishers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 text-white  placeholder-gray-400 rounded-full border border-gray-700 focus:outline-none"
                aria-label="Search"
                autoFocus
              />
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="px-6 pb-6">
              {searchQuery === "" ? (
                <div className="space-y-6">
                  {/* Recent Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-300">
                        Recent Searches
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                          onClick={() => handleSearch(search)}
                        >
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300">{search}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Popular Games */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-300">
                        Popular Games
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {popularGames.map((game, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                          onClick={() => handleSearch(game)}
                        >
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-300">{game}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/trending');
                        }}
                      >
                        <div className="text-sm font-medium text-white">
                          Trending Games
                        </div>
                        <div className="text-xs text-gray-400">
                          Most popular right now
                        </div>
                      </div>
                      <div 
                        className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/top-rated');
                        }}
                      >
                        <div className="text-sm font-medium text-white">
                          Top Rated Games
                        </div>
                        <div className="text-xs text-gray-400">
                          Highest rated games
                        </div>
                      </div>
                      <div 
                        className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/tags');
                        }}
                      >
                        <div className="text-sm font-medium text-white">
                          Browse by Tags
                        </div>
                        <div className="text-xs text-gray-400">
                          Discover by themes
                        </div>
                      </div>
                      <div 
                        className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/latest');
                        }}
                      >
                        <div className="text-sm font-medium text-white">
                          Browse All Games
                        </div>
                        <div className="text-xs text-gray-400">
                          View complete catalog
                        </div>
                      </div>
                      <div 
                        className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/news');
                        }}
                      >
                        <div className="text-sm font-medium text-white">
                          Gaming News
                        </div>
                        <div className="text-xs text-gray-400">
                          Latest gaming news
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400 mb-3">
                    {`Search results for "${searchQuery}"`}
                  </div>
                  {/* Search results would go here */}
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Start typing to search for games...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with keyboard shortcuts */}
            <div className="px-6 py-3 bg-gray-800/30 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                      ↵
                    </kbd>
                    to select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                      ↑↓
                    </kbd>
                    to navigate
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                    esc
                  </kbd>
                  to close
                </span>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
