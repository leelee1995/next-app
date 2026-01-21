"use client";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";

interface PostPresenceProps {
	roomId: Id<"posts">;
	userId: string;
}

export function PostPresence({ roomId, userId }: PostPresenceProps) {
	const presenceState = usePresence(api.presence, roomId, userId);

	if (!presenceState || presenceState.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			<p className="text-xs uppercase tracking-wide text-muted-foreground">
				Viewing now
			</p>
			<div>
				<FacePile presenceState={presenceState} />
			</div>
		</div>
	);
}
