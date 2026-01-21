"use client";

import Link from "next/link";
import { NextMark } from "./svg/next-mark";
import { buttonVariants } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import SignUpButton from "./sign-up-button";
import SignInButton from "./sign-in-button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HandlerButton from "./handler-button";
import { SearchInput } from "./search-input";

export function Navbar() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const router = useRouter();

	//	Signs out user
	function signOutHandler() {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					toast.success("Signed out successfully");
					router.push("/");
				},
				onError: (e) => {
					toast.error(e.error.message);
				},
			},
		});
	}
	return (
		<nav className="sticky top-0 z-50 flex justify-between py-4 items-center bg-background">
			<div className="flex items-center gap-4">
				<Link href="/" className="text-xl font-bold">
					<NextMark />
				</Link>
				<Link
					href="/about"
					className={buttonVariants({ variant: "ghost" })}
				>
					About
				</Link>
				<Link
					href="/post"
					className={buttonVariants({ variant: "ghost" })}
				>
					Posts
				</Link>
				<Link
					href="/create"
					className={buttonVariants({ variant: "ghost" })}
				>
					Create
				</Link>
			</div>
			<div className="flex gap-4">
				<div className="hidden md:block mr-2">
					<SearchInput />
				</div>
				<ThemeToggle />
				{isLoading ? null : isAuthenticated ? (
					<HandlerButton
						purpose="Sign out"
						handler={signOutHandler}
					/>
				) : (
					<>
						<SignUpButton />
						<SignInButton />
					</>
				)}
			</div>
		</nav>
	);
}
