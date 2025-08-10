import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "media.rawg.io",
        port: "",
        pathname: "/media/screenshots/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.giantbomb.com",
        port: "",
        pathname: "/a/uploads/**",
      },
      // News image sources
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bleedingcool.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.mos.cms.futurecdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.gamespot.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.vox-cdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.gamespot.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sm.ign.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets-prd.ignimgs.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kotaku.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.kinja-img.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "techcrunch.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wp.techcrunch.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s.yimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.cnn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.arstechnica.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.engadget.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s.aolcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "polygon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.polygon.com",
        port: "",
        pathname: "/**",
      },
      // Additional common news domains
      {
        protocol: "https",
        hostname: "www.theverge.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "duet-cdn.vox-cdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.pcgamer.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gamesindustry.biz",
        port: "",
        pathname: "/**",
      },
    ],
    // Allow all external images (less secure but more flexible for news)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;
