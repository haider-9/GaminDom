"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Calendar,
  Users,
  Heart,
  Share2,
  ArrowLeft,
  Gamepad2,
  Monitor,
  Flame,
  BookOpen,
  PenTool,
} from "lucide-react";
import {
  SiSteam,
  SiPlaystation,
  SiAndroid,
  SiApple,
  SiLinux,
  SiNintendo,
  SiSega,
} from "react-icons/si";

interface CreatorDetails {
  id: number;
  name: string;
  description: string;
  image: string;
  image_background: string;
  games_count: number;
  reviews_count: number;
  rating: string;
  rating_top: number;
  updated: string;
  positions: Array<{ id: number; name: string; slug: string }>;
  platforms: {
    total: number;
    results: Array<{
      count: number;
      percent: number;
      platform: { id: number; name: string; slug: string };
    }>;
    count: number;
  };
  ratings: Array<{
    id: number;
    title: string;
    count: number;
    percent: number;
  }>;
  timeline: Array<{ year: number; count: number }>;
}

const CreatorPage = () => {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.id as string;

  const [creator, setCreator] = useState<CreatorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

        const response = await fetch(
          `https://api.rawg.io/api/creators/${creatorId}?key=${apiKey}`
        );
        if (!response.ok) throw new Error("Failed to fetch creator details");
        const data = await response.json();

        setCreator(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (creatorId) {
      fetchCreatorDetails();
    }
  }, [creatorId]);

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

  if (error || !creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-black/50 rounded-3xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">
            Creator Not Found
          </h1>
          <p className="text-white/70 mb-6">
            {error || "The requested creator could not be found."}
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

  const getPlatformIcon = (platformSlug: string) => {
    switch (platformSlug) {
      case "pc":
        return <Monitor size={16} />;
      case "playstation":
        return <SiPlaystation size={16} />;
      case "xbox":
        return <Gamepad2 size={16} />;
      case "android":
        return <SiAndroid size={16} />;
      case "mac":
        return <SiApple size={16} />;
      case "linux":
        return <SiLinux size={16} />;
      case "nintendo":
        return <SiNintendo size={16} />;
      case "sega":
        return <SiSega size={16} />;
      default:
        return <Gamepad2 size={16} />;
    }
  };

  const activeYears = creator.timeline.filter((year) => year.count > 0);
  const firstActiveYear = activeYears.length > 0 ? activeYears[0].year : null;
  const lastActiveYear =
    activeYears.length > 0 ? activeYears[activeYears.length - 1].year : null;

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
              src={creator.image_background || "/placeholder-game.jpg"}
              alt={creator.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Creator Image */}
              <div className="w-full lg:w-64 h-64 rounded-3xl overflow-hidden relative">
                <Image
                  src={creator.image || "/placeholder-avatar.jpg"}
                  alt={creator.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Creator Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {creator.name}
                </h1>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {parseFloat(creator.rating) >= 4.0 && (
                    <span className="bg-[#FDD161] text-black text-sm px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Flame size={14} />
                      Highly Rated
                    </span>
                  )}

                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                    <Star
                      className="text-yellow-400 fill-yellow-400"
                      size={16}
                    />
                    <span className="text-white font-semibold">
                      {creator.rating}/5
                    </span>
                    <span className="text-white/70">
                      ({creator.reviews_count.toLocaleString()} reviews)
                    </span>
                  </div>

                  {firstActiveYear && lastActiveYear && (
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="text-white">
                        {firstActiveYear === lastActiveYear
                          ? firstActiveYear
                          : `${firstActiveYear} - ${lastActiveYear}`}
                      </span>
                    </div>
                  )}

                  {creator.positions.length > 0 && (
                    <div className="flex items-center gap-2 bg-[#bb3b3b]/30 px-3 py-1 rounded-full">
                      <PenTool size={16} className="text-[#bb3b3b]" />
                      <span className="text-white">
                        {creator.positions[0].name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Games Count */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                    <Gamepad2 size={16} className="text-purple-400" />
                    <span className="text-white">
                      {creator.games_count} games
                    </span>
                  </div>
                </div>

                {/* Platform Icons */}
                <div className="flex items-center gap-2 mb-4">
                  {creator.platforms.results.some(
                    (p) => p.platform.slug === "pc"
                  ) && <SiSteam className="text-[#c7d5e0] text-xl" />}
                  {creator.platforms.results.some(
                    (p) => p.platform.slug === "playstation"
                  ) && <SiPlaystation className="text-blue-400 text-xl" />}
                  {creator.platforms.results.some(
                    (p) => p.platform.slug === "android"
                  ) && <SiAndroid className="text-green-400 text-xl" />}
                  {creator.platforms.results.some(
                    (p) => p.platform.slug === "mac"
                  ) && <SiApple className="text-gray-300 text-xl" />}
                  {creator.platforms.results.some(
                    (p) => p.platform.slug === "nintendo"
                  ) && <SiNintendo className="text-red-500 text-xl" />}
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
              <div
                className="text-white/70 leading-relaxed prose prose-invert"
                dangerouslySetInnerHTML={{ __html: creator.description }}
              />
            </div>

            {/* Ratings */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Ratings</h2>
              <div className="space-y-3">
                {creator.ratings.map((rating) => (
                  <div key={rating.id} className="flex items-center gap-4">
                    <div className="w-32 text-white/70">{rating.title}</div>
                    <div className="flex-1 bg-black/30 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-[#bb3b3b]"
                        style={{ width: `${rating.percent}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-white font-medium">
                      {rating.count.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Stats */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="text-purple-400" size={16} />
                    <span className="text-white/70">Games</span>
                  </div>
                  <span className="text-white font-semibold">
                    {creator.games_count}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-400" size={16} />
                    <span className="text-white/70">Reviews</span>
                  </div>
                  <span className="text-white font-semibold">
                    {creator.reviews_count.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400" size={16} />
                    <span className="text-white/70">Average Rating</span>
                  </div>
                  <span className="text-white font-semibold">
                    {creator.rating}/5
                  </span>
                </div>

                {firstActiveYear && lastActiveYear && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-green-400" size={16} />
                      <span className="text-white/70">Active Years</span>
                    </div>
                    <span className="text-white font-semibold">
                      {firstActiveYear === lastActiveYear
                        ? firstActiveYear
                        : `${firstActiveYear} - ${lastActiveYear}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Platforms */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Platforms Worked On
              </h3>
              <div className="space-y-2">
                {creator.platforms.results.map((platform) => (
                  <div
                    key={platform.platform.id}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/platforms/${platform.platform.id}`)
                    }
                  >
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(platform.platform.slug)}
                      <span className="text-white/70">
                        {platform.platform.name}
                      </span>
                    </div>
                    <span className="text-white font-medium">
                      {platform.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Positions */}
            {creator.positions.length > 0 && (
              <div className="bg-black/50 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Roles</h3>
                <div className="space-y-2">
                  {creator.positions.map((position) => (
                    <div
                      key={position.id}
                      className="flex items-center gap-3 p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors"
                    >
                      <BookOpen size={16} className="text-[#bb3b3b]" />
                      <span className="text-white/70 capitalize">
                        {position.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            {activeYears.length > 0 && (
              <div className="bg-black/50 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {activeYears.map((year) => (
                    <div key={year.year} className="flex items-center gap-4">
                      <div className="w-16 text-white/70">{year.year}</div>
                      <div className="flex-1 bg-black/30 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-[#bb3b3b]"
                          style={{
                            width: `${
                              (year.count /
                                Math.max(...activeYears.map((y) => y.count))) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="w-16 text-right text-white font-medium">
                        {year.count} {year.count === 1 ? "game" : "games"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
