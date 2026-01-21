import { CommentSection } from "@/components/comment-section";
import { PostPresence } from "@/components/post-presence";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PostIdProps {
	params: Promise<{ id: Id<"posts"> }>;
}

export default async function PostId({ params }: PostIdProps) {
	const { id } = await params; // param id from the url - from the dynamic route segment [id]
	const token = await getToken();
	const [post, preloadedComments, userId] = await Promise.all([
		await fetchQuery(api.posts.getPostById, { postId: id }),
		await preloadQuery(api.comments.getCommentsByPostId, {
			postId: id,
		}),
		await fetchQuery(api.presence.getUserId, {}, { token }), // Preload presence user ID
	]);

	if (!userId) return redirect("/auth/sign-in");

	if (!post) {
		return (
			<div>
				<h1 className="text-6xl font-extrabold text-red-500 py-20">
					No post found
				</h1>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
			<Link
				href="/post"
				className={buttonVariants({
					variant: "outline",
					className: "mb-4",
				})}
			>
				<ArrowLeft className="size-4" /> Back to post
			</Link>
			<div className="relative w-full h-128 mb-8 rounded-xl overflow-hidden shadow-sm">
				<Image
					src={
						post.imageUrl ??
						"https://cdn-icons-png.flaticon.com/512/10701/10701484.png"
					}
					fill
					alt={post.title}
					loading="eager"
					className="object-cover hover:scale-105 transition-transform duration-500"
				/>
			</div>
			<div className="space-y-4 flex flex-col">
				<h1 className="text-4xl font-bold tracking-tight text-foreground">
					{post.title}
				</h1>

				<div>
					<p className="text-sm text-muted-foreground">
						Posted on:{" "}
						{new Date(post._creationTime).toLocaleDateString(
							"en-US",
						)}
					</p>
					{userId && (
						<PostPresence roomId={post._id} userId={userId} />
					)}
				</div>
				<Separator />

				<p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
					{post.content}
				</p>

				<CommentSection preloadedComments={preloadedComments} />
			</div>
		</div>
	);
}
