"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  Star,
  Calendar,
  Edit3,
  GamepadIcon,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast-config";
import LatestGameCard from "@/components/LatestGameCard";

interface UserProfile {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  profileImage: string;
  bannerImage: string;
  bio: string;
  createdAt: string;
  favourites: Game[];
}

interface Game {
  _id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  rawgId: number;
  released?: string;
  genres?: string[];
  platforms?: string[];
}

interface Review {
  _id: string;
  rating: number;
  text: string;
  createdAt: string;
  game: {
    _id: string;
    title: string;
    image: string;
  };
}

// Helpers defined at module scope to avoid unstable references in hooks and eliminate any
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const normalizeId = (val: unknown): string | null => {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (isObject(val)) {
    const obj = val as Record<string, unknown>;
    if (typeof obj['$oid'] === 'string') return obj['$oid'] as string;
    if (typeof obj['id'] === 'string') return obj['id'] as string;
    if (typeof obj['_id'] === 'string') return obj['_id'] as string;
    const toStringFn = (obj as { toString?: () => string }).toString;
    if (typeof toStringFn === 'function') {
      const s = toStringFn.call(obj);
      if (s && s !== '[object Object]') return s;
    }
  }
  return null;
};

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"favorites" | "reviews">(
    "favorites"
  );
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  
  useEffect(() => {
    let isMounted = true;

    const checkAuthAndLoadProfile = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (isMounted) {
          setUser(parsedUser);
          // Handle both 'id' and '_id' field names safely
          const userId = normalizeId(parsedUser.id) || normalizeId(parsedUser._id);
          if (userId) {
            fetchUserFavorites(userId);
          } else {
            setLoading(false);
            showToast.error("Invalid user data. Please log in again.");
          }
        }
      } else {
        if (isMounted) {
          setLoading(false);
          showToast.error("Please log in to view your profile");
          router.push("/get-started");
        }
      }
    };

    // Initial check
    checkAuthAndLoadProfile();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuthAndLoadProfile();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [router]);

  const fetchUserFavorites = async (userId: string) => {
    try {
      // Fetch complete user profile with favorites only
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      showToast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async (userId: string) => {
    try {
      const reviewsResponse = await fetch(`/api/reviews?userId=${userId}`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
        setReviewsLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "reviews" && !reviewsLoaded) {
      const local = localStorage.getItem("user");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const id = normalizeId(parsed.id) || normalizeId(parsed._id);
          if (id) {
            fetchUserReviews(id);
          }
        } catch {
          // ignore JSON parse errors
        }
      }
    }
  }, [activeTab, reviewsLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#bb3b3b]/30 border-t-[#bb3b3b] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <GamepadIcon size={64} className="text-[#bb3b3b] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Not Logged In</h2>
          <p className="text-[#d1c0c0] mb-6">
            Please log in to view your profile
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-6 py-3 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header with Banner */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-64 bg-gradient-to-r from-[#1a0a0a] to-[#2a1a1a] overflow-hidden">
          {user.bannerImage ? (
            <Image
              src={user.bannerImage}
              alt="Profile banner"
              width={1200}
              height={256}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#bb3b3b]/20 to-[#d14d4d]/20" />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Profile Content Overlay */}
        <div className="absolute inset-0">
          <div className="max-w-6xl mx-auto px-4 h-full flex flex-col">
            {/* Back Button */}
            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center  gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-3 py-2 rounded-lg"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </div>

            {/* Profile Info */}
            <div className="flex-1 flex items-end pb-6">
              <div className="flex items-end gap-6 w-full">
                {/* Profile Image */}
                <div className="w-24 h-24 xs:w-28 xs:h-28 md:w-32 md:h-32 rounded-full bg-[#2a1a1a] border-4 border-white flex items-center justify-center overflow-hidden shadow-xl shrink-0">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.username}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-[#bb3b3b]" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                      {user.username}
                    </h1>
                    <Link
                      href="/profile/edit"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-colors"
                    >
                      <Edit3 className="size-3 sm:size-5" />
                      Edit Profile
                    </Link>
                  </div>

                  <p className="text-white/90 mb-4 drop-shadow">
                    {user.bio || "No bio added yet"}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#1a0a0a] p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "favorites"
              ? "bg-[#bb3b3b] text-white"
              : "text-[#d1c0c0] hover:text-white hover:bg-[#2a1a1a]"
              }`}
          >
            <Heart size={16} className="inline mr-2" />
            Favorites ({user.favourites?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "reviews"
              ? "bg-[#bb3b3b] text-white"
              : "text-[#d1c0c0] hover:text-white hover:bg-[#2a1a1a]"
              }`}
          >
            <Star size={16} className="inline mr-2" />
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "favorites" && (
            <div>
              {user.favourites && user.favourites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {user.favourites.map((game) => {
                    // Transform the game data to match LatestGameCard interface
                    const transformedGame = {
                      id: game.rawgId,
                      name: game.title,
                      background_image: game.image || "/placeholder-game.svg",
                      rating: game.rating || 0,
                      released: game.released || new Date().toISOString(),
                      genres: game.genres?.map((g) => ({ name: g })) || [
                        { name: "Game" },
                      ],
                      platforms: game.platforms?.map((p) => ({
                        platform: { name: p },
                      })) || [{ platform: { name: "PC" } }],
                      metacritic: 0, // Will be fetched from RAWG if needed
                      added: 1000, // Default added count
                    };

                    return (
                      <motion.div
                        key={game._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LatestGameCard
                          game={transformedGame}
                          onClick={() => router.push(`/game/${game.rawgId}`)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart size={48} className="text-[#bb3b3b] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Favorites Yet
                  </h3>
                  <p className="text-[#d1c0c0] mb-6">
                    Start exploring games and add them to your favorites!
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    Explore Games
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <motion.div
                      key={review._id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a] hover:border-[#bb3b3b] transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#2a1a1a] rounded-lg flex items-center justify-center overflow-hidden">
                          {review.game.image ? (
                            <Image
                              src={review.game.image}
                              alt={review.game.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <GamepadIcon size={24} className="text-[#bb3b3b]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-white">
                              {review.game.title}
                            </h3>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${i < review.rating
                                    ? "text-yellow-500 fill-current"
                                    : "text-[#3a1a1a]"
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-[#d1c0c0] mb-3">{review.text}</p>
                          <p className="text-sm text-[#8a6e6e]">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare
                    size={48}
                    className="text-[#bb3b3b] mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-[#d1c0c0] mb-6">
                    Share your thoughts about games you&apos;ve played!
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    Explore Games
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
