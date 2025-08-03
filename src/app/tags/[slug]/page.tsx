import React from "react";
import TagGamesGrid from "@/components/TagGamesGrid";

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const TagPage = async ({ params }: TagPageProps) => {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TagGamesGrid tagSlug={slug} />
      </div>
      
      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default TagPage;