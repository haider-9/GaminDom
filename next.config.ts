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
    ],
  },
};

export default nextConfig;
