"use client";

import { signinSchema } from "@/app/schemas/auth";
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

export default function SignIn() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(signinSchema),
		defaultValues: { email: "", password: "" },
	});

	function onSubmitHandler(data: z.infer<typeof signinSchema>) {
		startTransition(async () => {
			await authClient.signIn.email({
				email: data.email,
				password: data.password,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Signed in successfully");
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
				<CardTitle>Sign In</CardTitle>
				<CardDescription>Sign in to get started.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmitHandler)}>
					<FieldGroup className="gap-y-4">
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
							className={
								isPending
									? "hover:cursor-wait"
									: "hover:cursor-pointer"
							}
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									<span>Loading...</span>
								</>
							) : (
								<span>Sign in</span>
							)}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
