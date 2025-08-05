"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    });
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
                      key="username"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="text-secondary text-sm font-medium">
                        Username
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 accent-primary"
                        />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full bg-surface border border-primary rounded-xl pl-12 pr-4 py-3 text-primary placeholder-muted focus:accent-border focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:outline-none transition-all duration-300"
                          placeholder="Choose a username"
                        />
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
