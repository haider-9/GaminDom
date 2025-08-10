"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Monitor,
  Moon,
  Sun,
  Save,
  ArrowLeft,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { showToast } from "@/lib/toast-config";
import { useTheme } from "@/contexts/ThemeContext";

const SettingsPage = () => {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    // Profile Settings
    username: "",
    email: "",
    bio: "",

    // Appearance Settings
    theme: theme,
    accentColor: accentColor,
    notifications: true,
    profileVisibility: "public",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setSettings((prev) => ({
          ...prev,
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
        }));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    // Load other settings from localStorage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  const handleSettingChange = (key: string, value: string | boolean) => {
    // Handle theme changes immediately through context
    if (key === "theme" && typeof value === "string") {
      setTheme(value as "dark" | "light" | "auto");
    } else if (key === "accentColor" && typeof value === "string") {
      setAccentColor(
        value as "red" | "blue" | "green" | "purple" | "orange" | "pink"
      );
    }

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to localStorage
      localStorage.setItem("userSettings", JSON.stringify(settings));

      // Update user data if profile settings changed
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          username: settings.username,
          email: settings.email,
          bio: settings.bio,
          id: user.id || user._id, // Ensure id is set
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      showToast.success("Settings saved successfully!");
      setHasChanges(false);
    } catch {
      showToast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      showToast.error("Please type 'DELETE' to confirm");
      return;
    }

    setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const userId = user.id || user._id;

        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Clear all user data
          localStorage.removeItem("user");
          localStorage.removeItem("userSettings");
          showToast.success("Account deleted successfully");
          
          // Redirect to home page
          window.location.href = "/";
        } else {
          const error = await response.json();
          showToast.error(error.error || "Failed to delete account");
        }
      }
    } catch (error) {
      console.error("Delete account error:", error);
      showToast.error("Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirmation("");
    }
  };

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "account", label: "Account", icon: Trash2 },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
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

            {hasChanges && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 accent-bg accent-bg-hover text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </motion.button>
            )}
          </div>

          <div className="bg-surface rounded-xl p-6 border border-primary">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 accent-bg rounded-xl flex items-center justify-center">
                <Settings size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">
                  Settings
                </h1>
                <p className="text-secondary">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-xl p-6 border border-primary sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? "accent-bg text-white"
                          : "text-secondary hover:text-primary hover:bg-surface-hover"
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-xl p-8 border border-primary">
              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Appearance
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-secondary text-sm font-medium mb-3">
                        Theme
                      </label>
                      <div className="flex gap-4">
                        {[
                          { value: "dark", label: "Dark", icon: Moon },
                          { value: "light", label: "Light", icon: Sun },
                          { value: "auto", label: "Auto", icon: Monitor },
                        ].map((themeOption) => {
                          const Icon = themeOption.icon;
                          return (
                            <button
                              key={themeOption.value}
                              onClick={() =>
                                handleSettingChange("theme", themeOption.value)
                              }
                              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                                settings.theme === themeOption.value
                                  ? "accent-bg accent-border text-white"
                                  : "bg-surface border-primary text-secondary hover:text-primary hover:accent-border"
                              }`}
                            >
                              <Icon size={18} />
                              {themeOption.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Accent Color Selection */}
                    <div>
                      <label className="block text-secondary text-sm font-medium mb-3">
                        Accent Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { name: "Red", value: "red", color: "#bb3b3b" },
                          { name: "Blue", value: "blue", color: "#3b7ebb" },
                          { name: "Green", value: "green", color: "#3bbb7e" },
                          { name: "Purple", value: "purple", color: "#7e3bbb" },
                          { name: "Orange", value: "orange", color: "#bb7e3b" },
                          { name: "Pink", value: "pink", color: "#bb3b7e" },
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() =>
                              handleSettingChange("accentColor", color.value)
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                              settings.accentColor === color.value
                                ? "border-primary text-primary"
                                : "border-primary text-secondary hover:text-primary"
                            }`}
                            style={{
                              backgroundColor:
                                settings.accentColor === color.value
                                  ? color.color + "20"
                                  : "transparent",
                            }}
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.color }}
                            />
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Notifications
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-primary">
                      <div>
                        <h3 className="text-primary font-medium">
                          Push Notifications
                        </h3>
                        <p className="text-muted text-sm">
                          Receive notifications about game updates and reviews
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "notifications",
                            !settings.notifications
                          )
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.notifications
                            ? "accent-bg"
                            : "bg-surface border border-primary"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.notifications
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Privacy
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-surface rounded-lg border border-primary">
                      <div className="mb-3">
                        <h3 className="text-primary font-medium">
                          Profile Visibility
                        </h3>
                        <p className="text-muted text-sm">
                          Control who can see your profile and activity
                        </p>
                      </div>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) =>
                          handleSettingChange(
                            "profileVisibility",
                            e.target.value
                          )
                        }
                        className="bg-surface border border-primary rounded-lg px-4 py-2 text-primary focus:accent-border focus:outline-none transition-colors"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Account Settings */}
              {activeTab === "account" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Account Management
                  </h2>

                  <div className="space-y-6">
                    {/* Danger Zone */}
                    <div className="border border-red-500/30 rounded-lg p-6 bg-red-500/5">
                      <div className="flex items-start gap-4">
                        <AlertTriangle className="text-red-500 mt-1" size={24} />
                        <div className="flex-1">
                          <h3 className="text-red-500 font-semibold text-lg mb-2">
                            Danger Zone
                          </h3>
                          <p className="text-secondary mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-xl p-6 border border-red-500/30 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-xl font-bold text-red-500">Delete Account</h3>
            </div>
            
            <p className="text-secondary mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            
            <div className="mb-4">
              <label className="block text-secondary text-sm font-medium mb-2">
                Type DELETE to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full bg-surface border border-primary rounded-lg px-4 py-2 text-primary focus:accent-border focus:outline-none transition-colors"
                placeholder="DELETE"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 px-4 py-2 border border-primary rounded-lg text-secondary hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmation !== "DELETE"}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
