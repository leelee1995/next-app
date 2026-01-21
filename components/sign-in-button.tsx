import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function SignInButton() {
	return (
		<Link
			href="/auth/sign-in"
			className={buttonVariants({ variant: "secondary" })}
		>
			Sign in
		</Link>
	);
}
