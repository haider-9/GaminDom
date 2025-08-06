"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Save,
  Gamepad2,
  Mail,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { showToast } from "@/lib/toast-config";
import { useTheme } from "@/contexts/ThemeContext";

const SettingsPage = () => {
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    // Profile Settings
    username: "",
    email: "",
    displayName: "",
    bio: "",

    // Appearance Settings (these will be managed by ThemeContext)
    theme: theme,
    accentColor: accentColor,
    fontSize: "medium",
    animations: true,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    gameUpdates: true,
    newsAlerts: false,

    // Privacy Settings
    profileVisibility: "public",
    showEmail: false,
    showActivity: true,
    dataCollection: true,

    // Audio Settings
    soundEffects: true,
    backgroundMusic: false,
    volume: 75,

    // Gaming Preferences
    preferredPlatforms: [],
    favoriteGenres: [],
    maturityRating: "mature",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsed,
          // Ensure strings are never undefined
          username: parsed.username || "",
          email: parsed.email || "",
          displayName: parsed.displayName || "",
          bio: parsed.bio || "",
          // Ensure arrays are never undefined
          preferredPlatforms: parsed.preferredPlatforms || [],
          favoriteGenres: parsed.favoriteGenres || [],
        }));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  const handleSettingChange = (key: string, value: string | boolean | number | string[]) => {
    // Handle theme and accent color changes immediately through context
    if (key === "theme" && typeof value === "string") {
      setTheme(value as "dark" | "light" | "auto");
    } else if (key === "accentColor" && typeof value === "string") {
      setAccentColor(value as "red" | "blue" | "green" | "purple" | "orange" | "pink");
    }

    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem("userSettings", JSON.stringify(settings));
      showToast.success("Settings saved successfully!");
      setHasChanges(false);
    } catch {
      showToast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "audio", label: "Audio", icon: Volume2 },
    { id: "gaming", label: "Gaming", icon: Gamepad2 },
  ];

  const accentColors = [
    { name: "Red", value: "red", color: "#bb3b3b" },
    { name: "Blue", value: "blue", color: "#3b7ebb" },
    { name: "Green", value: "green", color: "#3bbb7e" },
    { name: "Purple", value: "purple", color: "#7e3bbb" },
    { name: "Orange", value: "orange", color: "#bb7e3b" },
    { name: "Pink", value: "pink", color: "#bb3b7e" },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
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

            <div className="flex items-center gap-4">
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3"
                >
                  
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 accent-bg hover:accent-bg-hover text-white rounded-2xl transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 accent-bg rounded-2xl flex items-center justify-center">
                <Settings size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">Settings</h1>
                <p className="text-secondary">Customize your Gamindom experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          {/* Mobile Tab Selector */}
          <div className="lg:hidden">
            <div className="bg-surface rounded-3xl p-4">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors whitespace-nowrap text-sm ${activeTab === tab.id
                        ? "accent-bg text-white"
                        : "text-secondary hover:text-primary hover:bg-surface-hover"
                        }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-surface rounded-3xl p-6 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-left ${activeTab === tab.id
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
            <div className="bg-surface rounded-3xl p-8">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">Profile Settings</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-secondary text-sm font-medium mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 accent-primary" />
                        <input
                          type="text"
                          value={settings.username || ""}
                          onChange={(e) => handleSettingChange("username", e.target.value)}
                          className="w-full bg-surface border border-primary rounded-2xl pl-10 pr-4 py-3 text-primary placeholder-muted focus:accent-border focus:outline-none transition-colors"
                          placeholder="Enter username"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-secondary text-sm font-medium mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bb3b3b]" />
                        <input
                          type="email"
                          value={settings.email || ""}
                          onChange={(e) => handleSettingChange("email", e.target.value)}
                          className="w-full bg-surface border border-primary rounded-2xl pl-10 pr-4 py-3 text-primary placeholder-muted focus:accent-border focus:outline-none transition-colors"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-secondary text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={settings.displayName || ""}
                      onChange={(e) => handleSettingChange("displayName", e.target.value)}
                      className="w-full bg-surface border border-primary rounded-2xl px-4 py-3 text-primary placeholder-muted focus:accent-border focus:outline-none transition-colors"
                      placeholder="How others see your name"
                    />
                  </div>

                  <div>
                    <label className="block text-secondary text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      value={settings.bio || ""}
                      onChange={(e) => handleSettingChange("bio", e.target.value)}
                      rows={4}
                      className="w-full bg-surface border border-primary rounded-2xl px-4 py-3 text-primary placeholder-muted focus:accent-border focus:outline-none transition-colors resize-none"
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-primary mb-6">Appearance Settings</h2>

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
                              onClick={() => handleSettingChange("theme", themeOption.value)}
                              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-colors ${settings.theme === themeOption.value
                                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                                : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                                }`}
                            >
                              <Icon size={18} />
                              {themeOption.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-secondary text-sm font-medium mb-3">
                        Accent Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {accentColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleSettingChange("accentColor", color.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-colors ${settings.accentColor === color.value
                              ? "border-[var(--color-text)] text-[var(--color-text)]"
                              : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                              }`}
                            style={{
                              backgroundColor: settings.accentColor === color.value ? color.color : "transparent"
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

                    <div>
                      <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-3">
                        Font Size
                      </label>
                      <select
                        value={settings.fontSize || "medium"}
                        onChange={(e) => handleSettingChange("fontSize", e.target.value)}
                        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-4 py-3 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    {/* Theme Preview */}
                    <div>
                      <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-3">
                        Preview
                      </label>
                      <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            <Palette size={20} className="text-white" />
                          </div>
                          <div>
                            <h4 className="text-[var(--color-text)] font-medium">Theme Preview</h4>
                            <p className="text-[var(--color-text-secondary)] text-sm">
                              Current theme: {settings.theme} • Accent: {settings.accentColor}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[var(--color-text)] font-medium">Animations</h3>
                        <p className="text-[var(--color-text-muted)] text-sm">Enable smooth transitions and effects</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange("animations", !settings.animations)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.animations ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface)]"
                          }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-[var(--color-text)] rounded-full transition-transform ${settings.animations ? "translate-x-7" : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Add other tab content here... */}
              {/* For brevity, I'll add a few more key sections */}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>

                  <div className="space-y-4">
                    {[
                      { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                      { key: "pushNotifications", label: "Push Notifications", desc: "Browser notifications" },
                      { key: "gameUpdates", label: "Game Updates", desc: "New releases and updates" },
                      { key: "newsAlerts", label: "News Alerts", desc: "Gaming news and articles" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-black/30 rounded-2xl">
                        <div>
                          <h3 className="text-white font-medium">{item.label}</h3>
                          <p className="text-white/50 text-sm">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                          className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? "bg-[#bb3b3b]" : "bg-black/30"
                            }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[item.key as keyof typeof settings] ? "translate-x-7" : "translate-x-1"
                              }`}
                          />
                        </button>
                      </div>
                    ))}
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
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-black/30 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">Profile Visibility</h3>
                      </div>
                      <p className="text-white/50 text-sm mb-3">Control who can see your profile</p>
                      <select
                        value={settings.profileVisibility || "public"}
                        onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                        className="bg-surface border border-primary rounded-2xl px-4 py-2 text-primary focus:accent-border focus:outline-none transition-colors"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {[
                      { key: "showEmail", label: "Show Email", desc: "Display email on your profile" },
                      { key: "showActivity", label: "Show Activity", desc: "Let others see your gaming activity" },
                      { key: "dataCollection", label: "Data Collection", desc: "Allow data collection for personalized recommendations" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-black/30 rounded-2xl">
                        <div>
                          <h3 className="text-white font-medium">{item.label}</h3>
                          <p className="text-white/50 text-sm">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                          className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? "bg-[#bb3b3b]" : "bg-black/30"
                            }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[item.key as keyof typeof settings] ? "translate-x-7" : "translate-x-1"
                              }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Audio Settings */}
              {activeTab === "audio" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Audio Settings</h2>

                  <div className="space-y-6">
                    <div className="p-4 bg-black/30 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium">Master Volume</h3>
                        <span className="text-white/70 text-sm">{settings.volume}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <VolumeX size={18} className="text-white/50" />
                        <div className="flex-1 relative">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.volume || 75}
                            onChange={(e) => handleSettingChange("volume", parseInt(e.target.value))}
                            className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${settings.volume}%, var(--color-surface) ${settings.volume}%, var(--color-surface) 100%)`
                            }}
                          />
                        </div>
                        <Volume2 size={18} className="text-white/50" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: "soundEffects", label: "Sound Effects", desc: "UI sounds and button clicks" },
                        { key: "backgroundMusic", label: "Background Music", desc: "Ambient music while browsing" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-black/30 rounded-2xl">
                          <div>
                            <h3 className="text-white font-medium">{item.label}</h3>
                            <p className="text-white/50 text-sm">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? "bg-[#bb3b3b]" : "bg-black/30"
                              }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[item.key as keyof typeof settings] ? "translate-x-7" : "translate-x-1"
                                }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default SettingsPage;