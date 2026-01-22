import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "https://superb-fly-726.convex.cloud",
				port: "",
			},
		],
	},
};

export default nextConfig;
