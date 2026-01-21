"use client";

import { createPostAction } from "@/app/action";
import { postSchema } from "@/app/schemas/post";
import HandlerButton from "@/components/handler-button";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function Create() {
	const [isPending, startTransition] = useTransition();
	const form = useForm({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: "",
			content: "",
			image: undefined,
		},
	});

	function onSubmitHandler(values: z.infer<typeof postSchema>) {
		startTransition(async () => {
			await createPostAction(values);
		});
	}
	return (
		<div className="py-10">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
					Create Post
				</h1>
				<p className="text-xl text-muted-foreground pt-4">
					Share something to the world.
				</p>
			</div>
			<Card className="w-full max-w-xl mx-auto">
				<CardHeader>
					<CardTitle>Do we really need a title?</CardTitle>
					<CardDescription>
						Share something like your achievements, hobbies,
						memories or your thoughts.
					</CardDescription>
					<CardContent>
						<form onSubmit={form.handleSubmit(onSubmitHandler)}>
							<FieldGroup className="gap-y-4">
								<Controller
									name="title"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field>
											<FieldLabel>Title</FieldLabel>
											<Input
												aria-invalid={
													fieldState.invalid
												}
												placeholder="Your title"
												{...field}
											/>
											{fieldState.invalid && (
												<FieldError
													errors={[fieldState.error]}
												/>
											)}
										</Field>
									)}
								></Controller>
								<Controller
									name="content"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field>
											<FieldLabel>Content</FieldLabel>
											<Textarea
												aria-invalid={
													fieldState.invalid
												}
												placeholder="Type here..."
												{...field}
											/>
											{fieldState.invalid && (
												<FieldError
													errors={[fieldState.error]}
												/>
											)}
										</Field>
									)}
								></Controller>
								<Controller
									name="image"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field>
											<FieldLabel>Image</FieldLabel>
											<Input
												aria-invalid={
													fieldState.invalid
												}
												type="file"
												accept="image/*"
												onChange={(event) => {
													const file =
														event?.target
															.files?.[0];
													field.onChange(file);
												}}
											/>
											{fieldState.invalid && (
												<FieldError
													errors={[fieldState.error]}
												/>
											)}
										</Field>
									)}
								></Controller>
								<HandlerButton
									disable={isPending}
									disableContent={
										<>
											<Loader2 className="size-4 animate-spin" />
											<span>Loading...</span>
										</>
									}
									purpose="Create Post"
								/>
							</FieldGroup>
						</form>
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	);
}
