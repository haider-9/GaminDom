"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  Globe,
  ExternalLink,
  Gamepad2,
  Users,
  MapPin,
  Tag,
  Heart,
  Share2,
  Hash,
} from "lucide-react";
import Link from "next/link";

interface Character {
  id: number;
  name: string;
  real_name?: string;
  deck?: string;
  description?: string;
  birthday?: string;
  image?: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
  };
  aliases?: string;
  gender?: number;
  site_detail_url: string;
  api_detail_url: string;
  games?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  concepts?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  locations?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  friends?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  enemies?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
}

const CharacterPage = () => {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type CharacterResponse = {
    character: Character | null;
  };

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        setLoading(true);
        const { characterApi } = await import("@/lib/api-client");
        const response = await characterApi.getCharacterDetails(characterId) as CharacterResponse;
        if (response.character) {
          setCharacter(response.character);
        } else {
          throw new Error("Character not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (characterId) {
      fetchCharacterDetails();
    }
  }, [characterId]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-black/50 rounded-3xl w-32 mb-6"></div>
            <div className="h-96 bg-black/50 rounded-3xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-black/50 rounded-3xl w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-black/50 rounded-3xl"></div>
                  <div className="h-4 bg-black/50 rounded-3xl w-5/6"></div>
                  <div className="h-4 bg-black/50 rounded-3xl w-4/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-black/50 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-black/50 rounded-3xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">
            Character Not Found
          </h1>
          <p className="text-white/70 mb-6">
            {error || "The requested character could not be found."}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#bb3b3b] hover:bg-[#bb3b3b]/80 text-white px-6 py-3 rounded-3xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getGenderText = (gender?: number) => {
    switch (gender) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-black/50 rounded-3xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-black/30 hover:bg-red-500/70 rounded-full transition-colors">
              <Heart size={20} className="text-white" />
            </button>
            <button className="p-2 bg-black/30 hover:bg-blue-500/70 rounded-full transition-colors">
              <Share2 size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Hero Card */}
        <div className="bg-black/50 rounded-3xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Character Image */}
            <div className="w-full lg:w-80 h-80 rounded-3xl relative">
              {character.image?.super_url ? (
                <Image
                  src={character.image.super_url}
                  alt={character.name}
                  fill
                  className="object-contain lg:object-cover rounded-3xl object-center lg:object-top max-w-fit lg:max-w-full mx-auto drop-shadow-2xl lg:drop-shadow-none drop-shadow-red-500/20 border-2 lg:border-none border-red-500/20"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#4b2323] to-[#bb3b3b]/60 flex items-center justify-center">
                  <User size={80} className="text-white" />
                </div>
              )}
            </div>

            {/* Character Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">
                {character.name}
              </h1>

              {character.real_name &&
                character.real_name !== character.name && (
                  <p className="text-xl text-white/70 mb-4">
                    Real Name: {character.real_name}
                  </p>
                )}

              {character.deck && (
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  {character.deck}
                </p>
              )}

              {/* Character Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.birthday && (
                  <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-2xl">
                    <Calendar size={16} className="text-blue-400" />
                    <span className="text-white/70">Born:</span>
                    <span className="text-white">
                      {formatDate(character.birthday)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-2xl">
                  <User size={16} className="text-green-400" />
                  <span className="text-white/70">Gender:</span>
                  <span className="text-white">
                    {getGenderText(character.gender)}
                  </span>
                </div>

                {character.aliases && (
                  <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-2xl md:col-span-2">
                    <Tag size={16} className="text-purple-400" />
                    <span className="text-white/70">Aliases:</span>
                    <span className="text-white">{character.aliases}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {character.description && (
              <div className="bg-black/50 rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Biography
                </h2>
                <div
                  className="text-white/70 leading-relaxed prose prose-invert max-w-none prose-rose prose-h2:text-rose-400 prose-li:mb-8"
                  dangerouslySetInnerHTML={{ __html: character.description }}
                />
              </div>
            )}

            {/* Games */}
            {character.games && character.games.length > 0 && (
              <div className="bg-black/50 rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gamepad2 size={24} />
                  Appears In Games
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {character.games.slice(0, 8).map((game) => (
                    <Link
                      href={`/search/${game.name}`}
                      key={game.id}
                      className="bg-black/30 rounded-2xl p-4 hover:bg-black/40 transition-colors"
                    >
                      <h3 className="text-white font-semibold mb-2">
                        {game.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Concepts */}
            {character.concepts && character.concepts.length > 0 && (
              <div className="bg-black/50 rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Related Concepts
                </h2>
                <div className="flex flex-wrap gap-2">
                  {character.concepts.slice(0, 10).map((concept) => (
                    <Link
                      key={concept.id}
                      href={`/tags/${concept.name}`}
                      rel="noopener noreferrer"
                      className="bg-black/30 text-white/70 px-3 py-1 rounded-full text-sm border border-white/20 hover:bg-black/40 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <Hash className="w-4 h-4" />
                      {concept.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Relationships */}
            {((character.friends && character.friends.length > 0) ||
              (character.enemies && character.enemies.length > 0)) && (
                <div className="bg-black/50 rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users size={20} />
                    Relationships
                  </h3>
                  <div className="space-y-4">
                    {character.friends && character.friends.length > 0 && (
                      <div>
                        <h4 className="text-green-400 font-semibold mb-2">
                          Friends
                        </h4>
                        <div className="space-y-2">
                          {character.friends.slice(0, 5).map((friend) => (
                            <Link
                              key={friend.id}
                              href={`/character/${friend.id}`}
                              className="block bg-black/30 rounded-2xl p-3 hover:bg-black/40 transition-colors"
                            >
                              <span className="text-white/70 hover:text-white">
                                {friend.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {character.enemies && character.enemies.length > 0 && (
                      <div>
                        <h4 className="text-red-400 font-semibold mb-2">
                          Enemies
                        </h4>
                        <div className="space-y-2">
                          {character.enemies.slice(0, 5).map((enemy) => (
                            <Link
                              key={enemy.id}
                              href={`/character/${enemy.id}`}
                              className="block bg-black/30 rounded-2xl p-3 hover:bg-black/40 transition-colors"
                            >
                              <span className="text-white/70 hover:text-white">
                                {enemy.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Locations */}
            {character.locations && character.locations.length > 0 && (
              <div className="bg-black/50 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Locations
                </h3>
                <div className="space-y-2">
                  {character.locations.slice(0, 5).map((location) => (
                    <a
                      key={location.id}
                      href={location.site_detail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors group"
                    >
                      <MapPin size={16} className="text-blue-400" />
                      <span className="text-white/70 group-hover:text-white">
                        {location.name}
                      </span>
                      <ExternalLink
                        size={14}
                        className="text-white/50 ml-auto"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            <div className="bg-black/50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Links</h3>
              <div className="space-y-2">
                <a
                  href={character.site_detail_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-black/30 rounded-2xl hover:bg-black/40 transition-colors group"
                >
                  <Globe size={16} className="text-blue-400" />
                  <span className="text-white/70 group-hover:text-white">
                    GiantBomb Page
                  </span>
                  <ExternalLink size={14} className="text-white/50 ml-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
