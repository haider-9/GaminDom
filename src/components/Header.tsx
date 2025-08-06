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
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Header = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  interface GameResult {
    id: string | number;
    name: string;
    background_image?: string;
    released?: string;
  }
  const [searchResults, setSearchResults] = useState<GameResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounced realtime search
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const { gameApi } = await import("@/lib/api-client");
        interface SearchGamesResponse {
          results: GameResult[];
        }
        const res = (await gameApi.searchGames(
          searchQuery,
          "1",
          "10"
        )) as SearchGamesResponse;
        setSearchResults(res.results || []);
        setSearchLoading(false);
      } catch {
        setSearchError("Failed to fetch games");
        setSearchLoading(false);
      }
    }, 700);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
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
      "bg-surface rounded-full size-10 flex items-center justify-center cursor-pointer hover:bg-surface-hover transition-colors",
  };

  // Recent searches state (persisted in localStorage)
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 8);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };
  const popularGames = [
    "Cyberpunk 2077",
    "The Witcher 3",
    "GTA V",
    "Red Dead Redemption 2",
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-4 md:py-6 px-4 max-w-7xl mx-auto"
    >
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Top row: Greeting and Actions */}
        <div className="flex items-center justify-between mb-4">
          <Link className="size-12" href="/">
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  {...badgeProps}
                  aria-label="Shopping cart"
                  className="bg-surface rounded-full size-9 flex items-center justify-center cursor-pointer hover:bg-surface-hover transition-colors"
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
                  className="bg-surface rounded-full size-9 flex items-center justify-center cursor-pointer hover:bg-surface-hover transition-colors"
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
              className="w-full pl-10 pr-16 py-3 bg-surface text-primary placeholder-gray-400 rounded-full focus:outline-none cursor-pointer"
              aria-label="Search"
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <kbd className="hidden sm:flex px-2 py-1  text-xs text-black dark:text-gray-700 bg-gray-700/50 rounded border border-gray-600 items-center">
                <Command className="inline w-3 h-3 mr-1" />
                +K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        {/* Greeting Section */}
        <Link href="/" className="size-12">
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="object-fit"
          />
        </Link>

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
              className="w-full pl-10 pr-20 py-2 bg-surface text-primary placeholder-gray-400 rounded-full focus:outline-none cursor-pointer"
              aria-label="Search"
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs text-black dark:text-gray-400 bg-gray-700/50 rounded border border-gray-600">
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
        <DialogContent className="max-w-2xl mx-auto bg-surface backdrop-blur-sm rounded-xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-primary flex items-center gap-2">
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
                className="w-full pl-12 pr-4 py-3 bg-surface text-primary placeholder-gray-400 rounded-full border border-primary focus:outline-none"
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
                      <Clock className="w-4 h-4 text-muted" />
                      <h3 className="text-sm font-medium text-secondary">
                        Recent Searches
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.length === 0 ? (
                        <div className="text-muted text-xs px-2 py-1">
                          No recent searches.
                        </div>
                      ) : (
                        recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                            onClick={() => handleSearch(search)}
                          >
                            <Clock className="w-4 h-4 text-muted" />
                            <span className="text-secondary truncate max-w-[180px] overflow-hidden whitespace-nowrap">
                              {search}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <Separator className="bg-border-primary" />

                  {/* Popular Games */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-muted" />
                      <h3 className="text-sm font-medium text-secondary">
                        Popular Games
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {popularGames.map((game, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                          onClick={() => handleSearch(game)}
                        >
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-secondary">{game}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-border-primary" />

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-sm font-medium text-secondary mb-3">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="p-3 rounded-lg bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push("/trending");
                        }}
                      >
                        <div className="text-sm font-medium text-primary">
                          Trending Games
                        </div>
                        <div className="text-xs text-muted">
                          Most popular right now
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-lg bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push("/top-rated");
                        }}
                      >
                        <div className="text-sm font-medium text-primary">
                          Top Rated Games
                        </div>
                        <div className="text-xs text-muted">
                          Highest rated games
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-lg bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push("/tags");
                        }}
                      >
                        <div className="text-sm font-medium text-primary">
                          Browse by Tags
                        </div>
                        <div className="text-xs text-muted">
                          Discover by themes
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-lg bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push("/latest");
                        }}
                      >
                        <div className="text-sm font-medium text-primary">
                          Browse All Games
                        </div>
                        <div className="text-xs text-muted">
                          View complete catalog
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-lg bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push("/news");
                        }}
                      >
                        <div className="text-sm font-medium text-primary">
                          Gaming News
                        </div>
                        <div className="text-xs text-muted">
                          Latest gaming news
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-muted mb-3">
                    {`Search results for "${searchQuery}"`}
                  </div>
                  {searchLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <span className="relative flex h-10 w-10 mb-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-10 w-10 bg-primary"></span>
                      </span>
                      <p className="text-muted">Searching games...</p>
                    </div>
                  ) : searchError ? (
                    <div className="text-center py-8 text-red-500">
                      <p>{searchError}</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((game) => (
                        <div
                          key={game.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                          onClick={() => handleSearch(game.name)}
                        >
                          <Image
                            src={
                              game.background_image || "/placeholder-game.jpg"
                            }
                            alt={game.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover w-10 h-10"
                          />
                          <span className="text-primary font-medium truncate">
                            {game.name}
                          </span>
                          {game.released && (
                            <span className="text-xs text-secondary ml-auto">
                              {game.released.slice(0, 4)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No games found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
};

export default Header;
