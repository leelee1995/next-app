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
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "scintillating-impala-796.convex.cloud",
				port: "",
				pathname: "/api/storage/**",
			},
		],
	},
};

export default nextConfig;
