import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

/**
 * We use "force-static" because this page does not rely on user data. This page is publicly identical, meaning,
 * all users (registered and non-registered) will see the same content, same information.
 */
/*export const dynamic = "force-static";
export const revalidate = 30;*/

export default function Post() {
	return (
		<div className="max-w-7xl mx-auto py-12">
			<div className="text-center pb-12">
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
					Worlds' Posts
				</h1>
				<p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
					Dreams, thoughts, moments and memories
				</p>
			</div>
			<LoadPosts />
		</div>
	);
}

async function LoadPosts() {
	"use cache";
	cacheLife("hours");
	cacheTag("post");
	const data = await fetchQuery(api.posts.getPosts);

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{data?.map((post) => (
				<Card key={post._id} className="pt-0">
					<div className="relative h-64 w-full overflow-hidden">
						<Image
							src={
								post.imageUrl ??
								"https://cdn-icons-png.flaticon.com/512/10701/10701484.png"
							}
							alt="image"
							fill
							className="rounded-t-lg object-cover"
						/>
					</div>
					<CardContent>
						<Link href={`/post/${post._id}`}>
							<h1 className="text-2xl font-bold hover:text-primary">
								{post.title}
							</h1>
						</Link>
						<p className="text-muted-foreground line-clamp-3">
							{post.content}
						</p>
					</CardContent>
					<CardFooter>
						<Link
							className={buttonVariants({
								className: "w-full",
							})}
							href={`/post/${post._id}`}
						>
							Read more
						</Link>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

function SkeletonUI() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{[...Array(6)].map((_, i) => (
				<div className="flex flex-col space-y-3" key={i}>
					<Skeleton className="h-48 w-full rounded-xl" />
					<div className="space-y-3 flex flex-col">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-2/3" />
					</div>
				</div>
			))}
		</div>
	);
}
