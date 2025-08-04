"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import LatestGameCard from "@/components/LatestGameCard";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: Array<{ name: string }>;
  platforms: Array<{ platform: { name: string } }>;
  metacritic: number;
  playtime?: number;
  added?: number;
}

interface Creator {
  id: number;
  name: string;
  slug: string;
  image: string;
  games_count: number;
  positions: Array<{ id: number; name: string; slug: string }>;
  games: Game[];
}

const Page = () => {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 24;

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

        const response = await fetch(
          `https://api.rawg.io/api/creators?key=${apiKey}&page_size=${itemsPerPage}&page=${currentPage}`
        );

        if (!response.ok) throw new Error("Failed to fetch creators");

        const data = await response.json();
        setCreators(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-black/40 rounded-3xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 bg-black/50 rounded-3xl p-6">
        <h1 className="text-4xl font-bold text-white">Creator Games</h1>
        <p className="text-white/70">
          Displaying top games from {totalCount.toLocaleString()} creators
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {creators.map((creator) => (
          <React.Fragment key={creator.id}>
            {creator.games.slice(0, 1).map((game) => (
              <LatestGameCard
                key={game.id}
                game={{
                  ...game,
                  background_image: creator.image,
                  genres: [{ name: creator.positions[0]?.name || "Unknown" }],
                  platforms: [],
                  rating: 4.5,
                  released: "2020-01-01",
                  metacritic: 80,
                }}
                onClick={() => router.push(`/creators/${creator.id}`)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default Page;
