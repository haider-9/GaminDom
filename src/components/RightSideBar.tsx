"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  Edit3,
  Heart,
  Star,
  Calendar,
  ChevronRight,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserData {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  profileImage: string;
  bio?: string;
  createdAt: string;
  favourites?: Array<{
    _id: string;
    title: string;
    image: string;
    rating: number;
    rawgId: number;
  }>;
}

interface Review {
  _id: string;
  rating: number;
  text: string;
  createdAt: string;
}

// Helpers defined at module scope to avoid unstable references in hooks
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
export const normalizeId = (val: unknown): string | null => {
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

const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const router = useRouter();

  const fetchUserData = useCallback(async (userId: string, currentUser: UserData | null) => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      return;
    }

    // Only skip if we already have this user's full profile (including favourites)
    const sameUser = !!(currentUser && (normalizeId(currentUser?.id) === userId || normalizeId(currentUser?._id) === userId));
    if (sameUser && Array.isArray(currentUser?.favourites)) {
      return; // Already have this user's full data
    }

    try {
      setIsLoading(true);

      // Fetch complete user profile with favorites
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
        
        // Only fetch reviews if user fetch was successful
        const reviewsResponse = await fetch(`/api/reviews?userId=${userId}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
        }
      } else {
        // If user fetch fails, don't retry - just log the error
        console.error(`Failed to fetch user data: ${userResponse.status} ${userResponse.statusText}`);
        // Stop trying to fetch on server errors
        setHasInitialized(true);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Stop trying to fetch on errors
      setHasInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    setMounted(true);

    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');

        if (userData) {
          const parsedUser = JSON.parse(userData);
          const storedId = normalizeId(parsedUser.id) || normalizeId(parsedUser._id);
          
          setUser(prevUser => {
            const currentId = normalizeId(prevUser?.id) || normalizeId(prevUser?._id);
            
            // Only update if it's actually a different user or we don't have a user yet
            if (!prevUser || (storedId && storedId !== currentId)) {
              // Reset initialization flag for new user
              setHasInitialized(false);
              // Fetch full profile and reviews using a safe ID string
              if (storedId) {
                setTimeout(() => fetchUserData(storedId, parsedUser), 0);
              }
              return parsedUser;
            } else if (prevUser && !Array.isArray(prevUser.favourites) && !hasInitialized) {
              // We have a user but likely from localStorage without favourites populated
              if (storedId) {
                setHasInitialized(true);
                setTimeout(() => fetchUserData(storedId, prevUser), 0);
              }
              return prevUser;
            }
            return prevUser;
          });
        } else {
          setUser(prevUser => {
            if (prevUser) {
              setReviews([]);
              setHasInitialized(false);
              return null;
            }
            return prevUser;
          });
        }
      } catch (error) {
        console.error('RightSideBar: Error parsing user data:', error);
        setUser(prevUser => {
          if (prevUser) {
            setReviews([]);
            setHasInitialized(false);
            return null;
          }
          return prevUser;
        });
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkAuth);

    // Also listen for a custom event that we can dispatch after login
    const handleAuthChange = () => {
      setHasInitialized(false); // Reset initialization flag on auth change
      checkAuth();
    };
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []); // Remove all dependencies to prevent infinite loops

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setReviews([]);
    setIsOpen(false);
    router.push('/');
    // Trigger events for other components
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('authChange'));
  };

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

  // Don't render if no user is logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Profile Button - Always visible when logged in */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 right-6 z-40"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-[#1a0a0a] border-2 border-[#bb3b3b] flex items-center justify-center overflow-hidden hover:border-[#d14d4d] transition-colors shadow-lg"
        >
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.username}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-[#bb3b3b]" />
          )}
        </button>
      </motion.div>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-45"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-[#1a0a0a] border-l border-[#3a1a1a] z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#3a1a1a]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Profile</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#2a1a1a] flex items-center justify-center text-[#d1c0c0] hover:text-white hover:bg-[#3a1a1a] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#2a1a1a] border-2 border-[#bb3b3b] flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.username}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-[#bb3b3b]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{user.username}</h3>
                    <p className="text-sm text-[#8a6e6e]">{user.email}</p>
                    {user.bio && (
                      <p className="text-sm text-[#d1c0c0] mt-1 line-clamp-2">{user.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 border-b border-[#3a1a1a]">
                <h3 className="text-sm font-semibold text-[#d1c0c0] mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#2a1a1a] rounded-lg p-3 text-center">
                    <Heart size={16} className="text-[#bb3b3b] mx-auto mb-1" />
                    <p className="text-sm font-semibold text-white">{user.favourites?.length || 0}</p>
                    <p className="text-xs text-[#8a6e6e]">Favorites</p>
                  </div>
                  <div className="bg-[#2a1a1a] rounded-lg p-3 text-center">
                    <Star size={16} className="text-yellow-500 mx-auto mb-1" />
                    <p className="text-sm font-semibold text-white">{reviews.length}</p>
                    <p className="text-xs text-[#8a6e6e]">Reviews</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#8a6e6e]">
                  <Calendar size={12} />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-6">
                <nav className="space-y-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#d1c0c0] hover:text-white hover:bg-[#2a1a1a] transition-colors group"
                  >
                    <User size={18} />
                    <span>View Profile</span>
                    <ChevronRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/profile/edit"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#d1c0c0] hover:text-white hover:bg-[#2a1a1a] transition-colors group"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                    <ChevronRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#d1c0c0] hover:text-white hover:bg-[#2a1a1a] transition-colors group"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                    <ChevronRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors group"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                    <ChevronRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                  </button>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default RightSidebar;