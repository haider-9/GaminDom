"use client";
import React from "react";
import { 
  Gamepad2, 
  Trophy, 
  Cpu, 
  Zap, 
  Globe, 
  Star,
  Monitor,
  Headphones
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  articleCount: number;
  description: string;
}

const NewsCategories = () => {
  const router = useRouter();

  const categories: Category[] = [
    {
      id: "reviews",
      name: "Reviews",
      icon: <Star className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500",
      articleCount: 156,
      description: "Game reviews and ratings"
    },
    {
      id: "hardware",
      name: "Hardware",
      icon: <Cpu className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      articleCount: 89,
      description: "Latest gaming hardware"
    },
    {
      id: "esports",
      name: "Esports",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-red-500 to-pink-500",
      articleCount: 234,
      description: "Competitive gaming news"
    },
    {
      id: "indie",
      name: "Indie Games",
      icon: <Gamepad2 className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      articleCount: 178,
      description: "Independent game coverage"
    },
    {
      id: "industry",
      name: "Industry",
      icon: <Globe className="w-6 h-6" />,
      color: "from-purple-500 to-violet-500",
      articleCount: 145,
      description: "Gaming industry news"
    },
    {
      id: "tech",
      name: "Technology",
      icon: <Zap className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-500",
      articleCount: 92,
      description: "Gaming technology trends"
    },
    {
      id: "streaming",
      name: "Streaming",
      icon: <Monitor className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
      articleCount: 67,
      description: "Game streaming and content"
    },
    {
      id: "audio",
      name: "Audio & Music",
      icon: <Headphones className="w-6 h-6" />,
      color: "from-teal-500 to-green-500",
      articleCount: 43,
      description: "Game audio and soundtracks"
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Browse by Category</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => router.push(`/news/category/${category.id}`)}
            className="relative group cursor-pointer rounded-3xl overflow-hidden p-6 h-32 hover:scale-105 transition-all duration-300"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between text-white">
              <div className="flex items-center gap-3">
                {category.icon}
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.articleCount} articles</p>
                </div>
              </div>
              
              <p className="text-xs text-white/90 mt-2">
                {category.description}
              </p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCategories;