"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Heart, 
  Star, 
  Calendar, 
  GamepadIcon,
  MessageSquare,
  ArrowLeft,
  UserPlus,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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

const UserPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'favorites' | 'reviews'>('favorites');
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const fetchUserData = useCallback(async (id: string) => {
    try {
      // Fetch user profile with favorites
      const userResponse = await fetch(`/api/users/${id}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      } else {
        showToast.error('User not found');
        router.push('/');
        return;
      }

      // Fetch user's reviews
      const reviewsResponse = await fetch(`/api/reviews?userId=${id}`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    if (userId) {
      fetchUserData(userId);
    }
  }, [userId, fetchUserData]);

  const handleFollowToggle = () => {
    // TODO: Implement follow/unfollow functionality
    setIsFollowing(!isFollowing);
    showToast.success(isFollowing ? 'Unfollowed user' : 'Following user');
  };

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
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-[#d1c0c0] mb-6">The user you&apos;re looking for doesn&apos;t exist</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && (currentUser.id === user.id || currentUser._id === user._id);

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-[#1a0a0a] p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-[#bb3b3b] text-white'
                    : 'text-[#d1c0c0] hover:text-white hover:bg-[#2a1a1a]'
                }`}
              >
                <Heart size={16} className="inline mr-2" />
                Favorites ({user.favourites?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-[#bb3b3b] text-white'
                    : 'text-[#d1c0c0] hover:text-white hover:bg-[#2a1a1a]'
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
              {activeTab === 'favorites' && (
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
                          genres: game.genres?.map(g => ({ name: g })) || [{ name: "Game" }],
                          platforms: game.platforms?.map(p => ({ platform: { name: p } })) || [{ platform: { name: "PC" } }],
                          metacritic: 0,
                          added: 1000
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
                      <h3 className="text-xl font-bold text-white mb-2">No Favorites Yet</h3>
                      <p className="text-[#d1c0c0] mb-6">
                        {isOwnProfile ? "Start exploring games and add them to your favorites!" : `${user.username} hasn't favorited any games yet.`}
                      </p>
                      {isOwnProfile && (
                        <Link
                          href="/"
                          className="inline-flex items-center gap-2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Explore Games
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
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
                                <h3 className="font-bold text-white">{review.game.title}</h3>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={`${
                                        i < review.rating
                                          ? 'text-yellow-500 fill-current'
                                          : 'text-[#3a1a1a]'
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
                      <MessageSquare size={48} className="text-[#bb3b3b] mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
                      <p className="text-[#d1c0c0] mb-6">
                        {isOwnProfile ? "Share your thoughts about games you've played!" : `${user.username} hasn't written any reviews yet.`}
                      </p>
                      {isOwnProfile && (
                        <Link
                          href="/"
                          className="inline-flex items-center gap-2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Explore Games
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Stats */}
            <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a]">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="text-red-500" size={16} />
                    <span className="text-[#d1c0c0]">Favorites</span>
                  </div>
                  <span className="text-white font-semibold">{user.favourites?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={16} />
                    <span className="text-[#d1c0c0]">Reviews</span>
                  </div>
                  <span className="text-white font-semibold">{reviews.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-400" size={16} />
                    <span className="text-[#d1c0c0]">Member Since</span>
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {new Date(user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {(user.favourites?.length > 0 || reviews.length > 0) && (
              <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a]">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                
                <div className="space-y-3">
                  {user.favourites?.slice(0, 2).map((game) => (
                    <div key={game._id} className="flex items-center gap-3 p-2 bg-[#2a1a1a] rounded-lg">
                      <div className="w-8 h-8 rounded bg-[#3a1a1a] flex items-center justify-center overflow-hidden">
                        {game.image ? (
                          <Image
                            src={game.image}
                            alt={game.title}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <GamepadIcon size={12} className="text-[#bb3b3b]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{game.title}</p>
                        <p className="text-xs text-[#8a6e6e]">Added to favorites</p>
                      </div>
                    </div>
                  ))}
                  
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review._id} className="flex items-center gap-3 p-2 bg-[#2a1a1a] rounded-lg">
                      <div className="w-8 h-8 rounded bg-[#3a1a1a] flex items-center justify-center overflow-hidden">
                        {review.game.image ? (
                          <Image
                            src={review.game.image}
                            alt={review.game.title}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <GamepadIcon size={12} className="text-[#bb3b3b]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{review.game.title}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={`${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-[#3a1a1a]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#8a6e6e]">Reviewed</span>
                        </div>
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

export default UserPage;