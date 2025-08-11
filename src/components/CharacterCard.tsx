"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  GamepadIcon,
  Trash2,
  Tag,
  Heart,
} from "lucide-react";

interface Character {
  _id?: string;
  name: string;
  gameId: string;
  gameTitle: string;
  description?: string;
  image?: string;
  aliases?: string[];
  gender?: string;
  origin?: string;
  giantBombId?: string;
  rawgId?: string;
}

interface CharacterCardProps {
  character: Character;
  index?: number;
  onRemove?: (characterId: string) => void;
  showRemoveButton?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  index = 0,
  onRemove,
  showRemoveButton = true,
}) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (character._id && onRemove) {
      onRemove(character._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative bg-[#1a0a0a] rounded-2xl border border-[#3a1a1a] overflow-hidden hover:border-[#bb3b3b] transition-all duration-300 hover:shadow-lg hover:shadow-[#bb3b3b]/10"
    >
      {/* Character Image */}
      <div className="relative h-40 overflow-hidden">
        {character.image ? (
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-character.svg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a1a1a] to-[#3a1a1a] flex items-center justify-center">
            <User size={40} className="text-[#8a6e6e]" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {showRemoveButton && character._id && onRemove && (
            <button
              onClick={handleRemove}
              className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-all duration-200"
              title="Remove from favorites"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {/* Favorite Indicator */}
        <div className="absolute top-2 left-2 bg-[#bb3b3b]/90 text-white p-1.5 rounded-full">
          <Heart size={10} className="fill-current" />
        </div>

        {/* Character Name Overlay */}
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow-lg">
            {character.name}
          </h3>
        </div>
      </div>

      {/* Character Info */}
      <div className="p-3">
        {/* Game Info */}
        <div className="flex items-center gap-2 mb-2">
          <GamepadIcon size={12} className="text-[#bb3b3b] flex-shrink-0" />
          <span className="text-xs text-[#d1c0c0] line-clamp-1">
            {character.gameTitle}
          </span>
        </div>

        {/* Character Details - Compact */}
        <div className="flex items-center gap-3 text-xs text-[#8a6e6e] mb-3">
          {character.gender && (
            <div className="flex items-center gap-1">
              <User size={10} />
              <span>{character.gender}</span>
            </div>
          )}
          {character.aliases && character.aliases.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag size={10} />
              <span className="line-clamp-1">{character.aliases[0]}</span>
            </div>
          )}
        </div>

        {/* Action Button - Compact */}
        {character.giantBombId && (
          <Link
            href={`/character/${character.giantBombId}`}
            className="w-full bg-[#2a1a1a] hover:bg-[#bb3b3b] text-[#d1c0c0] hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 text-center block"
          >
            View Details
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default CharacterCard;