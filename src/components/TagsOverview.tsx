"use client";
import React, { useState, useEffect } from "react";
import { Hash, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface Tag {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
  description?: string;
}

const TagsOverview = () => {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        
        const response = await fetch(
          `https://api.rawg.io/api/tags?key=${apiKey}&page_size=50&ordering=-games_count`
        );

        if (!response.ok) throw new Error("Failed to fetch tags");

        const data = await response.json();
        setTags(data.results);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-12 bg-black/50 rounded-3xl w-64 animate-pulse mb-4"></div>
          <div className="h-6 bg-black/50 rounded-3xl w-96 animate-pulse mb-6"></div>
          <div className="flex gap-4 mb-6">
            <div className="h-10 bg-black/50 rounded-3xl w-64 animate-pulse"></div>
            <div className="h-10 bg-black/50 rounded-3xl w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-32 bg-black/50 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 bg-black/50 rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <Hash className="text-blue-500" size={40} />
          <div>
            <h1 className="text-4xl font-bold text-white">Game Tags</h1>
            <p className="text-white/70 mt-2">Discover games by popular tags and themes</p>
          </div>
        </div>

        

        {/* Stats */}
        <div className="flex items-center gap-6 text-white/70">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>{filteredTags.length} tags found</span>
          </div>
          {searchQuery && (
            <span>Showing results for &quot;{searchQuery}&quot;</span>
          )}
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTags.map((tag, index) => (
          <div
            key={tag.id}
            onClick={() => router.push(`/tags/${tag.slug}`)}
            className="relative group cursor-pointer rounded-3xl overflow-hidden h-32 bg-black/20 hover:bg-black/30 transition-colors"
          >
                        
            {/* Content */}
            <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4" />
                  <h3 className="font-bold text-sm line-clamp-1">{tag.name}</h3>
                </div>
                <p className="text-xs text-white/80">
                  {tag.games_count.toLocaleString()} games
                </p>
              </div>
              
              {/* Popular indicator for top tags */}
              {index < 10 && (
                <div className="flex justify-end">
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                </div>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTags.length === 0 && !loading && (
        <div className="text-center py-12">
          <Hash className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Tags Found</h2>
          <p className="text-white/70 mb-6">
            No tags match your search criteria. Try different keywords.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Popular Tags Section */}
      {!searchQuery && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Most Popular Tags</h2>
          <div className="flex flex-wrap gap-3">
            {tags.slice(0, 15).map((tag) => (
              <button
                key={tag.id}
                onClick={() => router.push(`/tags/${tag.slug}`)}
                className={`px-4 py-2 rounded-full text-white font-semibold transition-all duration-300  bg-black/50 hover:bg-black/70`}
              >
                #{tag.name} ({tag.games_count.toLocaleString()})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsOverview;