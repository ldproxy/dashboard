/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.STATIC_EXPORT === "true" ? "export" : "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config) => {
    if (process.env.STATIC_EXPORT !== "true" || !config.module) {
      return config;
    }
    config.module.rules?.push({
      test: /src\/app\/api/,
      loader: "ignore-loader",
    });
    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Replace with your origin
          },
        ],
      },
    ];
  },
};

export default nextConfig;
