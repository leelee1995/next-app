import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ReactNode } from "react";

export default function SignUpButton(): ReactNode {
	return (
		<Link href="/auth/sign-up" className={buttonVariants()}>
			Sign up
		</Link>
	);
}
