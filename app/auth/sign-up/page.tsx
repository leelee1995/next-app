"use client";

import { signupSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function SignUp() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: { email: "", name: "", password: "" },
	});

	function onSubmit(data: z.infer<typeof signupSchema>) {
		startTransition(async () => {
			await authClient.signUp.email({
				email: data.email,
				name: data.name,
				password: data.password,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Account created successfully!");
						router.push("/");
					},
					onError: (e) => {
						toast.error(e.error.message);
					},
				},
			});
		});
	}

	useEffect(() => {
		if (!isLoading && isAuthenticated) router.push("/");
	}, [isAuthenticated, isLoading, router]);

	if (isLoading || isAuthenticated) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="animate-spin" />
			</div>
		);
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>
					Create an account to get started.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup className="gap-y-4">
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Full Name</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										placeholder="John Doe"
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Email</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										type="email"
										placeholder="johndoe@company.com"
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Password</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										type="password"
										placeholder="Your password"
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>

						<Button
							disabled={isPending}
							className={
								isPending
									? "hover:cursor-not-allowed"
									: "hover:cursor-pointer"
							}
						>
							{isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									<span>Loading...</span>
								</>
							) : (
								<span>Sign up</span>
							)}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
