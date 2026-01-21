import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST() {
	return NextResponse.json({ success: true });
}
