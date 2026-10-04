import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vbteadl6m3.ufs.sh",
      },
      { protocol: "https", hostname: "logo.clearbit.com" },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "scontent-lhr8-2.xx.fbcdn.net",
      },

    ],
  },
  experimental:{
    typedEnv: true
  },
  // Bookings and enquiries moved into the student dashboard. Old links
  // (emails already sent, bookmarks) keep working; the query string, and so
  // the success banner's reference, is carried over.
  async redirects() {
    return [
      {
        source: "/bookings",
        has: [{ type: "query", key: "enquired" }],
        destination: "/dashboard/student/enquiries",
        permanent: true,
      },
      {
        source: "/bookings",
        destination: "/dashboard/student/bookings",
        permanent: true,
      },
    ];
  },
  // cacheComponents: true,
};

export default nextConfig;
