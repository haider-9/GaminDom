"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Calendar,
  Users,
  Clock,
  Heart,
  Share2,
  ArrowLeft,
  Trophy,
  Gamepad2,
  Monitor,
  Smartphone,
  Globe,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { SiEpicgames, SiSteam, SiPlaystation, SiBox } from "react-icons/si";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SAMPLE_AVATARS } from "@/constants";
import Link from "next/link";

interface GameDetails {
  id: number;
  name: string;
  description_raw: string;
  background_image: string;
  background_image_additional: string;
  released: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number;
  playtime: number;
  achievements_count: number;
  added: number;
  genres: Array<{ id: number; name: string }>;
  platforms: Array<{
    platform: { id: number; name: string };
    requirements?: { minimum?: string; recommended?: string };
  }>;
  developers: Array<{ id: number; name: string }>;
  publishers: Array<{ id: number; name: string }>;
  esrb_rating?: { id: number; name: string };
  website: string;
  reddit_url: string;
  metacritic_url: string;
  tags: Array<{ id: number; name: string }>;
  screenshots?: Array<{ id: number; image: string }>;
}

const GamePage = () => {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [game, setGame] = useState<GameDetails | null>(null);
  const [screenshots, setScreenshots] = useState<
    Array<{ id: number; image: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        // Fetch game details
        const gameResponse = await fetch(`${apiUrl}/${gameId}?key=${apiKey}`);
        if (!gameResponse.ok) throw new Error("Failed to fetch game details");
        const gameData = await gameResponse.json();

        // Fetch screenshots
        const screenshotsResponse = await fetch(
          `${apiUrl}/${gameId}/screenshots?key=${apiKey}`
        );
        if (screenshotsResponse.ok) {
          const screenshotsData = await screenshotsResponse.json();
          setScreenshots(screenshotsData.results || []);
        }

        setGame(gameData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-black/50 rounded-3xl w-32 mb-6"></div>
            <div className="h-96 bg-black/50 rounded-3xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-black/50 rounded-3xl w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-black/50 rounded-3xl"></div>
                  <div className="h-4 bg-black/50 rounded-3xl w-5/6"></div>
                  <div className="h-4 bg-black/50 rounded-3xl w-4/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-black/50 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-black/50 rounded-3xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Game Not Found</h1>
          <p className="text-white/70 mb-6">
            {error || "The requested game could not be found."}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#bb3b3b] hover:bg-[#bb3b3b]/80 text-white px-6 py-3 rounded-3xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    if (name.includes("pc") || name.includes("windows"))
      return <Monitor size={16} />;
    if (
      name.includes("mobile") ||
      name.includes("android") ||
      name.includes("ios")
    )
      return <Smartphone size={16} />;
    return <Gamepad2 size={16} />;
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-black/50 rounded-3xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors">
              <Heart size={20} className="text-white" />
            </button>
            <button className="p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors">
              <Share2 size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Hero Card */}
        <div className="bg-black/50 rounded-3xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src={game.background_image || "/placeholder-game.jpg"}
              alt={game.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Game Image */}
              <div className="w-full lg:w-80 h-64 rounded-3xl overflow-hidden">
                <Image
                  src={game.background_image || "/placeholder-game.jpg"}
                  alt={game.name}
                  width={320}
                  height={256}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>

              {/* Game Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {game.name}
                </h1>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                
                  {game.metacritic >= 80 && (
                    <span className="bg-[#FDD161] text-black text-sm px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Flame size={14} />
                      Popular
                    </span>
                  )}

                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                    <Star
                      className="text-yellow-400 fill-yellow-400"
                      size={16}
                    />
                    <span className="text-white font-semibold">
                      {game.rating}/5
                    </span>
                    <span className="text-white/70">
                      ({game.ratings_count.toLocaleString()})
                    </span>
                  </div>

                  {game.metacritic && (
                    <div className="flex items-center gap-2 bg-green-600/80 px-3 py-1 rounded-full">
                      <Trophy size={16} className="text-white" />
                      <span className="text-white font-semibold">
                        {game.metacritic}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                    <Calendar size={16} className="text-blue-400" />
                    <span className="text-white">
                      {new Date(game.released).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Platform Icons */}
                <div className="flex items-center gap-2 mb-4">
                  {game.platforms.some((p) =>
                    p.platform.name.toLowerCase().includes("steam")
                  ) && <SiSteam className="text-[#c7d5e0] text-xl" />}
                  {game.platforms.some((p) =>
                    p.platform.name.toLowerCase().includes("epic")
                  ) && <SiEpicgames className="text-white text-xl" />}
                  {game.platforms.some((p) =>
                    p.platform.name.toLowerCase().includes("playstation")
                  ) && <SiPlaystation className="text-blue-400 text-xl" />}
                  {game.platforms.some((p) =>
                    p.platform.name.toLowerCase().includes("xbox")
                  ) && <SiBox className="text-green-400 text-xl" />}
                </div>

                {/* Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {SAMPLE_AVATARS.slice(0, 3).map((avatar, i) => (
                      <Avatar key={i} className="w-6 h-6 border-2 border-white">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>U{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="text-sm bg-white text-black font-semibold px-3 py-1 rounded-full">
                    +{game.ratings_count.toLocaleString()} Reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-white/70 leading-relaxed">
                {game.description_raw}
              </p>
            </div>

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div className="bg-black/50 rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Screenshots
                </h2>
                <div className="space-y-4">
                  {/* Navigation Buttons */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveScreenshot(
                          activeScreenshot === 0
                            ? screenshots.length - 1
                            : activeScreenshot - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={() =>
                        setActiveScreenshot(
                          activeScreenshot === screenshots.length - 1
                            ? 0
                            : activeScreenshot + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="relative h-64 rounded-3xl overflow-hidden">
                      <Image
                        src={
                          screenshots[activeScreenshot]?.image ||
                          screenshots[0]?.image
                        }
                        alt="Game screenshot"
                        fill
                        className="object-cover transition-all duration-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {screenshots.slice(0, 6).map((screenshot, index) => (
                      <button
                        key={screenshot.id}
                        onClick={() => setActiveScreenshot(index)}
                        className={`relative flex-shrink-0 w-20 h-12 rounded-2xl overflow-hidden border-2 transition-colors ${
                          activeScreenshot === index
                            ? "border-[#bb3b3b]"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={screenshot.image}
                          alt="Screenshot thumbnail"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Genres & Tags */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Genres & Tags
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.map((genre) => (
                    <Link href={`/genre/${genre.name.toLowerCase()}`} key={genre.id}>
                      <span
                        key={genre.id}
                        className="bg-[#bb3b3b]/20 text-[#bb3b3b] px-3 py-1 rounded-full text-sm border border-[#bb3b3b]/30"
                      >
                        {genre.name}
                      </span>
                    </Link>
                    ))}
                  </div>
                </div>
                {game.tags && game.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {game.tags.slice(0, 10).map((tag) => (
                      <Link href={`/tag/${tag.name.toLowerCase()}`} key={tag.id}>
                        <span
                          key={tag.id}
                          className="bg-black/30 text-white/70 px-3 py-1 rounded-full text-sm border border-white/20"
                        >
                          <Tag size={12} className="inline mr-1" />
                          {tag.name}
                        </span>
                      </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Game Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-400" size={16} />
                    <span className="text-white/70">Players</span>
                  </div>
                  <span className="text-white font-semibold">
                    {game.added.toLocaleString()}
                  </span>
                </div>

                {game.playtime > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-green-400" size={16} />
                      <span className="text-white/70">Avg Playtime</span>
                    </div>
                    <span className="text-white font-semibold">
                      {game.playtime}h
                    </span>
                  </div>
                )}

                {game.achievements_count > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="text-yellow-400" size={16} />
                      <span className="text-white/70">Achievements</span>
                    </div>
                    <span className="text-white font-semibold">
                      {game.achievements_count}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Platforms */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Available On
              </h3>
              <div className="space-y-2">
                {game.platforms.map((platform) => (
                <Link href={`/platforms/${platform.platform.id}` } className="flex flex-col gap-2" key={platform.platform.id}>
                  <div
                    key={platform.platform.id}
                    className="flex items-center gap-3 p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors"
                  >
                    {getPlatformIcon(platform.platform.name)}
                    <span className="text-white/70">
                      {platform.platform.name}
                    </span>
                  </div>
                </Link>
                ))}
              </div>
            </div>

            {/* Developer & Publisher */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Details</h3>
              <div className="space-y-4">
                {game.developers.length > 0 && (
                  <div className="bg-black/30 rounded-2xl p-3">
                    <span className="text-white/50 text-sm">Developer</span>
                    <p className="text-white font-medium">
                      {game.developers.map((dev) => dev.name).join(", ")}
                    </p>
                  </div>
                )}
                {game.publishers.length > 0 && (
                  <div className="bg-black/30 rounded-2xl p-3">
                    <span className="text-white/50 text-sm">Publisher</span>
                    <p className="text-white font-medium">
                      {game.publishers.map((pub) => pub.name).join(", ")}
                    </p>
                  </div>
                )}
                {game.esrb_rating && (
                  <div className="bg-black/30 rounded-2xl p-3">
                    <span className="text-white/50 text-sm">ESRB Rating</span>
                    <p className="text-white font-medium">
                      {game.esrb_rating.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* External Links */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Links</h3>
              <div className="space-y-2">
                {game.website && (
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors group"
                  >
                    <Globe size={16} className="text-blue-400" />
                    <span className="text-white/70 group-hover:text-white">
                      Official Website
                    </span>
                    <ExternalLink size={14} className="text-white/50 ml-auto" />
                  </a>
                )}
                {game.metacritic_url && (
                  <a
                    href={game.metacritic_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors group"
                  >
                    <Trophy size={16} className="text-green-400" />
                    <span className="text-white/70 group-hover:text-white">
                      Metacritic
                    </span>
                    <ExternalLink size={14} className="text-white/50 ml-auto" />
                  </a>
                )}
                {game.reddit_url && (
                  <a
                    href={game.reddit_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors group"
                  >
                    <Users size={16} className="text-orange-400" />
                    <span className="text-white/70 group-hover:text-white">
                      Reddit
                    </span>
                    <ExternalLink size={14} className="text-white/50 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
