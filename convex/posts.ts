import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";
import { title } from "process";

export const createPost = mutation({
	args: {
		title: v.string(),
		content: v.string(),
		imageStorageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) throw new ConvexError("Not authenticated!");

		const post = await ctx.db.insert("posts", {
			content: args.content,
			title: args.title,
			authorId: user._id,
			imageStorageId: args.imageStorageId,
		});

		return post;
	},
});

export const getPosts = query({
	args: {},
	handler: async (ctx) => {
		const posts = await ctx.db.query("posts").order("desc").collect();

		return await Promise.all(
			posts.map(async (post) => {
				const resolveImageUrl =
					post.imageStorageId !== undefined
						? await ctx.storage.getUrl(post.imageStorageId)
						: null;

				return { ...post, imageUrl: resolveImageUrl };
			}),
		);
	},
});

export const generateImmageUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) throw new ConvexError("Not authenticated!");

		return await ctx.storage.generateUploadUrl();
	},
});

export const getPostById = query({
	args: {
		postId: v.id("posts"),
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.postId);

		if (!post) return null;

		const resolvedImageUrl =
			post?.imageStorageId !== undefined
				? await ctx.storage.getUrl(post.imageStorageId)
				: null;
		return {
			...post,
			imageUrl: resolvedImageUrl,
		};
	},
});

interface searchResultTypes {
	_id: string;
	title: string;
	content: string;
}
export const searchPost = query({
	args: {
		term: v.string(),
		limit: v.number(),
	},
	handler: async (ctx, args) => {
		const limit = args.limit;
		const results: Array<searchResultTypes> = [];
		const seen = new Set();
		const pushDocs = async (docs: Array<Doc<"posts">>) => {
			for (const doc of docs) {
				seen.add(doc._id);

				results.push({
					_id: doc._id,
					title: doc.title,
					content: doc.content,
				});

				if (results.length >= limit) break;
			}
		};

		const titleMatches = await ctx.db
			.query("posts")
			.withSearchIndex("search_title", (q) =>
				q.search("title", args.term),
			)
			.take(limit);

		await pushDocs(titleMatches);

		if (results.length < limit) {
			const contentMatches = await ctx.db
				.query("posts")
				.withSearchIndex("search_content", (q) =>
					q.search("content", args.term),
				)
				.take(limit);

			await pushDocs(contentMatches);
		}

		return results;
	},
});
