/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https", // or http
          hostname: "utfs.io", // if your website has no www, drop it
        },
        {
          protocol: "https", // or http
          hostname: "i.ibb.co", // if your website has no www, drop it
        },
        {
          protocol: "https", // or http
          hostname: "www.rcpit.ac.in", // if your website has no www, drop it
        },

        
      ],
    },
  };

export default nextConfig;
