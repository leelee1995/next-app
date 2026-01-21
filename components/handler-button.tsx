import { ReactNode } from "react";
import { Button } from "./ui/button";

interface HandlerButtonProps {
	disable?: boolean;
	disableContent?: ReactNode;
	purpose: string;
	handler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function HandlerButton({
	disable,
	disableContent,
	purpose,
	handler,
}: HandlerButtonProps) {
	return (
		<Button
			className="hover:cursor-pointer"
			disabled={disable}
			onClick={handler}
		>
			{disable ? disableContent : purpose}
		</Button>
	);
}
