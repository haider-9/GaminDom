"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, Share2, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
}

interface NewsArticleProps {
  articleId: string;
}

const NewsArticle = ({ articleId }: NewsArticleProps) => {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // Mock article data - in real app, this would come from an API
        const mockArticle: Article = {
          id: articleId,
          title: "Cyberpunk 2077: Phantom Liberty Expansion Breaks Sales Records",
          content: `
            <p>CD Projekt RED's latest expansion for Cyberpunk 2077, titled "Phantom Liberty," has exceeded all expectations by selling over 3 million copies in its first week of release. This remarkable achievement marks a significant milestone for the Polish game developer, demonstrating the franchise's resilience and the community's continued faith in the Cyberpunk universe.</p>

            <h2>A Triumphant Return</h2>
            <p>The expansion, which features Keanu Reeves reprising his role as Johnny Silverhand, introduces players to a gripping spy-thriller storyline set in the dangerous district of Dogtown. With enhanced gameplay mechanics, improved AI, and stunning visual upgrades, Phantom Liberty represents the culmination of years of post-launch improvements to the base game.</p>

            <h2>Critical Acclaim</h2>
            <p>Critics have praised the expansion for its compelling narrative, improved performance, and the seamless integration of new content with the existing game world. The expansion currently holds a Metacritic score of 89, with many reviewers highlighting the mature storytelling and refined gameplay experience.</p>

            <h2>Technical Improvements</h2>
            <p>Beyond the new content, Phantom Liberty brings significant technical enhancements to Cyberpunk 2077. The expansion includes ray tracing improvements, better crowd AI, enhanced vehicle handling, and numerous quality-of-life improvements that benefit both new and returning players.</p>

            <h2>Looking Forward</h2>
            <p>With the success of Phantom Liberty, CD Projekt RED has announced plans for future content updates and has begun pre-production on the next Cyberpunk game, built on Unreal Engine 5. The company's commitment to the franchise appears stronger than ever, promising exciting developments for fans of the cyberpunk genre.</p>
          `,
          excerpt: "CD Projekt RED's latest expansion for Cyberpunk 2077 has exceeded all expectations, selling over 3 million copies in its first week.",
          image: "/assets/news/cyberpunk-news.jpg",
          author: "Alex Chen",
          date: "2024-01-15",
          category: "Industry News",
          readTime: "5 min read",
          tags: ["Cyberpunk 2077", "CD Projekt RED", "Expansion", "Sales"],
          views: 125000,
          likes: 2340,
          comments: 456
        };

        setTimeout(() => {
          setArticle(mockArticle);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleLike = () => {
    setLiked(!liked);
    if (article) {
      setArticle({
        ...article,
        likes: liked ? article.likes - 1 : article.likes + 1
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-black/50 rounded-3xl w-32 animate-pulse"></div>
        <div className="h-64 bg-black/50 rounded-3xl animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-12 bg-black/50 rounded-3xl animate-pulse"></div>
          <div className="h-6 bg-black/50 rounded-3xl w-3/4 animate-pulse"></div>
          <div className="h-4 bg-black/50 rounded-3xl w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
        <p className="text-white/70 mb-6">The article you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/news')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Back to News
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Article Header */}
      <header className="mb-8">
        {/* Category Badge */}
        <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
          {article.category}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-white/80 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600" />
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div 
          className="text-white/90 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="bg-white/10 text-white/80 px-3 py-2 rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Article Actions */}
      <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl mb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              liked 
                ? "bg-red-600 text-white" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span>{article.likes.toLocaleString()}</span>
          </button>
          
          <div className="flex items-center gap-2 text-white/80">
            <MessageCircle className="w-5 h-5" />
            <span>{article.comments} comments</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/80">
            <span>{article.views.toLocaleString()} views</span>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Related Articles */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 bg-black/20 rounded-3xl hover:bg-black/30 transition-colors cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl mb-4"></div>
              <h3 className="text-white font-semibold mb-2">Related Article Title {i}</h3>
              <p className="text-white/70 text-sm">Brief description of the related article...</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default NewsArticle;