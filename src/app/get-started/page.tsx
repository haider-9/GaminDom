"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/lib/toast-config";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GamepadIcon,
  ArrowRight,
  UserPlus,
  LogIn,
  ArrowLeft,
  Camera,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import Link from "next/link";

const GetStartedPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
    bannerImage: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
          setImagePreview(base64String);
          setFormData(prev => ({
            ...prev,
            profileImage: base64String
          }));
        } else {
          setBannerPreview(base64String);
          setFormData(prev => ({
            ...prev,
            bannerImage: base64String
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          showToast.error("Passwords don't match");
          return;
        }
        if (formData.password.length < 6) {
          showToast.error("Password must be at least 6 characters");
          return;
        }
      }

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            profileImage: formData.profileImage,
            bannerImage: formData.bannerImage,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success(
          isLogin ? "Welcome back!" : "Account created successfully!"
        );
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Dispatch custom event to notify components about auth change
        window.dispatchEvent(new Event('authChange'));
        
        router.push("/");
      } else {
        showToast.error(data.error || "Something went wrong");
      }
    } catch {
      showToast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: "",
      bannerImage: "",
    });
    setImagePreview("");
    setBannerPreview("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl shadow-xl overflow-hidden border border-primary"
        >
          <div className="p-10">
            {/* Logo and Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 mx-auto mb-6 accent-bg rounded-2xl flex items-center justify-center shadow-md"
              >
                <GamepadIcon size={32} className="text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-primary mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-secondary">
                  {isLogin
                    ? "Sign in to continue your gaming journey"
                    : "Join our gaming community today"}
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Banner Image Upload */}
                      <div className="space-y-2">
                        <label className="text-[#e0d0d0] text-sm font-medium">
                          Banner Image (Optional)
                        </label>
                        <div className="relative">
                          <div className="w-full h-24 bg-[#2a1a1a] border-2 border-dashed border-[#3a1a1a] rounded-lg flex items-center justify-center overflow-hidden">
                            {bannerPreview ? (
                              <Image
                                src={bannerPreview}
                                alt="Banner preview"
                                width={400}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <ImageIcon size={20} className="text-[#bb3b3b] mx-auto mb-1" />
                                <p className="text-[#8a6e6e] text-xs">Upload banner</p>
                              </div>
                            )}
                          </div>
                          {bannerPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setBannerPreview("");
                                setFormData(prev => ({ ...prev, bannerImage: "" }));
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-[#bb3b3b] rounded-full flex items-center justify-center text-white hover:bg-[#d14d4d] transition-colors"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <div className="mt-2">
                            <input
                              type="file"
                              id="bannerImage"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'banner')}
                              className="hidden"
                            />
                            <label
                              htmlFor="bannerImage"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg text-[#e0d0d0] hover:bg-[#3a1a1a] transition-colors cursor-pointer text-sm"
                            >
                              <Upload size={14} />
                              Choose Banner
                            </label>
                            <p className="text-xs text-[#8a6e6e] mt-1">
                              1200x300px recommended, Max 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Image Upload */}
                      <div className="space-y-2">
                        <label className="text-[#e0d0d0] text-sm font-medium">
                          Profile Picture (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-[#2a1a1a] border-2 border-[#3a1a1a] flex items-center justify-center overflow-hidden">
                              {imagePreview ? (
                                <Image
                                  src={imagePreview}
                                  alt="Profile preview"
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={24} className="text-[#bb3b3b]" />
                              )}
                            </div>
                            {imagePreview && (
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview("");
                                  setFormData(prev => ({ ...prev, profileImage: "" }));
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-[#bb3b3b] rounded-full flex items-center justify-center text-white hover:bg-[#d14d4d] transition-colors"
                              >
                                <X size={12} />
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
                              Choose Image
                            </label>
                            <p className="text-xs text-[#8a6e6e] mt-1">
                              Max 5MB, JPG/PNG
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Username Field */}
                      <div className="space-y-2">
                        <label className="text-[#e0d0d0] text-sm font-medium">
                          Username
                        </label>
                        <div className="relative">
                          <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bb3b3b]"
                          />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required={!isLogin}
                            className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-xl pl-12 pr-4 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:ring-2 focus:ring-[#bb3b3b]/30 focus:outline-none transition-all duration-300"
                            placeholder="Choose a username"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[#e0d0d0] text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bb3b3b]"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-xl pl-12 pr-4 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:ring-2 focus:ring-[#bb3b3b]/30 focus:outline-none transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-[#e0d0d0] text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bb3b3b]"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-xl pl-12 pr-12 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:ring-2 focus:ring-[#bb3b3b]/30 focus:outline-none transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bb3b3b] hover:text-[#d14d4d] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="confirmPassword"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="text-[#e0d0d0] text-sm font-medium">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bb3b3b]"
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-xl pl-12 pr-12 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:ring-2 focus:ring-[#bb3b3b]/30 focus:outline-none transition-all duration-300"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bb3b3b] hover:text-[#d14d4d] transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-[#bb3b3b] hover:bg-[#d14d4d] disabled:bg-[#8a2a2a] text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-8 text-center">
                <p className="text-[#d1c0c0] text-sm mb-2">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </p>
                <button
                  onClick={toggleMode}
                  className="text-[#bb3b3b] hover:text-[#d14d4d] font-semibold text-sm transition-colors"
                >
                  {isLogin ? "Create one here" : "Sign in instead"}
                </button>
              </div>

              {/* Demo Credentials */}
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 p-4 bg-[#2a1a1a] border border-[#3a1a1a] rounded-xl text-center"
                >
                  <p className="text-[#bb3b3b] text-xs font-medium mb-2">
                    Demo Credentials:
                  </p>
                  <p className="text-[#d1c0c0] text-xs">
                    Email: demo@gamindom.com
                    <br />
                    Password: demo123
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GetStartedPage;
