"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  User, 
  Users, 
  Calendar, 
  Heart,
  ArrowLeft,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast-config";

interface UserProfile {
  id: string;
  _id?: string; // Keep for backward compatibility
  username: string;
  email: string;
  profileImage: string;
  bio: string;
  createdAt: string;
  favourites?: unknown[];
}

const UsersPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else {
        setCurrentUser(null);
      }
    };

    // Initial check
    checkAuth();
    fetchUsers();

    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } else {
        showToast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") return;

    try {
      setSearchLoading(true);
      // You can implement server-side search here if needed
      // For now, we'll use client-side filtering
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const getUserId = (user: UserProfile) => user.id || user._id;

  const handleUserClick = (user: UserProfile) => {
    const userId = getUserId(user);
    router.push(`/user/${userId}`);
  };

  const UserCardSkeleton = () => (
    <div className="bg-surface rounded-xl p-6 border border-primary animate-pulse">
      {/* Profile Image Skeleton */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full bg-primary/20 mb-3"></div>
      </div>

      {/* User Info Skeleton */}
      <div className="text-center">
        <div className="h-5 bg-primary/20 rounded mb-2 w-3/4 mx-auto"></div>
        <div className="h-4 bg-primary/20 rounded mb-3 w-full"></div>
        <div className="h-4 bg-primary/20 rounded mb-3 w-2/3 mx-auto"></div>
        
        {/* Stats Skeleton */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary/20 rounded"></div>
            <div className="w-4 h-3 bg-primary/20 rounded"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary/20 rounded"></div>
            <div className="w-8 h-3 bg-primary/20 rounded"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-8 bg-primary/20 rounded-lg"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-primary/20 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-primary/20 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-primary animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-xl"></div>
                <div>
                  <div className="h-8 bg-primary/20 rounded mb-2 w-48"></div>
                  <div className="h-4 bg-primary/20 rounded w-64"></div>
                </div>
              </div>

              {/* Search Bar Skeleton */}
              <div className="relative">
                <div className="w-full h-14 bg-primary/20 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Users Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-primary">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 accent-bg rounded-xl flex items-center justify-center">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">Find Users</h1>
                <p className="text-secondary">Discover and connect with other gamers</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users by username, email, or bio..."
                className="w-full bg-surface border border-primary rounded-xl pl-12 pr-4 py-4 text-primary placeholder-muted focus:accent-border focus:outline-none transition-colors"
              />
              {searchLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchLoading ? (
            // Show skeleton while searching
            [...Array(8)].map((_, index) => (
              <UserCardSkeleton key={`search-skeleton-${index}`} />
            ))
          ) : (
            filteredUsers
              .filter((user) => {
                // Hide the current logged-in user from the list
                if (!currentUser) return true;
                const currentUserId = getUserId(currentUser);
                const userId = getUserId(user);
                return currentUserId !== userId;
              })
              .map((user) => {
            const isCurrentUser = currentUser && (getUserId(currentUser) === getUserId(user));
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-surface rounded-xl p-6 border border-primary hover:accent-border transition-all cursor-pointer"
                onClick={() => !isCurrentUser && handleUserClick(user)}
              >
                {/* Profile Image */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-surface border-2 accent-border flex items-center justify-center overflow-hidden mb-3">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.username}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="accent-primary" />
                    )}
                  </div>
                  
                  {isCurrentUser && (
                    <span className="accent-bg text-white text-xs px-2 py-1 rounded-full mb-2">
                      You
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary mb-2">{user.username}</h3>
                  {user.bio && (
                    <p className="text-secondary text-sm mb-3 line-clamp-2">{user.bio}</p>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Heart size={12} />
                      <span>{user.favourites?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(user.createdAt).getFullYear()}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isCurrentUser && currentUser && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement follow functionality
                        showToast.success('Follow functionality coming soon!');
                      }}
                      className="w-full flex items-center justify-center gap-2 accent-bg accent-bg-hover text-white py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <UserPlus size={14} />
                      Follow
                    </button>
                  )}

                  {isCurrentUser && (
                    <Link
                      href="/profile"
                      className="w-full flex items-center justify-center gap-2 bg-surface bg-surface-hover text-secondary hover:text-primary py-2 rounded-lg transition-colors text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <User size={14} />
                      View Profile
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })
          )}
        </div>

        {/* Empty State */}
        {!searchLoading && filteredUsers.filter((user) => {
          if (!currentUser) return true;
          const currentUserId = getUserId(currentUser);
          const userId = getUserId(user);
          return currentUserId !== userId;
        }).length === 0 && !loading && (
          <div className="text-center py-12">
            <Users size={64} className="accent-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">
              {searchQuery ? 'No Users Found' : 'No Users Yet'}
            </h3>
            <p className="text-secondary mb-6">
              {searchQuery 
                ? `No users match "${searchQuery}". Try a different search term.`
                : 'Be the first to join the community!'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="accent-bg accent-bg-hover text-white px-6 py-3 rounded-xl transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        {!searchLoading && searchQuery && filteredUsers.filter((user) => {
          if (!currentUser) return true;
          const currentUserId = getUserId(currentUser);
          const userId = getUserId(user);
          return currentUserId !== userId;
        }).length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted">
              Found {filteredUsers.filter((user) => {
                if (!currentUser) return true;
                const currentUserId = getUserId(currentUser);
                const userId = getUserId(user);
                return currentUserId !== userId;
              }).length} user{filteredUsers.filter((user) => {
                if (!currentUser) return true;
                const currentUserId = getUserId(currentUser);
                const userId = getUserId(user);
                return currentUserId !== userId;
              }).length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;