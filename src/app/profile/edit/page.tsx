"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Camera, 
  Save, 
  X, 
  ArrowLeft,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast-config";

interface UserProfile {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  profileImage: string;
  bannerImage: string;
  bio: string;
  createdAt: string;
}

const EditProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profileImage: "",
    bannerImage: "",
  });
  
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const findUserByEmail = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.users && data.users.length > 0) {
          const foundUser = data.users[0];
          const userId = foundUser.id;
          fetchUserData(userId);
        } else {
          setLoading(false);
          showToast.error('User not found. Please log in again.');
          router.push('/get-started');
        }
      } else {
        setLoading(false);
        showToast.error('Failed to find user. Please log in again.');
        router.push('/get-started');
      }
    } catch (error) {
      console.error('Error finding user by email:', error);
      setLoading(false);
      showToast.error('Failed to load user data. Please log in again.');
      router.push('/get-started');
    }
  }, [router]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        const userProfile = userData.user;
        
        // Update localStorage with fresh user data
        const updatedUserData = {
          id: userProfile.id || userProfile._id, // Ensure id is set
          _id: userProfile._id,
          username: userProfile.username,
          email: userProfile.email,
          profileImage: userProfile.profileImage,
          bannerImage: userProfile.bannerImage,
          bio: userProfile.bio,
          createdAt: userProfile.createdAt,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        setUser(userProfile);
        setFormData({
          username: userProfile.username || "",
          bio: userProfile.bio || "",
          profileImage: userProfile.profileImage || "",
          bannerImage: userProfile.bannerImage || "",
        });
        setProfilePreview(userProfile.profileImage || "");
        setBannerPreview(userProfile.bannerImage || "");
      } else {
        showToast.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndLoadProfile = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Handle both 'id' and '_id' field names
        const userId = parsedUser.id || parsedUser._id;
        
        if (userId && userId !== 'undefined' && userId !== null) {
          fetchUserData(userId);
        } else if (parsedUser.email) {
          // Fallback: try to find user by email
          findUserByEmail(parsedUser.email);
        } else {
          setLoading(false);
          showToast.error('Invalid user data. Please log in again.');
          router.push('/get-started');
        }
      } else {
        setLoading(false);
        showToast.error('Please log in to edit your profile');
        router.push('/get-started');
      }
    };

    // Initial check
    checkAuthAndLoadProfile();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuthAndLoadProfile();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [findUserByEmail, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'profile') {
          setProfilePreview(base64String);
          setFormData(prev => ({ ...prev, profileImage: base64String }));
        } else {
          setBannerPreview(base64String);
          setFormData(prev => ({ ...prev, bannerImage: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type: 'profile' | 'banner') => {
    if (type === 'profile') {
      setProfilePreview("");
      setFormData(prev => ({ ...prev, profileImage: "" }));
    } else {
      setBannerPreview("");
      setFormData(prev => ({ ...prev, bannerImage: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    
    try {
      const userId = user.id || user._id;
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success('Profile updated successfully!');
        // Update localStorage
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          id: data.user.id || data.user._id, // Ensure id is set
        }));
        // Notify other components about the auth change
        window.dispatchEvent(new Event('authChange'));
        router.push('/profile');
      } else {
        showToast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
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
          <User size={64} className="text-[#bb3b3b] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-[#d1c0c0] mb-6">Please log in to edit your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="bg-[#1a0a0a] border-b border-[#3a1a1a]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-[#d1c0c0] hover:text-[#bb3b3b] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Profile
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Banner Image Section */}
          <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a]">
            <h3 className="text-lg font-semibold text-white mb-4">Banner Image</h3>
            <div className="relative">
              <div className="w-full h-48 bg-[#2a1a1a] rounded-lg border-2 border-dashed border-[#3a1a1a] flex items-center justify-center overflow-hidden">
                {bannerPreview ? (
                  <Image
                    src={bannerPreview}
                    alt="Banner preview"
                    width={800}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon size={32} className="text-[#bb3b3b] mx-auto mb-2" />
                    <p className="text-[#d1c0c0] text-sm">Upload a banner image</p>
                  </div>
                )}
              </div>
              
              {bannerPreview && (
                <button
                  type="button"
                  onClick={() => removeImage('banner')}
                  className="absolute top-2 right-2 w-8 h-8 bg-[#bb3b3b] rounded-full flex items-center justify-center text-white hover:bg-[#d14d4d] transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              
              <div className="mt-4 flex gap-3">
                <input
                  type="file"
                  id="bannerImage"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'banner')}
                  className="hidden"
                />
                <label
                  htmlFor="bannerImage"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg text-[#e0d0d0] hover:bg-[#3a1a1a] transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  Choose Banner
                </label>
                <p className="text-xs text-[#8a6e6e] flex items-center">
                  Recommended: 1200x300px, Max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Profile Image Section */}
          <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a]">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-[#2a1a1a] border-4 border-[#3a1a1a] flex items-center justify-center overflow-hidden">
                  {profilePreview ? (
                    <Image
                      src={profilePreview}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-[#bb3b3b]" />
                  )}
                </div>
                {profilePreview && (
                  <button
                    type="button"
                    onClick={() => removeImage('profile')}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#bb3b3b] rounded-full flex items-center justify-center text-white hover:bg-[#d14d4d] transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'profile')}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg text-[#e0d0d0] hover:bg-[#3a1a1a] transition-colors cursor-pointer"
                >
                  <Camera size={16} />
                  Change Picture
                </label>
                <p className="text-xs text-[#8a6e6e] mt-2">
                  Max 5MB, JPG/PNG
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a]">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#e0d0d0] text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:ring-2 focus:ring-[#bb3b3b]/30 focus:outline-none transition-all"
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label className="block text-[#e0d0d0] text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:ring-2 focus:ring-[#bb3b3b]/30 focus:outline-none transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-[#8a6e6e] mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/profile"
              className="px-6 py-3 bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg text-[#d1c0c0] hover:bg-[#3a1a1a] transition-colors"
            >
              Cancel
            </Link>
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className="px-6 py-3 bg-[#bb3b3b] hover:bg-[#d14d4d] disabled:bg-[#8a2a2a] text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditProfilePage;